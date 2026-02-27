import Guest from '../models/Guest.js';
import interactionEngine from './interactionEngine.js';

// ==========================================
// INTELLIGENT GUEST PAIRING ENGINE
// 1-to-1 compatibility with structured reasoning
// Scoring: 40% interests, 20% engagement, 20% goals, 10% history, 10% personality
// ==========================================

/**
 * Calculate pairing compatibility score between two guests
 * Formula:
 *   pairingScore =
 *     sharedInterestsScore * 0.4 +
 *     engagementCompatibility * 0.2 +
 *     goalsAlignment * 0.2 +
 *     noPriorBoost * 0.1 +
 *     personalityBalance * 0.1
 */
export const calculatePairingScore = (guestA, guestB, interactionHistory) => {
  // 1️⃣ SHARED INTERESTS (40% weight)
  const interestsA = guestA.interests || [];
  const interestsB = guestB.interests || [];
  const sharedInterests = interestsA.filter(i => interestsB.includes(i));
  
  // Calculate interest score: max 100 if all interests match
  const totalUniqueInterests = new Set([...interestsA, ...interestsB]).size;
  const interestScore = totalUniqueInterests > 0 
    ? Math.min(100, (sharedInterests.length / Math.min(interestsA.length, interestsB.length)) * 100)
    : 0;
  
  // 2️⃣ ENGAGEMENT COMPATIBILITY (20% weight)
  const scoreA = guestA.engagementScore || 30;
  const scoreB = guestB.engagementScore || 30;
  
  // Optimal pairing: one high + one medium, or both medium
  // Penalty for both very low (awkward) or both very high (chaotic)
  let engagementScore = 0;
  const avgEngagement = (scoreA + scoreB) / 2;
  const gap = Math.abs(scoreA - scoreB);
  
  if (avgEngagement >= 40 && avgEngagement <= 80 && gap <= 30) {
    // Good balance
    engagementScore = 100 - (gap * 2);
  } else if (avgEngagement < 40) {
    // Both disengaged - not ideal
    engagementScore = 30;
  } else if (avgEngagement > 80 && gap < 20) {
    // Both hyper - okay but not ideal
    engagementScore = 60;
  } else {
    // Mixed
    engagementScore = 70;
  }
  
  // 3️⃣ COMPLEMENTARY GOALS (20% weight)
  const goalsA = guestA.goals || [];
  const goalsB = guestB.goals || [];
  
  let goalsScore = 50; // baseline
  const sharedGoals = goalsA.filter(g => goalsB.includes(g));
  
  if (sharedGoals.length > 0) {
    // Shared intent is good
    goalsScore = 70 + (sharedGoals.length * 10);
  }
  
  // Special complementarity: Networker + Collaborator = excellent
  const hasNetworkingA = goalsA.includes('networking');
  const hasNetworkingB = goalsB.includes('networking');
  const hasBusinessA = goalsA.includes('business');
  const hasBusinessB = goalsB.includes('business');
  
  if ((hasNetworkingA && hasBusinessB) || (hasBusinessA && hasNetworkingB)) {
    goalsScore = 95; // Strong complementary match
  }
  
  // 4️⃣ NO PRIOR INTERACTION (10% weight)
  const g1Id = guestA._id?.toString();
  const g2Id = guestB._id?.toString();
  
  const priorInteractions = interactionHistory || [];
  const interactionCount = priorInteractions.filter(
    i => (i.guestId === g1Id && i.targetGuestId === g2Id) ||
         (i.guestId === g2Id && i.targetGuestId === g1Id)
  ).length;
  
  const historyScore = interactionCount === 0 ? 100 : Math.max(0, 100 - (interactionCount * 20));
  
  // 5️⃣ PERSONALITY BALANCE (10% weight)
  const p1 = guestA.personalityType || 'ambivert';
  const p2 = guestB.personalityType || 'ambivert';
  
  let personalityScore = 50;
  
  if (p1 === 'extravert' && p2 === 'introvert') {
    // Best balance - extravert draws out introvert
    personalityScore = 100;
  } else if (p1 === 'introvert' && p2 === 'extravert') {
    personalityScore = 100;
  } else if (p1 === p2) {
    // Same type - okay but not ideal for 1-on-1
    personalityScore = 60;
  } else {
    // One ambivert
    personalityScore = 80;
  }
  
  // Final weighted calculation
  const finalScore = Math.round(
    (interestScore * 0.4) +
    (engagementScore * 0.2) +
    (goalsScore * 0.2) +
    (historyScore * 0.1) +
    (personalityScore * 0.1)
  );
  
  // Build reasons array
  const reasons = [];
  
  if (sharedInterests.length > 0) {
    reasons.push(`${sharedInterests.length} shared interest${sharedInterests.length > 1 ? 's' : ''}: ${sharedInterests.slice(0, 2).join(', ')}`);
  }
  
  if (Math.abs(scoreA - scoreB) <= 20) {
    reasons.push('Complementary engagement levels');
  } else if (scoreA > 70 && scoreB < 50) {
    reasons.push('High engagement guest can energize conversation');
  }
  
  if (sharedGoals.length > 0) {
    reasons.push(`Both seeking: ${sharedGoals[0]}`);
  } else if ((hasNetworkingA && hasBusinessB) || (hasBusinessA && hasNetworkingB)) {
    reasons.push('Complementary goals: Networker ↔ Business focus');
  }
  
  if (interactionCount === 0) {
    reasons.push('Fresh connection - no prior interaction');
  }
  
  if ((p1 === 'extravert' && p2 === 'introvert') || (p1 === 'introvert' && p2 === 'extravert')) {
    reasons.push('Balanced personalities (introvert + extravert)');
  }
  
  // Suggested activity based on shared interests
  const suggestedActivity = generateSuggestedActivity(sharedInterests, p1, p2);
  
  // Icebreaker based on context
  const icebreaker = generateIcebreaker(sharedInterests, sharedGoals, guestA, guestB);
  
  // Expected outcome
  const expectedOutcome = generateExpectedOutcome(sharedInterests, sharedGoals, p1, p2);
  
  return {
    score: finalScore,
    breakdown: {
      interestScore: Math.round(interestScore),
      engagementScore: Math.round(engagementScore),
      goalsScore: Math.round(goalsScore),
      historyScore: Math.round(historyScore),
      personalityScore: Math.round(personalityScore)
    },
    reasons: reasons.length > 0 ? reasons : ['Balanced profiles'],
    sharedInterests: sharedInterests.slice(0, 3),
    sharedGoals: sharedGoals.slice(0, 2),
    priorInteractionCount: interactionCount,
    suggestedActivity,
    icebreaker,
    expectedOutcome,
    personalityMatch: `${p1} + ${p2}`,
    engagementGap: Math.abs(scoreA - scoreB)
  };
};

/**
 * Generate suggested activity based on shared interests and personalities
 */
const generateSuggestedActivity = (sharedInterests, p1, p2) => {
  const isQuietPair = p1 === 'introvert' && p2 === 'introvert';
  const isMixedPair = (p1 === 'introvert' && p2 === 'extravert') || 
                      (p1 === 'extravert' && p2 === 'introvert');
  
  if (sharedInterests.length === 0) {
    return isQuietPair 
      ? { activity: 'Quiet coffee chat', duration: '20 min', setting: 'Private corner' }
      : { activity: 'Casual introduction', duration: '15 min', setting: 'Networking lounge' };
  }
  
  const interest = sharedInterests[0].toLowerCase();
  
  const activityMap = {
    'travel': isQuietPair 
      ? { activity: 'Share travel photos/stories', duration: '20 min', setting: 'Quiet lounge' }
      : { activity: 'Plan dream trip discussion', duration: '30 min', setting: 'Cafe area' },
    'technology': isQuietPair
      ? { activity: 'Discuss favorite tech/tools', duration: '25 min', setting: 'Tech corner' }
      : { activity: 'Brainstorm app/startup ideas', duration: '30 min', setting: 'Innovation space' },
    'food': isQuietPair
      ? { activity: 'Recommend restaurants', duration: '15 min', setting: 'Dining area' }
      : { activity: 'Culinary experience planning', duration: '30 min', setting: 'Food court' },
    'sports': isQuietPair
      ? { activity: 'Discuss favorite teams/sports', duration: '20 min', setting: 'Quiet area' }
      : { activity: 'Plan activity or watch game', duration: '45 min', setting: 'Activity room' },
    'music': { activity: 'Share music recommendations', duration: '20 min', setting: 'Lounge' },
    'reading': { activity: 'Book recommendations exchange', duration: '20 min', setting: 'Library corner' },
    'photography': { activity: 'Photo sharing/tips', duration: '25 min', setting: 'Scenic spot' },
    'startup': isMixedPair
      ? { activity: 'Pitch idea and get feedback', duration: '30 min', setting: 'Business lounge' }
      : { activity: 'Business networking discussion', duration: '25 min', setting: 'Meeting area' },
    'networking': { activity: 'Professional connection chat', duration: '20 min', setting: 'Networking zone' }
  };
  
  return activityMap[interest] || { 
    activity: `Discuss ${sharedInterests[0]}`, 
    duration: isQuietPair ? '20 min' : '25 min', 
    setting: isQuietPair ? 'Quiet corner' : 'Lounge area' 
  };
};

/**
 * Generate contextual icebreaker
 */
const generateIcebreaker = (sharedInterests, sharedGoals, guestA, guestB) => {
  if (sharedInterests.length > 0) {
    return `"I noticed you both are interested in ${sharedInterests[0]}! What got you into that?"`;
  }
  
  if (sharedGoals.length > 0) {
    const goal = sharedGoals[0];
    if (goal === 'networking') {
      return `"What brings you to this event? Looking to meet people in any specific industry?"`;
    }
    if (goal === 'learning') {
      return `"What are you hoping to learn from this event?"`;
    }
    return `"I see you're both here to ${goal}. What motivated that for you?"`;
  }
  
  const p1 = guestA.personalityType || 'ambivert';
  const p2 = guestB.personalityType || 'ambivert';
  
  if ((p1 === 'extravert' && p2 === 'introvert') || (p1 === 'introvert' && p2 === 'extravert')) {
    return `"You two seem like you'd have an interesting conversation - different perspectives! What brings you both here?"`;
  }
  
  return `"What brings you to this event? I'd love to hear both of your stories."`;
};

/**
 * Generate expected outcome description
 */
const generateExpectedOutcome = (sharedInterests, sharedGoals, p1, p2) => {
  const outcomes = [];
  
  if (sharedInterests.length > 0) {
    outcomes.push(`Exchange ideas about ${sharedInterests.slice(0, 2).join(' and ')}`);
  }
  
  if (sharedGoals.includes('networking')) {
    outcomes.push('Professional connection established');
  }
  
  if (sharedGoals.includes('business')) {
    outcomes.push('Potential collaboration opportunity identified');
  }
  
  if (sharedGoals.includes('learning')) {
    outcomes.push('Knowledge sharing on topics of mutual interest');
  }
  
  if ((p1 === 'extravert' && p2 === 'introvert') || (p1 === 'introvert' && p2 === 'extravert')) {
    outcomes.push('Balanced perspective exchange');
  }
  
  if (outcomes.length === 0) {
    outcomes.push('New connection formed');
    outcomes.push('Cross-pollination of ideas');
  }
  
  return outcomes.slice(0, 2);
};

/**
 * Get optimal pairings for an event
 * Returns top pairings sorted by score
 */
export const getOptimalPairings = async (eventId, minScore = 65, maxResults = 15) => {
  const guests = await Guest.find({ eventId, status: { $ne: 'unavailable' } });
  
  if (guests.length < 2) {
    return { pairings: [], stats: { total: 0, high: 0, medium: 0, low: 0 } };
  }
  
  // Get interaction history
  const interactionHistory = interactionEngine.getEventInteractionsList(eventId, { 
    type: 'message',
    limit: 1000 
  });
  
  const pairings = [];
  
  // Calculate scores for all pairs
  for (let i = 0; i < guests.length; i++) {
    for (let j = i + 1; j < guests.length; j++) {
      const guestA = guests[i];
      const guestB = guests[j];
      
      // Skip if both are marked as not open to networking
      if (guestA.openToNetworking === false && guestB.openToNetworking === false) continue;
      
      const result = calculatePairingScore(guestA, guestB, interactionHistory);
      
      // Only include if meets minimum score
      if (result.score >= minScore) {
        pairings.push({
          pairId: `${guestA._id}_${guestB._id}`,
          guest1: {
            id: guestA._id,
            name: guestA.name,
            personalityType: guestA.personalityType || 'ambivert',
            engagementScore: guestA.engagementScore || 30,
            engagementTrend: guestA.engagementTrend || 'stable',
            interests: (guestA.interests || []).slice(0, 3),
            goals: (guestA.goals || []).slice(0, 2),
            currentLocation: guestA.currentLocation || 'lobby'
          },
          guest2: {
            id: guestB._id,
            name: guestB.name,
            personalityType: guestB.personalityType || 'ambivert',
            engagementScore: guestB.engagementScore || 30,
            engagementTrend: guestB.engagementTrend || 'stable',
            interests: (guestB.interests || []).slice(0, 3),
            goals: (guestB.goals || []).slice(0, 2),
            currentLocation: guestB.currentLocation || 'lobby'
          },
          compatibilityScore: result.score,
          scoreBreakdown: result.breakdown,
          reasons: result.reasons,
          sharedInterests: result.sharedInterests,
          sharedGoals: result.sharedGoals,
          suggestedActivity: result.suggestedActivity,
          icebreaker: result.icebreaker,
          expectedOutcome: result.expectedOutcome,
          personalityMatch: result.personalityMatch,
          priorInteractionCount: result.priorInteractionCount,
          priority: result.score >= 80 ? 'high' : result.score >= 70 ? 'medium' : 'low'
        });
      }
    }
  }
  
  // Sort by score descending
  pairings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  // Stats
  const stats = {
    total: pairings.length,
    high: pairings.filter(p => p.priority === 'high').length,
    medium: pairings.filter(p => p.priority === 'medium').length,
    low: pairings.filter(p => p.priority === 'low').length,
    averageScore: pairings.length > 0 
      ? Math.round(pairings.reduce((sum, p) => sum + p.compatibilityScore, 0) / pairings.length)
      : 0
  };
  
  return {
    pairings: pairings.slice(0, maxResults),
    stats
  };
};

/**
 * Get pairing suggestions for a specific guest
 */
export const getPairingsForGuest = async (eventId, guestId, maxResults = 5) => {
  const targetGuest = await Guest.findById(guestId);
  if (!targetGuest) return { pairings: [] };
  
  const otherGuests = await Guest.find({ 
    eventId, 
    _id: { $ne: guestId },
    status: { $ne: 'unavailable' }
  });
  
  const interactionHistory = interactionEngine.getEventInteractionsList(eventId, { 
    type: 'message',
    limit: 500 
  });
  
  const scoredPairings = otherGuests.map(guest => {
    const result = calculatePairingScore(targetGuest, guest, interactionHistory);
    return {
      pairId: `${guestId}_${guest._id}`,
      guest: {
        id: guest._id,
        name: guest.name,
        personalityType: guest.personalityType || 'ambivert',
        engagementScore: guest.engagementScore || 30,
        interests: (guest.interests || []).slice(0, 3)
      },
      compatibilityScore: result.score,
      reasons: result.reasons,
      suggestedActivity: result.suggestedActivity,
      icebreaker: result.icebreaker
    };
  });
  
  // Sort and filter
  scoredPairings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  return {
    targetGuest: {
      id: targetGuest._id,
      name: targetGuest.name
    },
    pairings: scoredPairings.filter(p => p.compatibilityScore >= 60).slice(0, maxResults)
  };
};

export default {
  calculatePairingScore,
  getOptimalPairings,
  getPairingsForGuest
};
