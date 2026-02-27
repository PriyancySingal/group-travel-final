import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';
import sentimentEngine from './sentimentEngine.js';

// ==========================================
// EMOTIONAL INTELLIGENCE ENGINE
// Tracks guest emotional states based on engagement + behavior + sentiment
// ==========================================

/**
 * Calculate engagement trend from history
 * Returns: 'rising', 'falling', 'stable'
 */
export const calculateEngagementTrend = (engagementHistory) => {
  if (!engagementHistory || engagementHistory.length < 3) {
    return 'stable';
  }
  
  // Get last 5 entries
  const recent = engagementHistory.slice(-5);
  
  if (recent.length < 3) return 'stable';
  
  // Calculate slope using simple linear regression
  const n = recent.length;
  const sumX = recent.reduce((sum, _, i) => sum + i, 0);
  const sumY = recent.reduce((sum, entry) => sum + (entry.score || 0), 0);
  const sumXY = recent.reduce((sum, entry, i) => sum + i * (entry.score || 0), 0);
  const sumXX = recent.reduce((sum, _, i) => sum + i * i, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Determine trend
  if (slope > 2) return 'rising';
  if (slope < -2) return 'falling';
  return 'stable';
};

/**
 * Calculate idle time in minutes
 */
export const calculateIdleTime = (lastActivityAt) => {
  if (!lastActivityAt) return 999; // Never active
  const last = new Date(lastActivityAt);
  const now = new Date();
  return Math.floor((now - last) / 60000); // Minutes
};

/**
 * Determine emotional state based on multiple signals
 * 
 * Logic:
 * - Score > 75 + trend rising → Excited
 * - Score > 60 + recent activity → Happy
 * - Score < 30 + trend falling → Disengaged
 * - Idle > 30 min → Tired
 * - Negative sentiment → Stressed
 * - Score 30-60 + stable → Neutral
 */
export const determineEmotionalState = (guest, engagementData, recentSentiment) => {
  const score = guest.engagementScore || 30;
  const trend = guest.engagementTrend || 'stable';
  const idleTime = calculateIdleTime(guest.lastInteractionAt || guest.lastActivityAt);
  
  // Priority 1: Check for negative sentiment
  if (recentSentiment && recentSentiment.sentiment === 'negative') {
    return {
      state: 'stressed',
      confidence: 0.8,
      reason: 'Recent negative feedback detected',
      indicators: ['negative_sentiment']
    };
  }
  
  // Priority 2: High engagement + rising trend = Excited
  if (score > 75 && trend === 'rising') {
    return {
      state: 'excited',
      confidence: 0.85,
      reason: 'High engagement with rising momentum',
      indicators: ['high_score', 'rising_trend']
    };
  }
  
  // Priority 3: Long idle time = Tired
  if (idleTime > 30 && score > 40) {
    return {
      state: 'tired',
      confidence: 0.75,
      reason: `${idleTime} minutes of inactivity despite good engagement score`,
      indicators: ['high_idle_time']
    };
  }
  
  // Priority 4: Low engagement + falling trend = Disengaged
  if (score < 30 && trend === 'falling') {
    return {
      state: 'disengaged',
      confidence: 0.9,
      reason: 'Low engagement with declining trend',
      indicators: ['low_score', 'falling_trend']
    };
  }
  
  // Priority 5: Low engagement only
  if (score < 30) {
    return {
      state: 'disengaged',
      confidence: 0.7,
      reason: 'Low engagement score',
      indicators: ['low_score']
    };
  }
  
  // Priority 6: Good engagement + positive sentiment = Happy
  if (score > 60 && recentSentiment && recentSentiment.sentiment === 'positive') {
    return {
      state: 'happy',
      confidence: 0.8,
      reason: 'Good engagement with positive feedback',
      indicators: ['positive_sentiment', 'good_score']
    };
  }
  
  // Priority 7: Good engagement = Happy
  if (score > 60) {
    return {
      state: 'happy',
      confidence: 0.7,
      reason: 'Healthy engagement level',
      indicators: ['good_score']
    };
  }
  
  // Default: Neutral
  return {
    state: 'neutral',
    confidence: 0.6,
    reason: 'Moderate engagement, no strong indicators',
    indicators: ['stable']
  };
};

/**
 * Generate recommendations based on emotional state
 */
export const generateEmotionalRecommendations = (guest, emotionalState) => {
  const recommendations = [];
  const state = emotionalState.state;
  
  switch (state) {
    case 'excited':
      recommendations.push({
        type: 'LEVERAGE',
        action: 'Channel energy into group activities',
        suggestion: 'Invite to high-energy networking session or group game',
        priority: 'MEDIUM'
      });
      break;
      
    case 'happy':
      recommendations.push({
        type: 'MAINTAIN',
        action: 'Maintain positive momentum',
        suggestion: 'Keep engaged with current activities, check satisfaction',
        priority: 'LOW'
      });
      break;
      
    case 'tired':
      recommendations.push({
        type: 'RECOVERY',
        action: 'Provide rest opportunity',
        suggestion: 'Suggest quiet lounge, refreshment break, or short walk',
        priority: 'HIGH'
      });
      
      if (guest.energyLevel === 'low') {
        recommendations.push({
          type: 'ENERGY',
          action: 'Boost energy',
          suggestion: 'Offer coffee, snack, or energizing activity',
          priority: 'HIGH'
        });
      }
      break;
      
    case 'disengaged':
      recommendations.push({
        type: 'RE_ENGAGE',
        action: 'Immediate re-engagement needed',
        suggestion: 'Personal check-in, introduce to connector, or offer 1-on-1',
        priority: 'HIGH'
      });
      
      // Check if first-time attendee
      if (guest.firstTimeEvent) {
        recommendations.push({
          type: 'BUDDY',
          action: 'Assign buddy or welcome host',
          suggestion: 'First-time attendee showing disengagement - needs support',
          priority: 'HIGH'
        });
      }
      break;
      
    case 'stressed':
      recommendations.push({
        type: 'DE_STRESS',
        action: 'Reduce stressors',
        suggestion: 'Offer quiet space, remove from overwhelming situations',
        priority: 'HIGH'
      });
      
      if (guest.stressLevel === 'high') {
        recommendations.push({
          type: 'INTERVENTION',
          action: 'Organizer intervention suggested',
          suggestion: 'Check in personally, identify and address specific concern',
          priority: 'HIGH'
        });
      }
      break;
      
    case 'neutral':
      recommendations.push({
        type: 'ENGAGE',
        action: 'Increase engagement',
        suggestion: 'Introduce to interesting activity or compatible guest',
        priority: 'MEDIUM'
      });
      break;
  }
  
  return recommendations;
};

/**
 * Suggest activity based on emotional state
 */
export const suggestActivityByEmotion = (emotionalState, personalityType) => {
  const state = emotionalState.state;
  const personality = personalityType || 'ambivert';
  
  const activityMap = {
    excited: {
      type: 'High-Energy Group Activity',
      suggestions: [
        'Join group networking game',
        'Participate in team activity',
        'Host mini-discussion on their interest area'
      ],
      duration: '30-45 minutes',
      groupSize: '5-10 people'
    },
    happy: {
      type: 'Sustained Engagement',
      suggestions: [
        'Continue with current activity',
        'Explore related interest sessions',
        'Connect with similar engaged guests'
      ],
      duration: '20-30 minutes',
      groupSize: '2-6 people'
    },
    tired: personality === 'introvert' ? {
      type: 'Quiet Recovery',
      suggestions: [
        'Quiet lounge or library corner',
        'Solo refreshment break',
        'Short walk or meditation space'
      ],
      duration: '15-20 minutes',
      groupSize: 'Solo or 1 other'
    } : {
      type: 'Active Recovery',
      suggestions: [
        'Coffee and light chat',
        'Casual walk and talk',
        'Low-key observation activity'
      ],
      duration: '15-20 minutes',
      groupSize: '1-3 people'
    },
    disengaged: {
      type: 'Re-engagement Activity',
      suggestions: [
        'One-on-one with event host',
        'Small curated group (2-3 people)',
        'Interest-based micro session'
      ],
      duration: '20 minutes',
      groupSize: '1-3 people'
    },
    stressed: {
      type: 'Stress Relief',
      suggestions: [
        'Quiet room or relaxation space',
        'One-on-one with support staff',
        'Step outside for fresh air'
      ],
      duration: '15-30 minutes',
      groupSize: 'Solo or with support person'
    },
    neutral: personality === 'introvert' ? {
      type: 'Gentle Engagement',
      suggestions: [
        'Small group discussion (2-3)',
        'Observational activity',
        'One-on-one coffee chat'
      ],
      duration: '20 minutes',
      groupSize: '1-3 people'
    } : {
      type: 'Social Engagement',
      suggestions: [
        'Join group activity',
        'Networking mixer participation',
        'Team-based game or challenge'
      ],
      duration: '25 minutes',
      groupSize: '4-8 people'
    }
  };
  
  return activityMap[state] || activityMap.neutral;
};

/**
 * Get emotional intelligence data for all guests at an event
 */
export const getEventEmotionalIntelligence = async (eventId) => {
  const guests = await Guest.find({ eventId });
  
  const emotionalProfiles = [];
  const atRiskGuests = [];
  
  for (const guest of guests) {
    // Get recent sentiment for this guest
    const recentSentiments = await sentimentEngine.getSentimentAnalytics(eventId, 60);
    const guestSentiment = recentSentiments.recentFeedback.find(
      f => f.guestId.toString() === guest._id.toString()
    );
    
    // Determine emotional state
    const emotionalState = determineEmotionalState(guest, null, guestSentiment);
    
    // Update guest's stored emotional state
    guest.emotionalState = emotionalState.state;
    await guest.save();
    
    // Generate recommendations
    const recommendations = generateEmotionalRecommendations(guest, emotionalState);
    
    // Suggest activity
    const suggestedActivity = suggestActivityByEmotion(emotionalState, guest.personalityType);
    
    // Calculate idle time
    const idleMinutes = calculateIdleTime(guest.lastInteractionAt || guest.updatedAt);
    
    const profile = {
      guestId: guest._id,
      guestName: guest.name,
      emotionalState: {
        state: emotionalState.state,
        confidence: emotionalState.confidence,
        reason: emotionalState.reason,
        indicators: emotionalState.indicators
      },
      engagementMetrics: {
        currentScore: guest.engagementScore || 30,
        trend: guest.engagementTrend || 'stable',
        idleMinutes,
        lastActivity: guest.lastInteractionAt || guest.updatedAt
      },
      personalityContext: {
        type: guest.personalityType || 'ambivert',
        openToNetworking: guest.openToNetworking !== false,
        energyLevel: guest.energyLevel || 'moderate',
        stressLevel: guest.stressLevel || 'normal'
      },
      recommendedActivity: suggestedActivity,
      recommendations,
      priority: emotionalState.state === 'stressed' || emotionalState.state === 'disengaged' 
        ? 'high' 
        : emotionalState.state === 'tired' 
          ? 'medium' 
          : 'low'
    };
    
    emotionalProfiles.push(profile);
    
    // Track at-risk guests
    if (emotionalState.state === 'stressed' || emotionalState.state === 'disengaged') {
      atRiskGuests.push({
        guestId: guest._id,
        name: guest.name,
        riskLevel: emotionalState.state === 'stressed' ? 'high' : 'medium',
        reason: emotionalState.reason,
        engagementScore: guest.engagementScore || 30,
        recommendations: recommendations.slice(0, 2)
      });
    }
  }
  
  // Sort by priority (high -> medium -> low)
  emotionalProfiles.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Event-level emotional summary
  const stateCounts = {};
  emotionalProfiles.forEach(p => {
    stateCounts[p.emotionalState.state] = (stateCounts[p.emotionalState.state] || 0) + 1;
  });
  
  const dominantState = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  
  const riskPercentage = Math.round((atRiskGuests.length / guests.length) * 100);
  
  return {
    profiles: emotionalProfiles,
    atRisk: atRiskGuests,
    summary: {
      totalGuests: guests.length,
      dominantState,
      stateDistribution: stateCounts,
      atRiskCount: atRiskGuests.length,
      riskPercentage,
      alert: riskPercentage > 20 // Alert if >20% of guests at risk
    }
  };
};

/**
 * Get emotional profile for a specific guest
 */
export const getGuestEmotionalProfile = async (guestId) => {
  const guest = await Guest.findById(guestId);
  if (!guest) return null;
  
  // Get recent sentiment
  const eventId = guest.eventId;
  const recentSentiments = await sentimentEngine.getSentimentAnalytics(eventId, 60);
  const guestSentiment = recentSentiments.recentFeedback.find(
    f => f.guestId.toString() === guestId
  );
  
  const emotionalState = determineEmotionalState(guest, null, guestSentiment);
  const recommendations = generateEmotionalRecommendations(guest, emotionalState);
  const suggestedActivity = suggestActivityByEmotion(emotionalState, guest.personalityType);
  const idleMinutes = calculateIdleTime(guest.lastInteractionAt || guest.updatedAt);
  
  return {
    guestId: guest._id,
    name: guest.name,
    currentState: emotionalState,
    engagement: {
      score: guest.engagementScore || 30,
      trend: guest.engagementTrend || 'stable',
      history: (guest.engagementHistory || []).slice(-10),
      idleMinutes
    },
    recentFeedback: guestSentiment,
    recommendations,
    suggestedActivity
  };
};

export default {
  calculateEngagementTrend,
  calculateIdleTime,
  determineEmotionalState,
  generateEmotionalRecommendations,
  suggestActivityByEmotion,
  getEventEmotionalIntelligence,
  getGuestEmotionalProfile
};
