const toLower = (value = "") => String(value).toLowerCase();

const average = (values = []) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const clampScore = (score) => Math.max(0, Math.min(100, score));

const socialOpennessScore = (guest) => {
  let score = 0;

  if (guest.preferredInteraction === "extrovert") score += 50;
  if (guest.preferredInteraction === "balanced") score += 35;
  if (guest.preferredInteraction === "introvert") score += 20;

  if (!guest.isFirstTime) score += 20;

  const interestsCount = (guest.interests || []).length;
  if (interestsCount >= 3) score += 30;
  else if (interestsCount === 2) score += 20;
  else if (interestsCount === 1) score += 10;

  return clampScore(score);
};

const socialLabel = (score) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const interestBalanceScore = (guests) => {
  const interestMap = {};
  guests.forEach((guest) => {
    (guest.interests || []).forEach((interest) => {
      interestMap[interest] = (interestMap[interest] || 0) + 1;
    });
  });

  const values = Object.values(interestMap);
  if (!values.length || !guests.length) return 0;
  const maxShared = Math.max(...values);
  return (maxShared / guests.length) * 100;
};

const interactionDiversityPenalty = (guests) => {
  const types = new Set(
    guests
      .map((guest) => guest.preferredInteraction)
      .filter(Boolean)
  );
  return types.size === 3 ? 10 : 0;
};

const interactionLabel = (score) => {
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
};

const energyScore = (guest) => {
  if (guest.energyLevel === "high") return 100;
  if (guest.energyLevel === "medium") return 60;
  if (guest.energyLevel === "low") return 30;
  return 60;
};

const energyLabel = (score) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const guestEngagementScore = (guest, context = {}) => {
  let score = 40;

  const interests = guest.interests || [];
  score += Math.min(interests.length * 9, 27);

  const sharedInterestStrength = context.sharedInterestStrength?.[String(guest._id)] || 0;
  score += Math.min(sharedInterestStrength * 2, 14);

  if (guest.preferredInteraction === "extrovert") score += 12;
  if (guest.preferredInteraction === "balanced") score += 6;
  if (guest.preferredInteraction === "introvert") score -= 8;
  if (guest.isFirstTime) score -= 10;
  if (guest.energyLevel === "high") score += 12;
  if (guest.energyLevel === "medium") score += 5;
  if (guest.energyLevel === "low") score -= 12;

  const status = toLower(guest.status);
  if (status === "confirmed") score += 8;
  if (status === "pending") score -= 3;
  if (status === "declined") score -= 25;

  const feedback = toLower(guest.feedback || "");
  if (["good", "great", "fun", "excited", "nice"].some((word) => feedback.includes(word))) {
    score += 7;
  }
  if (["bad", "boring", "confusing", "tired", "late"].some((word) => feedback.includes(word))) {
    score -= 10;
  }

  const profileSignals = [
    guest.age,
    guest.budget,
    guest.preferredInteraction,
    guest.availability,
    guest.energyLevel,
    guest.feedback,
    guest.status
  ];
  const profileCompleteness =
    profileSignals.filter((value) => value !== null && value !== undefined && String(value).trim() !== "").length /
    profileSignals.length;
  score += Math.round(profileCompleteness * 10);

  const cityKey = toLower(guest.city || "");
  if (cityKey) {
    const peers = context.cityCounts?.[cityKey] || 0;
    score += peers > 1 ? 6 : 2;
  }

  if (guest.updatedAt) {
    const updatedMs = new Date(guest.updatedAt).getTime();
    const ageMs = Date.now() - updatedMs;
    if (ageMs <= 24 * 60 * 60 * 1000) score += 6;
    else if (ageMs <= 7 * 24 * 60 * 60 * 1000) score += 3;
    else if (ageMs > 30 * 24 * 60 * 60 * 1000) score -= 5;
  }

  return Math.max(0, Math.min(score, 100));
};

const sentimentFromText = (text = "") => {
  const positiveWords = ["good", "great", "fun", "excited", "nice", "amazing", "excellent", "love", "happy"];
  const negativeWords = ["bad", "boring", "confusing", "tired", "late", "poor", "sad", "angry", "worst"];

  const normalized = toLower(text);
  let positive = 0;
  let negative = 0;

  positiveWords.forEach((word) => {
    if (normalized.includes(word)) positive += 1;
  });
  negativeWords.forEach((word) => {
    if (normalized.includes(word)) negative += 1;
  });

  if (positive > negative) return "positive";
  if (negative > positive) return "negative";
  return "neutral";
};

const predictGuestInteractions = (guests) => {
  const cityCounts = {};
  const interestCounts = {};

  guests.forEach((guest) => {
    const city = toLower(guest.city || "");
    if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;

    (guest.interests || []).forEach((interest) => {
      const key = toLower(interest).trim();
      if (!key) return;
      interestCounts[key] = (interestCounts[key] || 0) + 1;
    });
  });

  const sharedInterestStrength = {};
  guests.forEach((guest) => {
    const strength = (guest.interests || []).reduce((sum, interest) => {
      const key = toLower(interest).trim();
      if (!key) return sum;
      return sum + Math.max((interestCounts[key] || 0) - 1, 0);
    }, 0);
    sharedInterestStrength[String(guest._id)] = strength;
  });

  const context = { cityCounts, sharedInterestStrength };

  const guestScores = guests.map((guest) => ({
    guestId: guest._id,
    guestName: guest.name,
    city: guest.city || "Unknown",
    score: guestEngagementScore(guest, context),
    preferredInteraction: guest.preferredInteraction || "unspecified",
    isFirstTime: Boolean(guest.isFirstTime),
    energyLevel: guest.energyLevel || "unspecified",
    updatedAt: guest.updatedAt
  }));

  const opennessPerGuest = guests.map(socialOpennessScore);
  const socialOpenness = Math.round(average(opennessPerGuest));
  const interactionBalance = Math.round(
    clampScore(interestBalanceScore(guests) - interactionDiversityPenalty(guests))
  );
  const groupEnergyLevel = Math.round(average(guests.map(energyScore)));

  const overallScore = Math.round(
    average([socialOpenness, interactionBalance, groupEnergyLevel])
  );

  const opennessCounts = { extrovert: 0, balanced: 0, introvert: 0 };
  const energyCounts = { high: 0, medium: 0, low: 0 };
  const statusCounts = {};
  const interestCountsMap = new Map();
  let firstTimeCount = 0;
  let recentlyUpdatedCount = 0;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  guests.forEach((guest) => {
    const style = guest.preferredInteraction || "unspecified";
    if (opennessCounts[style] !== undefined) opennessCounts[style] += 1;

    const energy = guest.energyLevel || "unspecified";
    if (energyCounts[energy] !== undefined) energyCounts[energy] += 1;

    if (guest.isFirstTime) firstTimeCount += 1;
    if (guest.status) {
      statusCounts[guest.status] = (statusCounts[guest.status] || 0) + 1;
    }
    if (guest.updatedAt && new Date(guest.updatedAt).getTime() >= sevenDaysAgo) {
      recentlyUpdatedCount += 1;
    }

    (guest.interests || []).forEach((interest) => {
      const key = toLower(interest).trim();
      if (!key) return;
      interestCountsMap.set(key, (interestCountsMap.get(key) || 0) + 1);
    });
  });

  const totalGuests = guests.length || 1;
  const styleKnown = opennessCounts.extrovert + opennessCounts.balanced + opennessCounts.introvert || 1;
  const openRatio = (opennessCounts.extrovert + opennessCounts.balanced) / styleKnown;
  const lowEnergyRatio = energyCounts.low / totalGuests;
  const firstTimeRatio = firstTimeCount / totalGuests;
  const recentActivityRatio = recentlyUpdatedCount / totalGuests;

  const sharedInterests = Array.from(interestCountsMap.values()).filter((count) => count > 1).length;
  const isolatedInterests = Array.from(interestCountsMap.values()).filter((count) => count === 1).length;
  const sharedRatio = sharedInterests + isolatedInterests === 0
    ? 0
    : sharedInterests / (sharedInterests + isolatedInterests);

  const openness = socialLabel(socialOpenness);
  const balance = interactionLabel(interactionBalance);
  const energy = energyLabel(groupEnergyLevel);

  const risks = [];
  if (firstTimeRatio > 0.5) risks.push("High number of first time guests");
  if (lowEnergyRatio > 0.4) risks.push("Low energy trend detected");
  if (overallScore < 45) risks.push("Overall engagement is below target");
  if ((statusCounts.declined || 0) / totalGuests > 0.3) {
    risks.push("High declined status ratio");
  }

  const insights = [];
  if (sharedRatio >= 0.5) {
    insights.push("Group has good interest overlap");
  } else {
    insights.push("Interest overlap is low; use guided topic clusters");
  }
  if (firstTimeCount > 0) {
    insights.push("New attendees may need guided icebreakers");
  }
  if (lowEnergyRatio <= 0.4) {
    insights.push("Energy levels are stable");
  } else {
    insights.push("Schedule shorter sessions to manage fatigue risk");
  }
  if (recentActivityRatio >= 0.6) {
    insights.push("Guest activity updates are recent");
  }

  const avgInterests = average(guests.map((guest) => (guest.interests || []).length));
  const opennessReason = `${Math.round(openRatio * 100)}% guests are balanced/extrovert, average ${avgInterests.toFixed(1)} interests per guest, first-time ratio ${Math.round(firstTimeRatio * 100)}%.`;
  const balanceReason = `Top shared interest covers ${Math.round((sharedInterests + isolatedInterests === 0 ? 0 : Math.max(...Array.from(interestCountsMap.values(), (v) => v)) / totalGuests) * 100)}% of guests; interaction diversity penalty ${interactionDiversityPenalty(guests)}.`;
  const energyReason = `${Math.round(((energyCounts.high + energyCounts.medium) / totalGuests) * 100)}% guests report medium/high energy; low-energy ratio ${Math.round(lowEnergyRatio * 100)}%.`;

  return {
    overallScore,
    openness,
    balance,
    energy,
    dimensionScores: {
      socialOpenness: {
        score: socialOpenness,
        label: openness,
        reason: opennessReason
      },
      interactionBalance: {
        score: interactionBalance,
        label: balance,
        reason: balanceReason
      },
      energyLevel: {
        score: groupEnergyLevel,
        label: energy,
        reason: energyReason
      }
    },
    risks,
    insights,
    breakdown: {
      firstTimeRatio: Number(firstTimeRatio.toFixed(2)),
      lowEnergyRatio: Number(lowEnergyRatio.toFixed(2)),
      sharedInterestRatio: Number(sharedRatio.toFixed(2)),
      recentActivityRatio: Number(recentActivityRatio.toFixed(2)),
      statusCounts
    },
    guestScores: guestScores.sort((a, b) => b.score - a.score)
  };
};

const suggestNetworkingOpportunities = (guests) => {
  const guestNetworkingScore = (guest) => {
    let score = 0;

    if (guest.preferredInteraction === "extrovert") score += 40;
    if (guest.preferredInteraction === "balanced") score += 25;
    if (guest.preferredInteraction === "introvert") score += 10;

    const interests = (guest.interests || []).length;
    if (interests >= 3) score += 30;
    else if (interests === 2) score += 20;
    else if (interests === 1) score += 10;

    if (!guest.isFirstTime) score += 15;
    if (guest.energyLevel === "low") score -= 15;

    return clampScore(score);
  };

  const readinessScore = Math.round(average(guests.map(guestNetworkingScore)));
  const readinessLabel =
    readinessScore >= 70
      ? "High Networking Potential"
      : readinessScore >= 40
        ? "Moderate Networking Potential"
        : "Low Networking Potential";

  const groupsByInterest = {};
  guests.forEach((guest) => {
    (guest.interests || []).forEach((interest) => {
      const key = String(interest || "").trim();
      if (!key) return;
      if (!groupsByInterest[key]) groupsByInterest[key] = [];
      groupsByInterest[key].push(guest);
    });
  });

  const bestTimeForGroup = (members) => {
    const count = { morning: 0, afternoon: 0, evening: 0 };
    members.forEach((member) => {
      const slot = toLower(member.availability || "");
      if (count[slot] !== undefined) count[slot] += 1;
    });
    const order = ["morning", "afternoon", "evening"];
    return order.reduce((best, current) =>
      count[current] > count[best] ? current : best
    );
  };

  const sessionType = (members) => {
    const introverts = members.filter((member) => member.preferredInteraction === "introvert").length;
    const firstTimers = members.filter((member) => member.isFirstTime).length;

    if (introverts / members.length > 0.5) {
      return { type: "Small Group", reason: "High introvert ratio" };
    }
    if (firstTimers / members.length > 0.4) {
      return { type: "Guided Networking", reason: "High first-time attendee ratio" };
    }
    return { type: "Open Mixer", reason: "Balanced interaction mix" };
  };

  const groups = Object.entries(groupsByInterest)
    .filter(([, members]) => members.length >= 2)
    .map(([interest, members]) => {
      const bestTime = bestTimeForGroup(members);
      const { type, reason } = sessionType(members);
      return {
        id: `net_${toLower(interest).replace(/\s+/g, "_")}`,
        interest,
        count: members.length,
        bestTime,
        sessionType: type,
        reason,
        participants: members.map((guest) => ({
          id: guest._id,
          name: guest.name
        }))
      };
    })
    .sort((a, b) => b.count - a.count);

  const pairingScore = (a, b) => {
    let score = 0;

    const shared = (a.interests || []).filter((interest) => (b.interests || []).includes(interest)).length;
    score += Math.min(shared * 0.4, 0.4);

    if ((a.preferredInteraction || "") === (b.preferredInteraction || "")) score += 0.2;
    else score += 0.1;

    if (typeof a.age === "number" && typeof b.age === "number" && Math.abs(a.age - b.age) <= 5) {
      score += 0.2;
    }
    if ((a.energyLevel || "") === (b.energyLevel || "") && a.energyLevel) {
      score += 0.2;
    }

    return Math.min(score, 1);
  };

  const topPairings = [];
  for (let i = 0; i < guests.length; i += 1) {
    for (let j = i + 1; j < guests.length; j += 1) {
      const a = guests[i];
      const b = guests[j];
      const score = pairingScore(a, b);
      const shared = (a.interests || []).filter((interest) => (b.interests || []).includes(interest));
      const label = score >= 0.75 ? "Strong Match" : score >= 0.5 ? "Good Match" : "Weak Match";
      const interactionType = a.preferredInteraction === b.preferredInteraction
        ? a.preferredInteraction || "mixed"
        : "mixed";
      const sharedInterest = shared[0] || "general topics";
      topPairings.push({
        pairId: `${a._id}_${b._id}`,
        guest1: { id: a._id, name: a.name },
        guest2: { id: b._id, name: b.name },
        score: Number(score.toFixed(2)),
        label,
        sharedInterests: shared,
        icebreaker: `Both are interested in ${sharedInterest} and prefer ${interactionType} interactions`
      });
    }
  }

  topPairings.sort((x, y) => y.score - x.score);

  const introvertRatio = guests.length
    ? guests.filter((guest) => guest.preferredInteraction === "introvert").length / guests.length
    : 0;

  let recommendedAction = "Enable open networking session";
  if (readinessScore < 40) recommendedAction = "Introduce guided icebreakers";
  else if (introvertRatio > 0.5) recommendedAction = "Switch to small-group networking";
  else if (readinessScore > 70) recommendedAction = "Enable open networking session";
  else recommendedAction = "Run a structured mixed-format networking session";

  const supportGuests = [];
  if (introvertRatio > 0.5) supportGuests.push("Introverts");
  if (guests.length && guests.filter((guest) => guest.isFirstTime).length / guests.length > 0.4) {
    supportGuests.push("First-time attendees");
  }

  return {
    networkingReadiness: {
      score: readinessScore,
      label: readinessLabel
    },
    groups,
    topPairings: topPairings.slice(0, 8),
    recommendedAction,
    supportGuests
  };
};

const suggestGuestPairings = (guests) => {
  const candidates = [];

  for (let i = 0; i < guests.length; i += 1) {
    for (let j = i + 1; j < guests.length; j += 1) {
      const a = guests[i];
      const b = guests[j];
      const shared = (a.interests || []).filter((interest) => (b.interests || []).includes(interest));
      const ageGap = Math.abs((a.age || 0) - (b.age || 0));
      const budgetGap = Math.abs((a.budget || 0) - (b.budget || 0));

      let score = shared.length * 25;
      if (ageGap <= 5) score += 20;
      if (budgetGap <= 5000) score += 20;
      if ((a.preferredInteraction || "") === (b.preferredInteraction || "")) score += 10;

      candidates.push({
        pairId: `${a._id}_${b._id}`,
        guest1: { id: a._id, name: a.name },
        guest2: { id: b._id, name: b.name },
        sharedInterests: shared,
        compatibilityScore: Math.max(0, Math.min(100, score))
      });
    }
  }

  candidates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  const usedGuests = new Set();
  const pairings = [];

  for (const candidate of candidates) {
    const g1 = String(candidate.guest1.id);
    const g2 = String(candidate.guest2.id);

    if (usedGuests.has(g1) || usedGuests.has(g2)) continue;

    pairings.push(candidate);
    usedGuests.add(g1);
    usedGuests.add(g2);

    if (pairings.length >= Math.floor(guests.length / 2)) break;
  }

  return pairings;
};

const predictGuestEmotionalStates = (guests) => {
  const getEmotionalState = (guest) => {
    const sentiment = sentimentFromText(guest.feedback || "");
    const status = toLower(guest.status);
    if (status === "declined") return "disengaged";
    if (guest.energyLevel === "high") return "excited";
    if (guest.energyLevel === "medium") return "neutral";
    if (guest.energyLevel === "low" && guest.isFirstTime) return "anxious";
    if (guest.energyLevel === "low") return "tired";
    if (sentiment === "negative") return "disengaged";
    if (sentiment === "positive") return "excited";
    if (guest.isFirstTime) return "anxious";
    return "neutral";
  };

  const counts = {
    excited: 0,
    neutral: 0,
    tired: 0,
    disengaged: 0,
    anxious: 0
  };

  const perGuest = guests.map((guest) => {
    const inferred = getEmotionalState(guest);
    const sentiment = sentimentFromText(guest.feedback || "");
    const state = inferred === "anxious" ? "disengaged" : inferred;

    counts[state] = (counts[state] || 0) + 1;
    if (inferred === "anxious") counts.anxious += 1;

    return {
      guestId: guest._id,
      guestName: guest.name,
      state,
      inferred,
      sentiment,
      energyLevel: guest.energyLevel || "unknown",
      isFirstTime: Boolean(guest.isFirstTime)
    };
  });

  const total = guests.length || 1;
  const distribution = {
    excited: Math.round((counts.excited / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    tired: Math.round((counts.tired / total) * 100),
    disengaged: Math.round((counts.disengaged / total) * 100)
  };

  const groupMood = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0];
  const recommendations = [];

  if (groupMood === "tired") {
    recommendations.push("Reduce session length and add short breaks.");
    recommendations.push("Schedule lighter activities for the next session.");
  }
  if ((counts.anxious / total) > 0.25) {
    recommendations.push("Add guided introductions for first-time attendees.");
  }
  if (groupMood === "disengaged") {
    recommendations.push("Run quick pulse checks and refresh session format.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Current mood is stable. Maintain the same format.");
  }

  return {
    groupMood: groupMood.charAt(0).toUpperCase() + groupMood.slice(1),
    distribution,
    recommendations,
    counts,
    perGuest
  };
};

const analyzeSentiment = (guests) => {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  const feedbackItems = [];
  const now = Date.now();
  const last30Start = now - 30 * 60 * 1000;
  const prev30Start = now - 60 * 60 * 1000;
  const lastWindow = { positive: 0, neutral: 0, negative: 0 };
  const prevWindow = { positive: 0, neutral: 0, negative: 0 };

  guests.forEach((guest) => {
    if (!guest.feedback) return;
    const sentiment = sentimentFromText(guest.feedback);
    counts[sentiment] += 1;
    const ts = new Date(guest.updatedAt || guest.createdAt || now).getTime();

    if (ts >= last30Start) {
      lastWindow[sentiment] += 1;
    } else if (ts >= prev30Start && ts < last30Start) {
      prevWindow[sentiment] += 1;
    }

    feedbackItems.push({
      guestId: guest._id,
      guestName: guest.name,
      sentiment,
      feedback: guest.feedback,
      updatedAt: guest.updatedAt
    });
  });

  const total = counts.positive + counts.neutral + counts.negative;
  const negativeDelta = lastWindow.negative - prevWindow.negative;
  let trend = "Sentiment stable";
  if (total === 0) trend = "No feedback yet";
  else if (negativeDelta > 0) trend = "Negative feedback rising in last 30 minutes";
  else if (lastWindow.positive > prevWindow.positive) trend = "Sentiment improving";

  const alerts = [];
  const lowerFeedback = feedbackItems.map((item) => toLower(item.feedback));
  const confusingMentions = lowerFeedback.filter((text) => text.includes("confusing")).length;
  const tiredMentions = lowerFeedback.filter((text) => text.includes("tired")).length;
  if (confusingMentions >= 2) alerts.push("Multiple guests mentioned confusion");
  if (tiredMentions >= 2) alerts.push("Energy related complaints detected");
  if (negativeDelta > 0) alerts.push("Negative sentiment increased in the latest 30-minute window");

  const actions = [];
  if (confusingMentions >= 2) actions.push("Clarify instructions before the next activity.");
  if (tiredMentions >= 2) actions.push("Shorten sessions and add energizers.");
  if (total > 0 && counts.positive >= counts.negative + counts.neutral) {
    actions.push("Current format is working well, keep the same flow.");
  }

  return {
    totalFeedback: total,
    counts,
    trend,
    alerts,
    actions,
    windows: {
      last30Minutes: lastWindow,
      previous30Minutes: prevWindow
    },
    dominant:
      total === 0
        ? "neutral"
        : Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0],
    recentFeedback: feedbackItems
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8)
  };
};

export const generateInsights = (guests) => {
  return {
    socialEngagement: predictGuestInteractions(guests),
    networking: suggestNetworkingOpportunities(guests),
    pairings: suggestGuestPairings(guests),
    emotions: predictGuestEmotionalStates(guests),
    sentiment: analyzeSentiment(guests),
    generatedAt: new Date().toISOString()
  };
};
