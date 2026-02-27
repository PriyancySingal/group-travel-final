/**
 * BehavioralModelEngine.js
 *
 * 4-Layer Real-Time Social Intelligence Model
 * NOT random math. Structured signals. Weighted scoring. Time decay. Cross-guest influence. Predictive trend.
 *
 * Layer 1: Base Social Propensity (Static Personality)
 * Layer 2: Live Engagement Signals (Dynamic with Time Decay)
 * Layer 3: Emotional State Model (Trend-Based)
 * Layer 4: Network Graph Influence (Connector Detection)
 */

class BehavioralModelEngine {
  constructor() {
    this.guests = new Map(); // guestId -> enriched guest data
    this.eventHistory = []; // Array of event snapshots for trend analysis
    this.connections = new Map(); // guestId -> { connectedGuestId: interactionCount }
    this.feedbackHistory = []; // Array of feedback entries
    this.modelConfig = {
      // Layer 2: Engagement calculation weights
      engagementWeights: {
        messageBoost: 0.8,
        activityBoost: 5,
        connectionBoost: 3,
        idlePenaltyPerMinute: 0.5,
        eventEnergyInfluence: 0.05,
        baseDecayRate: 0.1,
      },
      // Layer 1: Propensity calculation weights
      propensityWeights: {
        specialNeedsPenalty: 4,
        quietRoomPenalty: 5,
        dietaryComplexityPenalty: 2,
        profileCompletionBonus: 0.5, // per percent
        baseScore: 50,
      },
      // Layer 3: Emotional state thresholds
      emotionalThresholds: {
        excited: { minScore: 75, minTrend: "rising" },
        fatigued: { maxScore: 40, trend: "falling" },
        disengaged: { maxScore: 30, trend: "falling" },
        stressed: { minNegativeFeedback: 0.3 },
      },
      // Layer 4: Network influence
      networkThresholds: {
        connectorMinConnections: 5,
        isolatedMaxConnections: 1,
        influenceWeight: 0.15, // 15% of nearby guest engagement affects this guest
      },
      // Risk detection
      riskThresholds: {
        dropOffScore: 25,
        criticalIdleMinutes: 10,
        negativeSentimentThreshold: -20,
      },
    };
  }

  // ============================================================
  // LAYER 1: BASE SOCIAL PROPENSITY (Static Personality Layer)
  // ============================================================

  /**
   * Calculate base social propensity from static profile data.
   * This is computed once per guest and doesn't change often.
   *
   * Signals:
   * - specialNeeds (mobility, dietary restrictions reduce propensity)
   * - quietRoom preference (introverts start lower)
   * - profile completeness (more data = better prediction)
   * - dietary complexity (complex needs = more support needed)
   */
  calculateBasePropensity(guest) {
    const weights = this.modelConfig.propensityWeights;
    let score = weights.baseScore;

    // Special needs reduce social propensity (they need more support)
    const specialNeedsCount = (guest.specialNeeds || []).length;
    score -= specialNeedsCount * weights.specialNeedsPenalty;

    // Quiet room preference suggests lower social propensity
    if (guest.quietRoom) {
      score -= weights.quietRoomPenalty;
    }

    // Complex dietary requirements
    const dietaryCount = (guest.dietaryRequirements || []).length;
    score -= dietaryCount * weights.dietaryComplexityPenalty;

    // Profile completeness bonus (more data = more confident prediction)
    const profileFields = [
      "name",
      "email",
      "interests",
      "dietaryRequirements",
      "specialNeeds",
      "preferredActivities",
    ];
    const filledFields = profileFields.filter((f) => guest[f]).length;
    const completionScore = (filledFields / profileFields.length) * 100;
    score += completionScore * weights.profileCompletionBonus;

    // Clamp to valid range
    return Math.max(20, Math.min(80, Math.round(score)));
  }

  // ============================================================
  // LAYER 2: LIVE ENGAGEMENT SIGNALS (Dynamic Layer with Time Decay)
  // ============================================================

  /**
   * Initialize a guest in the behavioral model.
   * Sets up their base propensity and initial engagement state.
   */
  initializeGuest(guest) {
    const basePropensity = this.calculateBasePropensity(guest);

    const modelData = {
      // Identity
      id: guest._id || guest.id,
      name: guest.name,

      // Layer 1: Static baseline
      basePropensity,

      // Layer 2: Dynamic signals
      engagementScore: basePropensity, // Start at propensity
      engagementHistory: [basePropensity], // Track last 10 scores for trend
      lastActivityAt: Date.now(),

      // Activity counters (what simulation modifies)
      messagesSent: 0,
      activitiesJoined: 0,
      networkingConnectionsMade: 0,
      checkIns: 0,

      // Layer 3: Emotional state
      emotionalState: "neutral",
      energyLevel: "moderate",
      stressLevel: "normal",

      // Layer 4: Network position
      connections: {}, // guestId -> interactionCount
      influenceScore: 0,
      networkRole: "participant", // participant, connector, isolated

      // Risk flags
      riskFlags: [],
      riskLevel: "low", // low, medium, high

      // Sentiment tracking
      sentimentScore: 0, // -100 to +100
      feedbackEntries: [],
    };

    this.guests.set(modelData.id, modelData);
    this.connections.set(modelData.id, {});

    return modelData;
  }

  /**
   * Update engagement score based on activity signals.
   * NO randomness. Gradual movement. Influenced by event energy.
   *
   * Formula:
   * newScore = currentScore
   *   + (activityBoost * 0.1)
   *   - (idlePenalty)
   *   + (eventEnergy * influence)
   *   + (networkInfluence * crossGuestWeight)
   */
  updateEngagement(guestId, eventEnergy = 50) {
    const guest = this.guests.get(guestId);
    if (!guest) return null;

    const weights = this.modelConfig.engagementWeights;

    // Calculate activity boost from accumulated signals
    const activityBoost =
      guest.messagesSent * weights.messageBoost +
      guest.activitiesJoined * weights.activityBoost +
      guest.networkingConnectionsMade * weights.connectionBoost;

    // Calculate idle penalty based on time since last activity
    const minutesSinceActivity = (Date.now() - guest.lastActivityAt) / 60000;
    const idlePenalty = minutesSinceActivity * weights.idlePenaltyPerMinute;

    // Calculate network influence from connected guests
    const networkInfluence = this.calculateNetworkInfluence(guestId);

    // Base propensity acts as a "gravity" - engagement tends toward it when idle
    const propensityGravity = (guest.basePropensity - guest.engagementScore) * 0.02;

    // Compute new score
    let newScore =
      guest.engagementScore +
      activityBoost * 0.1 -
      idlePenalty +
      eventEnergy * weights.eventEnergyInfluence +
      networkInfluence * weights.networkThresholds.influenceWeight +
      propensityGravity;

    // Natural decay toward baseline over time (prevents runaway scores)
    newScore -= weights.baseDecayRate;

    // Clamp to valid range
    newScore = Math.max(0, Math.min(100, newScore));

    // Update guest state
    const previousScore = guest.engagementScore;
    guest.engagementScore = Math.round(newScore);

    // Update history (keep last 10)
    guest.engagementHistory.push(guest.engagementScore);
    if (guest.engagementHistory.length > 10) {
      guest.engagementHistory.shift();
    }

    // Detect significant change for trend analysis
    const scoreChange = guest.engagementScore - previousScore;
    if (Math.abs(scoreChange) > 2) {
      this.updateEmotionalState(guestId);
    }

    return {
      guestId,
      previousScore,
      newScore: guest.engagementScore,
      change: scoreChange,
      activityBoost,
      idlePenalty,
      networkInfluence,
    };
  }

  /**
   * Record an activity signal from the simulation.
   * The MODEL calculates engagement, SIMULATION just sends signals.
   */
  recordActivity(guestId, activityType, metadata = {}) {
    const guest = this.guests.get(guestId);
    if (!guest) return;

    // Update activity counters (simulation layer modifies these)
    switch (activityType) {
      case "message":
        guest.messagesSent += metadata.count || 1;
        break;
      case "activity_join":
        guest.activitiesJoined += 1;
        break;
      case "connection":
        guest.networkingConnectionsMade += 1;
        this.recordConnection(guestId, metadata.connectedGuestId);
        break;
      case "check_in":
        guest.checkIns += 1;
        break;
      case "feedback":
        this.recordFeedback(guestId, metadata.sentiment, metadata.text);
        break;
    }

    // Update last activity timestamp
    guest.lastActivityAt = Date.now();

    // Return current state for immediate feedback
    return this.getGuestState(guestId);
  }

  // ============================================================
  // LAYER 3: EMOTIONAL STATE MODEL (Trend-Based)
  // ============================================================

  /**
   * Update emotional state based on engagement trend and score.
   * Emotions follow patterns, not just current score.
   */
  updateEmotionalState(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest) return null;

    const score = guest.engagementScore;
    const trend = this.getTrend(guestId);
    const thresholds = this.modelConfig.emotionalThresholds;

    // Determine emotional state from score + trend combination
    let state = "neutral";
    let energy = "moderate";
    let stress = "normal";

    // High score + rising = excited
    if (score >= thresholds.excited.minScore && trend === "rising") {
      state = "excited";
      energy = "high";
    }
    // Low score + falling = disengaged (critical)
    else if (score <= thresholds.disengaged.maxScore && trend === "falling") {
      state = "disengaged";
      energy = "low";
      stress = "elevated";
    }
    // Moderate score + falling = fatigued
    else if (score <= thresholds.fatigued.maxScore && trend === "falling") {
      state = "fatigued";
      energy = "low";
    }
    // High score + stable = content
    else if (score >= 60 && trend === "stable") {
      state = "content";
      energy = "moderate";
    }
    // Check sentiment-based stress
    else if (guest.sentimentScore < thresholds.negativeSentimentThreshold) {
      state = "stressed";
      stress = "elevated";
      if (score > 50) energy = "high"; // Can be stressed but active
    }

    // Update guest state
    guest.emotionalState = state;
    guest.energyLevel = energy;
    guest.stressLevel = stress;

    return { state, energy, stress, trend, score };
  }

  /**
   * Calculate trend from engagement history.
   * Returns: "rising" | "falling" | "stable"
   */
  getTrend(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest || guest.engagementHistory.length < 3) {
      return "stable";
    }

    const history = guest.engagementHistory;
    const first = history[0];
    const last = history[history.length - 1];
    const diff = last - first;

    // Trend thresholds
    if (diff > 10) return "rising";
    if (diff < -10) return "falling";
    return "stable";
  }

  /**
   * Get momentum indicator (acceleration of trend)
   */
  getMomentum(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest || guest.engagementHistory.length < 5) {
      return "steady";
    }

    const h = guest.engagementHistory;
    const recentChange = h[h.length - 1] - h[h.length - 3];
    const previousChange = h[h.length - 3] - h[h.length - 5];

    const acceleration = recentChange - previousChange;

    if (acceleration > 5) return "accelerating";
    if (acceleration < -5) return "decelerating";
    return "steady";
  }

  // ============================================================
  // LAYER 4: NETWORK GRAPH INFLUENCE
  // ============================================================

  /**
   * Record a connection between two guests.
   */
  recordConnection(guestId1, guestId2) {
    if (!guestId2) return;

    // Update connections map for guest 1
    const conn1 = this.connections.get(guestId1) || {};
    conn1[guestId2] = (conn1[guestId2] || 0) + 1;
    this.connections.set(guestId1, conn1);

    // Update connections map for guest 2
    const conn2 = this.connections.get(guestId2) || {};
    conn2[guestId1] = (conn2[guestId1] || 0) + 1;
    this.connections.set(guestId2, conn2);

    // Update guest objects
    const guest1 = this.guests.get(guestId1);
    const guest2 = this.guests.get(guestId2);

    if (guest1) {
      guest1.connections[guestId2] = conn1[guestId2];
    }
    if (guest2) {
      guest2.connections[guestId1] = conn2[guestId1];
    }

    // Recalculate network roles
    this.recalculateNetworkRole(guestId1);
    this.recalculateNetworkRole(guestId2);
  }

  /**
   * Calculate network influence score for a guest.
   * Based on average engagement of connected guests.
   */
  calculateNetworkInfluence(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest) return 0;

    const connections = Object.keys(guest.connections);
    if (connections.length === 0) return 0;

    // Calculate weighted average of connected guests' engagement
    let totalWeight = 0;
    let weightedSum = 0;

    for (const connectedId of connections) {
      const connected = this.guests.get(connectedId);
      if (connected) {
        const weight = guest.connections[connectedId]; // interaction count as weight
        weightedSum += connected.engagementScore * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return 0;

    const averageConnectedEngagement = weightedSum / totalWeight;

    // Influence is the difference from current engagement
    // If connected guests are more engaged, they pull this guest up
    return averageConnectedEngagement - guest.engagementScore;
  }

  /**
   * Recalculate network role based on connection count.
   */
  recalculateNetworkRole(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest) return;

    const connectionCount = Object.keys(guest.connections).length;
    const thresholds = this.modelConfig.networkThresholds;

    // Calculate influence score (total interactions)
    guest.influenceScore = Object.values(guest.connections).reduce(
      (sum, count) => sum + count,
      0
    );

    // Determine role
    if (connectionCount >= thresholds.connectorMinConnections) {
      guest.networkRole = "connector";
    } else if (connectionCount <= thresholds.isolatedMaxConnections) {
      guest.networkRole = "isolated";
    } else {
      guest.networkRole = "participant";
    }
  }

  // ============================================================
  // EVENT ENERGY INDEX
  // ============================================================

  /**
   * Calculate overall event energy from all guest engagement.
   */
  calculateEventEnergy() {
    const guests = Array.from(this.guests.values());
    if (guests.length === 0) return 50;

    const totalEngagement = guests.reduce(
      (sum, g) => sum + g.engagementScore,
      0
    );
    const averageEngagement = totalEngagement / guests.length;

    // Calculate momentum from trend of averages
    const previousEnergy =
      this.eventHistory.length > 0
        ? this.eventHistory[this.eventHistory.length - 1].averageEngagement
        : averageEngagement;

    const momentum = averageEngagement - previousEnergy;

    // Determine momentum label
    let momentumLabel = "stable";
    if (momentum > 3) momentumLabel = "rising";
    if (momentum < -3) momentumLabel = "falling";

    // Count engaged vs disengaged guests
    const engagedCount = guests.filter((g) => g.engagementScore >= 60).length;
    const disengagedCount = guests.filter((g) => g.engagementScore <= 30).length;

    // Store snapshot
    this.eventHistory.push({
      timestamp: Date.now(),
      averageEngagement,
      momentum,
      guestCount: guests.length,
      engagedCount,
      disengagedCount,
    });

    // Keep only last 20 snapshots
    if (this.eventHistory.length > 20) {
      this.eventHistory.shift();
    }

    return {
      score: Math.round(averageEngagement),
      momentum: momentumLabel,
      momentumValue: momentum,
      participationRate: Math.round((engagedCount / guests.length) * 100),
      dropRisk: this.calculateDropRisk(guests),
      trend: this.getEventTrend(),
    };
  }

  /**
   * Get event-level trend from history.
   */
  getEventTrend() {
    if (this.eventHistory.length < 3) return "stable";

    const recent = this.eventHistory.slice(-3);
    const first = recent[0].averageEngagement;
    const last = recent[recent.length - 1].averageEngagement;
    const diff = last - first;

    if (diff > 5) return "rising";
    if (diff < -5) return "falling";
    return "stable";
  }

  // ============================================================
  // RISK DETECTION MODEL
  // ============================================================

  /**
   * Detect at-risk guests based on multiple factors.
   */
  detectRisks() {
    const risks = [];
    const thresholds = this.modelConfig.riskThresholds;

    for (const guest of this.guests.values()) {
      const guestRisks = [];

      // Risk 1: Low engagement + no activity
      if (
        guest.engagementScore < thresholds.dropOffScore &&
        guest.messagesSent === 0 &&
        guest.activitiesJoined === 0
      ) {
        guestRisks.push({
          type: "drop_off",
          severity: "high",
          message: "Early disengagement detected - no participation",
          recommendation: "Immediate targeted outreach recommended",
        });
      }

      // Risk 2: Prolonged idle time
      const idleMinutes = (Date.now() - guest.lastActivityAt) / 60000;
      if (idleMinutes > thresholds.criticalIdleMinutes) {
        guestRisks.push({
          type: "idle",
          severity: idleMinutes > 20 ? "high" : "medium",
          message: `No activity for ${Math.round(idleMinutes)} minutes`,
          recommendation: "Check if guest needs assistance or is experiencing issues",
        });
      }

      // Risk 3: Negative sentiment
      if (guest.sentimentScore < thresholds.negativeSentimentThreshold) {
        guestRisks.push({
          type: "negative_sentiment",
          severity: "high",
          message: `Negative feedback detected (${guest.sentimentScore})`,
          recommendation: "Address concerns immediately - escalate to event staff",
        });
      }

      // Risk 4: Falling trend + already low
      const trend = this.getTrend(guest.id);
      if (guest.engagementScore < 40 && trend === "falling") {
        guestRisks.push({
          type: "falling_engagement",
          severity: "medium",
          message: "Engagement declining from already low baseline",
          recommendation: "Proactive re-engagement suggested",
        });
      }

      // Risk 5: Isolation in social event
      if (
        guest.networkRole === "isolated" &&
        guest.activitiesJoined > 0 &&
        guest.engagementScore < 50
      ) {
        guestRisks.push({
          type: "isolation",
          severity: "medium",
          message: "Guest participating but forming no connections",
          recommendation: "Facilitated introduction to compatible guests",
        });
      }

      // Update guest risk state
      guest.riskFlags = guestRisks;
      guest.riskLevel = this.calculateRiskLevel(guestRisks);

      if (guestRisks.length > 0) {
        risks.push({
          guestId: guest.id,
          guestName: guest.name,
          riskLevel: guest.riskLevel,
          flags: guestRisks,
          engagementScore: guest.engagementScore,
          trend,
        });
      }
    }

    return risks.sort((a, b) => this.severityRank(b.riskLevel) - this.severityRank(a.riskLevel));
  }

  calculateRiskLevel(risks) {
    if (risks.some((r) => r.severity === "high")) return "high";
    if (risks.some((r) => r.severity === "medium")) return "medium";
    return "low";
  }

  severityRank(level) {
    return { high: 3, medium: 2, low: 1 }[level] || 0;
  }

  calculateDropRisk(guests) {
    const atRiskCount = guests.filter(
      (g) => g.engagementScore < 30 && g.messagesSent === 0
    ).length;
    const ratio = atRiskCount / guests.length;

    if (ratio > 0.2) return "high";
    if (ratio > 0.1) return "medium";
    return "low";
  }

  // ============================================================
  // SENTIMENT INTEGRATION
  // ============================================================

  /**
   * Record feedback and update sentiment score.
   * Sentiment affects emotional state and event energy.
   */
  recordFeedback(guestId, sentiment, text) {
    const guest = this.guests.get(guestId);
    if (!guest) return;

    const sentimentScore = this.calculateSentimentScore(sentiment, text);

    guest.feedbackEntries.push({
      timestamp: Date.now(),
      sentiment,
      text,
      score: sentimentScore,
    });

    // Update running sentiment score (exponential moving average)
    const alpha = 0.3; // Smoothing factor
    guest.sentimentScore =
      alpha * sentimentScore + (1 - alpha) * guest.sentimentScore;

    // Store in global history
    this.feedbackHistory.push({
      guestId,
      timestamp: Date.now(),
      sentiment,
      score: sentimentScore,
    });

    // Trigger emotional state update
    this.updateEmotionalState(guestId);

    return {
      guestId,
      sentimentScore: guest.sentimentScore,
      entry: guest.feedbackEntries[guest.feedbackEntries.length - 1],
    };
  }

  calculateSentimentScore(sentiment, text) {
    // Simple sentiment scoring
    const scores = {
      positive: 50,
      neutral: 0,
      negative: -50,
    };

    let score = scores[sentiment] || 0;

    // Adjust based on text analysis if provided
    if (text) {
      const positiveWords = ["great", "excellent", "amazing", "love", "fantastic"];
      const negativeWords = ["terrible", "awful", "hate", "bad", "poor", "disappointing"];

      const lowerText = text.toLowerCase();
      const posCount = positiveWords.filter((w) => lowerText.includes(w)).length;
      const negCount = negativeWords.filter((w) => lowerText.includes(w)).length;

      score += posCount * 10 - negCount * 10;
    }

    return Math.max(-100, Math.min(100, score));
  }

  /**
   * Get aggregate sentiment analysis for the event.
   */
  getSentimentAnalysis(timeWindowMinutes = 30) {
    const cutoff = Date.now() - timeWindowMinutes * 60000;
    const recent = this.feedbackHistory.filter((f) => f.timestamp > cutoff);

    if (recent.length === 0) {
      return { status: "no_data", message: "No feedback collected yet" };
    }

    const positive = recent.filter((f) => f.score > 20).length;
    const negative = recent.filter((f) => f.score < -20).length;
    const neutral = recent.length - positive - negative;

    const averageScore =
      recent.reduce((sum, f) => sum + f.score, 0) / recent.length;

    // Determine if action is needed
    const negativeRatio = negative / recent.length;
    const requiresAction = negativeRatio > 0.3 || averageScore < -10;

    return {
      status: averageScore > 20 ? "positive" : averageScore < -20 ? "negative" : "neutral",
      score: Math.round(averageScore),
      counts: { positive, neutral, negative, total: recent.length },
      negativeRatio,
      requiresAction,
      trend: this.getSentimentTrend(),
    };
  }

  getSentimentTrend() {
    if (this.feedbackHistory.length < 5) return "insufficient_data";

    const recent = this.feedbackHistory.slice(-5);
    const older = this.feedbackHistory.slice(-10, -5);

    if (older.length === 0) return "stable";

    const recentAvg =
      recent.reduce((sum, f) => sum + f.score, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, f) => sum + f.score, 0) / older.length;

    const diff = recentAvg - olderAvg;

    if (diff > 10) return "improving";
    if (diff < -10) return "declining";
    return "stable";
  }

  // ============================================================
  // PREDICTION ENGINE
  // ============================================================

  /**
   * Predict future engagement based on current trend.
   */
  predictEngagement(guestId, minutesAhead = 20) {
    const guest = this.guests.get(guestId);
    if (!guest || guest.engagementHistory.length < 3) {
      return { prediction: 50, confidence: 0.3 };
    }

    const history = guest.engagementHistory;
    const current = history[history.length - 1];

    // Calculate trend slope (points per update)
    const timeSteps = history.length - 1;
    const totalChange = history[history.length - 1] - history[0];
    const slope = totalChange / timeSteps;

    // Project forward
    // Assume updates happen roughly every 3-4 seconds in simulation
    const updatesAhead = (minutesAhead * 60) / 3.5;
    let predicted = current + slope * updatesAhead;

    // Confidence based on trend consistency
    const variance = this.calculateVariance(history);
    const confidence = Math.max(0.2, 1 - variance / 100);

    // Clamp prediction
    predicted = Math.max(0, Math.min(100, predicted));

    return {
      prediction: Math.round(predicted),
      confidence: Math.round(confidence * 100),
      trend: slope > 0 ? "rising" : slope < 0 ? "falling" : "stable",
      slope: slope.toFixed(2),
    };
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, v) => sum + v, 0) / squaredDiffs.length;
    return Math.sqrt(variance);
  }

  // ============================================================
  // NETWORKING INTELLIGENCE
  // ============================================================

  /**
   * Generate smart networking suggestions based on:
   * - Engagement similarity (birds of a feather)
   * - Shared base propensity (compatible personalities)
   * - Connection gaps (not already connected)
   * - Network role (connectors as facilitators)
   */
  generateNetworkingSuggestions() {
    const suggestions = [];
    const guests = Array.from(this.guests.values());

    // Find pairs with high compatibility but no connection
    for (let i = 0; i < guests.length; i++) {
      for (let j = i + 1; j < guests.length; j++) {
        const g1 = guests[i];
        const g2 = guests[j];

        // Skip if already connected
        if (g1.connections[g2.id]) continue;

        // Calculate compatibility score
        const compatibility = this.calculateCompatibility(g1, g2);

        if (compatibility.score > 70) {
          suggestions.push({
            type: "high_compatibility",
            guests: [g1, g2],
            compatibilityScore: compatibility.score,
            reasons: compatibility.reasons,
            urgency: compatibility.urgency,
            recommendedActivity: this.suggestNetworkingActivity(g1, g2),
          });
        }
      }
    }

    // Sort by compatibility and urgency
    return suggestions
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10);
  }

  calculateCompatibility(g1, g2) {
    let score = 50; // Base
    const reasons = [];

    // Similar engagement levels = good match
    const engagementDiff = Math.abs(g1.engagementScore - g2.engagementScore);
    if (engagementDiff < 15) {
      score += 15;
      reasons.push("Similar engagement levels");
    }

    // Similar base propensity = compatible personalities
    const propensityDiff = Math.abs(g1.basePropensity - g2.basePropensity);
    if (propensityDiff < 10) {
      score += 10;
      reasons.push("Compatible social styles");
    }

    // Both isolated = high priority to connect
    if (g1.networkRole === "isolated" && g2.networkRole === "isolated") {
      score += 10;
      reasons.push("Both guests are isolated");
    }

    // One connector + one isolated = good facilitation
    if (
      (g1.networkRole === "connector" && g2.networkRole === "isolated") ||
      (g2.networkRole === "connector" && g1.networkRole === "isolated")
    ) {
      score += 5;
      reasons.push("Connector can facilitate");
    }

    // Determine urgency
    let urgency = "low";
    if (g1.networkRole === "isolated" || g2.networkRole === "isolated") {
      urgency = "high";
    } else if (g1.engagementScore < 40 || g2.engagementScore < 40) {
      urgency = "medium";
    }

    return { score: Math.min(100, score), reasons, urgency };
  }

  suggestNetworkingActivity(g1, g2) {
    const bothIntroverted =
      g1.basePropensity < 40 && g2.basePropensity < 40;
    const bothExtroverted =
      g1.basePropensity > 60 && g2.basePropensity > 60;

    if (bothIntroverted) {
      return "Quiet one-on-one conversation in lounge area";
    }
    if (bothExtroverted) {
      return "Group activity or shared experience";
    }
    return "Structured introduction with guided topic";
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  getGuestState(guestId) {
    const guest = this.guests.get(guestId);
    if (!guest) return null;

    return {
      id: guest.id,
      name: guest.name,
      basePropensity: guest.basePropensity,
      engagementScore: guest.engagementScore,
      engagementHistory: guest.engagementHistory,
      trend: this.getTrend(guestId),
      momentum: this.getMomentum(guestId),
      emotionalState: guest.emotionalState,
      energyLevel: guest.energyLevel,
      stressLevel: guest.stressLevel,
      networkRole: guest.networkRole,
      influenceScore: guest.influenceScore,
      connectionCount: Object.keys(guest.connections).length,
      riskLevel: guest.riskLevel,
      riskFlags: guest.riskFlags,
      sentimentScore: guest.sentimentScore,
      prediction: this.predictEngagement(guestId),
    };
  }

  getAllGuestStates() {
    return Array.from(this.guests.keys()).map((id) => this.getGuestState(id));
  }

  getConnectors() {
    return this.getAllGuestStates().filter((g) => g.networkRole === "connector");
  }

  getIsolatedGuests() {
    return this.getAllGuestStates().filter((g) => g.networkRole === "isolated");
  }

  getAtRiskGuests() {
    return this.getAllGuestStates().filter(
      (g) => g.riskLevel === "high" || g.riskLevel === "medium"
    );
  }

  /**
   * Get complete system state for dashboard display.
   */
  getSystemState() {
    const guestStates = this.getAllGuestStates();
    const eventEnergy = this.calculateEventEnergy();
    const risks = this.detectRisks();
    const sentiment = this.getSentimentAnalysis();
    const networking = this.generateNetworkingSuggestions();

    // Generate AI insights from the model
    const insights = this.generateAIInsights(
      guestStates,
      eventEnergy,
      risks,
      sentiment
    );

    return {
      timestamp: Date.now(),
      guests: guestStates,
      eventEnergy,
      risks,
      sentiment,
      networking,
      insights,
      stats: {
        totalGuests: guestStates.length,
        averageEngagement: Math.round(
          guestStates.reduce((sum, g) => sum + g.engagementScore, 0) /
            guestStates.length || 0
        ),
        connectorCount: guestStates.filter((g) => g.networkRole === "connector")
          .length,
        isolatedCount: guestStates.filter((g) => g.networkRole === "isolated")
          .length,
        atRiskCount: risks.length,
      },
    };
  }

  generateAIInsights(guests, eventEnergy, risks, sentiment) {
    const insights = [];

    // Event-level insight
    if (eventEnergy.momentum === "rising") {
      insights.push({
        type: "positive",
        priority: "medium",
        title: "Event Energy Rising",
        text: `Engagement is trending upward (+${eventEnergy.momentumValue.toFixed(
          1
        )}%). Current phase is resonating with guests.`,
        action: "Maintain current activity level",
        icon: "📈",
      });
    } else if (eventEnergy.momentum === "falling") {
      insights.push({
        type: "alert",
        priority: "high",
        title: "Engagement Declining",
        text: `Event energy dropping (-${Math.abs(
          eventEnergy.momentumValue
        ).toFixed(1)}%). Attention needed.`,
        action: "Consider energizing activity or break",
        icon: "⚠️",
      });
    }

    // Risk insight
    if (risks.length > 0) {
      const highRisk = risks.filter((r) => r.riskLevel === "high");
      if (highRisk.length > 0) {
        insights.push({
          type: "critical",
          priority: "high",
          title: `${highRisk.length} Guest${
            highRisk.length > 1 ? "s" : ""
          } At Risk`,
          text: `${highRisk
            .map((r) => r.guestName)
            .slice(0, 3)
            .join(", ")}${
            highRisk.length > 3 ? ` +${highRisk.length - 3} more` : ""
          } showing disengagement signals.`,
          action: "Immediate outreach recommended",
          icon: "🚨",
        });
      }
    }

    // Sentiment insight
    if (sentiment.requiresAction) {
      insights.push({
        type: "warning",
        priority: "high",
        title: "Negative Sentiment Detected",
        text: `${Math.round(
          sentiment.negativeRatio * 100
        )}% of recent feedback is negative.`,
        action: "Address operational issues immediately",
        icon: "💢",
      });
    }

    // Network insight
    const isolatedCount = guests.filter((g) => g.networkRole === "isolated").length;
    if (isolatedCount > guests.length * 0.2) {
      insights.push({
        type: "opportunity",
        priority: "medium",
        title: "High Isolation Rate",
        text: `${isolatedCount} guests (${Math.round(
          (isolatedCount / guests.length) * 100
        )}%) haven't formed connections yet.`,
        action: "Facilitate structured networking",
        icon: "🕸️",
      });
    }

    // Connector insight
    const connectors = guests.filter((g) => g.networkRole === "connector");
    if (connectors.length > 0) {
      insights.push({
        type: "insight",
        priority: "low",
        title: `${connectors.length} Social Connector${
          connectors.length > 1 ? "s" : ""
        } Identified`,
        text: `${connectors
          .map((c) => c.name)
          .slice(0, 2)
          .join(", ")} ${
          connectors.length > 2 ? `+${connectors.length - 2} more` : ""
        } are driving guest interactions.`,
        action: "Leverage connectors for icebreaking",
        icon: "👑",
      });
    }

    return insights;
  }

  /**
   * Reset the model (useful for demo/testing).
   */
  reset() {
    this.guests.clear();
    this.eventHistory = [];
    this.connections.clear();
    this.feedbackHistory = [];
  }
}

export default new BehavioralModelEngine();
