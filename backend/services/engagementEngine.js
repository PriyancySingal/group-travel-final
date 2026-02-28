import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';

// ==========================================
// TUNED ENGAGEMENT ENGINE
// Weight distribution for hackathon realism
// ==========================================
//
// FINAL SCORE FORMULA:
// Score = BasePropensity (30%) + LiveActivity (40%) + 
//         SocialGraphInfluence (15%) + SentimentImpact (10%) + 
//         MomentumAdjustment (5%)
//
// TARGET RANGES:
// - Connectors: 80-95 (clearly above rest)
// - Balanced: 50-75 (stable middle)
// - Risk cases: <35 (visible drop-off)
// - Event Energy: 65-75 (realistic demo range)

// Event type scoring weights (real-time activity)
const EVENT_WEIGHTS = {
  check_in: 8,
  message_sent: 0.8,      // Tuned: +0.8 per message (was 2)
  message_received: 0.5,
  joined_activity: 6,     // Tuned: +6 per activity (was 10)
  left_activity: -3,
  networking_connection: 4, // Tuned: +4 per connection (was 15)
  feedback_submitted_positive: 5,
  feedback_submitted_negative: -8,
  inactivity_timeout: -3  // Tuned: -3 per 10min idle (was -6)
};

// In-memory state for fast access (hackathon mode)
// In production, use Redis
const eventState = new Map(); // eventId -> { guests: Map, lastUpdate: timestamp }

/**
 * Get or create event state
 */
const getEventState = (eventId) => {
  if (!eventState.has(eventId)) {
    eventState.set(eventId, {
      guests: new Map(),
      lastUpdate: Date.now(),
      phase: 'arrival'
    });
  }
  return eventState.get(eventId);
};

/**
 * Get or create guest state within event
 */
const getGuestState = (eventId, guestId, guestData = null) => {
  const state = getEventState(eventId);
  if (!state.guests.has(guestId)) {
    state.guests.set(guestId, {
      guestId,
      eventId,
      engagementScore: 30, // baseline
      engagementHistory: [], // last 5 scores for trend
      lastActivityAt: Date.now(),
      totalMessages: 0,
      activitiesJoined: 0,
      connections: 0,
      sentimentScore: 0,
      riskLevel: 'low',
      trend: 'stable',
      events: [], // recent events
      ...guestData
    });
  }
  return state.guests.get(guestId);
};

/**
 * Calculate base propensity score (30% of final score)
 * Prevents everyone from starting at 50
 * Range: 35-65 (controlled baseline)
 */
const calculateBasePropensity = (guestData) => {
  let base = 50;

  // Goals influence (tuned weights)
  if (guestData.goals?.includes('Networking')) base += 8;
  if (guestData.goals?.includes('Collaboration')) base += 5;
  if (guestData.goals?.includes('Funding')) base += 3;
  if (guestData.goals?.includes('Learning')) base += 2;

  // Personality adjustments
  if (guestData.personalityType === 'introvert') base -= 5;
  if (guestData.personalityType === 'extravert') base += 5;

  // Special conditions
  if (guestData.quietRoom) base -= 5;
  if (guestData.firstTimeEvent) base += 2;
  if (guestData.openToNetworking === false) base -= 3;

  // Clamp: 35-65 (no extreme starting positions)
  return Math.max(35, Math.min(65, base));
};

/**
 * Calculate live activity contribution (40% of final score)
 * Max ±25 from base to maintain stability
 */
const calculateLiveActivityScore = (state, eventWeights) => {
  let activityScore = 0;

  // Messages: +0.8 each
  activityScore += (state.totalMessages || 0) * eventWeights.message_sent;

  // Activities: +6 each
  activityScore += (state.activitiesJoined || 0) * eventWeights.joined_activity;

  // Connections: +4 each
  activityScore += (state.connections || 0) * eventWeights.networking_connection;

  // Clamp: max ±25 contribution
  return Math.max(-25, Math.min(25, activityScore));
};

/**
 * Calculate social graph influence (15% of final score)
 * Connections count * 2, capped at +15
 */
const calculateSocialGraphInfluence = (state) => {
  return Math.min((state.connections || 0) * 2, 15);
};

/**
 * Calculate sentiment impact (10% of final score)
 * Positive: +5 each, Negative: -8 each, capped at ±10
 */
const calculateSentimentImpact = (sentimentScore, feedback = null) => {
  let impact = 0;

  // From sentiment score
  if (sentimentScore > 20) impact += 5;
  if (sentimentScore < -20) impact -= 8;

  // From feedback text analysis
  if (feedback) {
    const positiveWords = ['amazing', 'great', 'best', 'loved', 'excited', 'fantastic', 'wonderful', 'excellent', 'perfect', 'awesome'];
    const negativeWords = ['tired', 'overwhelming', 'crowded', 'stress', 'disappointed', 'bad', 'terrible', 'awful', 'boring'];

    const lowerFeedback = feedback.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerFeedback.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerFeedback.includes(w)).length;

    impact += Math.min(positiveCount * 3, 5);
    impact -= Math.min(negativeCount * 4, 8);
  }

  // Clamp: ±10 max
  return Math.max(-10, Math.min(10, impact));
};

/**
 * Calculate momentum adjustment (5% of final score)
 * Rising: +5, Falling: -5, Stable: 0
 */
const calculateMomentumAdjustment = (history) => {
  if (!history || history.length < 2) return 0;
  const change = history[history.length - 1] - history[0];
  if (change > 10) return 5;
  if (change < -10) return -5;
  return 0;
};

/**
 * Calculate time decay
 * Every 10 minutes since last activity, engagement drops by 3 points
 * Max 15 points decay to prevent extreme drops
 */
const applyTimeDecay = (guestState) => {
  const now = Date.now();
  const tenMinuteBlocks = Math.floor((now - guestState.lastActivityAt) / 600000);
  const decay = Math.min(tenMinuteBlocks * 3, 15); // cap at 15 points
  return Math.max(0, guestState.engagementScore - decay);
};

/**
 * COMPREHENSIVE ENGAGEMENT SCORING
 * Uses tuned weights for realistic distribution
 */
const calculateTunedEngagementScore = (state, guestData) => {
  // 1. Base propensity (30%)
  const base = calculateBasePropensity(guestData);

  // 2. Live activity contribution (40%)
  const activityScore = calculateLiveActivityScore(state, EVENT_WEIGHTS);

  // 3. Social graph influence (15%)
  const graphInfluence = calculateSocialGraphInfluence(state);

  // 4. Sentiment impact (10%)
  const sentimentImpact = calculateSentimentImpact(state.sentimentScore, guestData.feedback);

  // 5. Momentum adjustment (5%)
  const momentum = calculateMomentumAdjustment(state.engagementHistory);

  // Final calculation
  let finalScore = base + activityScore + graphInfluence + sentimentImpact + momentum;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(finalScore)));
};

/**
 * Update trend based on engagement history
 */
const updateTrend = (guestState, newScore) => {
  const history = guestState.engagementHistory;
  history.push(newScore);
  if (history.length > 5) history.shift();

  if (history.length < 2) return 'stable';

  const first = history[0];
  const last = history[history.length - 1];
  const change = last - first;

  if (change > 10) return 'rising';
  if (change < -10) return 'falling';
  return 'stable';
};

/**
 * Detect risk level based on engagement + trend
 */
const detectRisk = (guestState) => {
  const score = guestState.engagementScore;
  const trend = guestState.trend;
  const idleMinutes = Math.floor((Date.now() - guestState.lastActivityAt) / 60000);

  // HIGH RISK: Very low engagement + falling trend + idle
  if (score < 25 && trend === 'falling' && idleMinutes > 10) {
    return {
      level: 'high',
      reason: 'critically_low_engagement',
      recommendation: 'Immediate check-in needed. Consider personal outreach or one-on-one activity.'
    };
  }

  // HIGH RISK: Negative sentiment detected
  if (guestState.sentimentScore < -30) {
    return {
      level: 'high',
      reason: 'negative_sentiment',
      recommendation: 'Address concerns immediately. Escalate to event manager.'
    };
  }

  // MEDIUM RISK: Declining engagement
  if (trend === 'falling' && score < 40) {
    return {
      level: 'medium',
      reason: 'declining_engagement',
      recommendation: 'Proactive engagement suggested. Invite to small group activity.'
    };
  }

  // MEDIUM RISK: Idle too long
  if (idleMinutes > 15 && score > 0) {
    return {
      level: 'medium',
      reason: 'prolonged_inactivity',
      recommendation: 'Send friendly prompt or check if they need assistance.'
    };
  }

  // LOW RISK: Just lower engagement
  if (score < 35) {
    return {
      level: 'low',
      reason: 'lower_engagement',
      recommendation: 'Monitor and offer optional activities.'
    };
  }

  return { level: 'none', reason: null, recommendation: null };
};

/**
 * Process an engagement event
 * This is the core engine - every guest action calls this
 */
export const processEngagementEvent = async (eventId, guestId, eventType, metadata = {}) => {
  try {
    // Get guest data from DB for base properties
    let guestData = await Guest.findById(guestId);
    if (!guestData) {
      // Try to find by string ID
      guestData = await Guest.findOne({ _id: guestId });
    }

    if (!guestData) {
      console.warn(`Guest ${guestId} not found for event ${eventId}`);
      return null;
    }

    // Get or create state
    const state = getGuestState(eventId, guestId, {
      name: guestData.name,
      personalityType: guestData.personalityType || 'ambivert',
      interests: guestData.interests || []
    });

    // Apply time decay first
    const decayedScore = applyTimeDecay(state);
    state.engagementScore = decayedScore; // Update for calculation

    // Apply event weight for real-time adjustment
    const weight = EVENT_WEIGHTS[eventType] || 0;
    state.engagementScore += weight;

    // Recalculate with tuned comprehensive scoring
    const newScore = calculateTunedEngagementScore(state, guestData);

    // Clamp to 0-100
    const clampedScore = Math.max(0, Math.min(100, newScore));

    // Update state
    state.engagementScore = Math.round(clampedScore);
    state.lastActivityAt = Date.now();
    state.events.push({ type: eventType, timestamp: Date.now(), metadata });
    if (state.events.length > 10) state.events.shift();

    // Update counters
    if (eventType === 'message_sent') state.totalMessages++;
    if (eventType === 'joined_activity') state.activitiesJoined++;
    if (eventType === 'networking_connection') state.connections++;
    if (eventType === 'feedback_submitted_positive') state.sentimentScore += 15;
    if (eventType === 'feedback_submitted_negative') state.sentimentScore -= 20;

    // Update trend
    state.trend = updateTrend(state, state.engagementScore);

    // Detect risk
    const risk = detectRisk(state);
    state.riskLevel = risk.level;
    state.riskReason = risk.reason;
    state.riskRecommendation = risk.recommendation;

    // Persist to DB (async, don't block)
    try {
      await AIEngagement.findOneAndUpdate(
        { eventId, guestId },
        {
          $set: {
            engagementScore: state.engagementScore,
            activityLevel: state.engagementScore > 70 ? 'very_high' : state.engagementScore > 50 ? 'high' : state.engagementScore > 30 ? 'moderate' : 'low',
            lastActivityAt: new Date(),
            trend: state.trend,
            riskLevel: state.riskLevel
          },
          $inc: {
            messagesSent: eventType === 'message_sent' ? 1 : 0,
            groupActivitiesJoined: eventType === 'joined_activity' ? 1 : 0,
            networkingConnectionsMade: eventType === 'networking_connection' ? 1 : 0
          },
          $push: {
            eventHistory: { type: eventType, timestamp: new Date(), metadata }
          }
        },
        { upsert: true, new: true }
      );
    } catch (dbError) {
      console.error('Failed to persist engagement:', dbError);
      // Continue - in-memory state is still valid
    }

    return state;
  } catch (error) {
    console.error('processEngagementEvent error:', error);
    return null;
  }
};

/**
 * Get event-level metrics
 */
export const getEventMetrics = (eventId) => {
  const state = getEventState(eventId);
  const guests = Array.from(state.guests.values());

  if (guests.length === 0) {
    return {
      eventEnergy: 0,
      participationRate: 0,
      momentum: 'stable',
      atRiskCount: 0,
      highEngagementCount: 0
    };
  }

  const scores = guests.map(g => g.engagementScore);
  const avgScore = scores.reduce((a, b) => a + b, 0) / guests.length;

  const trends = guests.map(g => g.trend);
  const risingCount = trends.filter(t => t === 'rising').length;
  const fallingCount = trends.filter(t => t === 'falling').length;

  const atRisk = guests.filter(g => g.riskLevel === 'high' || g.riskLevel === 'medium');
  const highEngagement = guests.filter(g => g.engagementScore > 70);

  return {
    eventEnergy: Math.round(avgScore),
    participationRate: Math.round((guests.filter(g => g.engagementScore > 0).length / guests.length) * 100),
    momentum: risingCount > fallingCount ? 'rising' : fallingCount > risingCount ? 'falling' : 'stable',
    atRiskCount: atRisk.length,
    highEngagementCount: highEngagement.length,
    totalGuests: guests.length,
    activeGuests: guests.filter(g => g.engagementScore > 30).length
  };
};

/**
 * Get all guest states for an event
 */
export const getEventGuestStates = (eventId) => {
  const state = getEventState(eventId);
  return Array.from(state.guests.values());
};

/**
 * Get specific guest state
 */
export const getGuestStateById = (eventId, guestId) => {
  const state = getEventState(eventId);
  return state.guests.get(guestId) || null;
};

/**
 * Clear old event states (cleanup)
 */
export const cleanupOldEvents = (maxAgeMs = 24 * 60 * 60 * 1000) => {
  const now = Date.now();
  for (const [eventId, state] of eventState.entries()) {
    if (now - state.lastUpdate > maxAgeMs) {
      eventState.delete(eventId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupOldEvents, 60 * 60 * 1000);

export default {
  processEngagementEvent,
  getEventMetrics,
  getEventGuestStates,
  getGuestStateById,
  EVENT_WEIGHTS
};
