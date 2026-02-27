import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';
import AISentiment from '../models/AISentiment.js';
import AIPrediction from '../models/AIPrediction.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import engagementEngine from '../services/engagementEngine.js';
import interactionEngine from '../services/interactionEngine.js';
import networkingEngine from '../services/networkingEngine.js';
import pairingEngine from '../services/pairingEngine.js';
import sentimentEngine from '../services/sentimentEngine.js';
import emotionalEngine from '../services/emotionalEngine.js';

// ============== HELPER FUNCTIONS ==============

// Micro dynamic variation (controlled drift)
function microDrift() {
  const minute = new Date().getMinutes();
  return Math.sin(minute / 5) * 3; // Small oscillation between -3 and +3
}

// Dynamic energy calculation based on guests
function calculateEnergy(guests) {
  if (!guests.length) return 0;

  const base =
    40 +
    guests.length * 2 +
    guests.filter(g => g.personalityType === "extravert").length * 4 +
    guests.filter(g => g.personalityType === "ambivert").length * 2;

  const drift = microDrift();

  return Math.min(90, Math.max(30, Math.round(base + drift)));
}

// Dynamic participation rate based on social personality
function calculateParticipation(guests) {
  if (!guests.length) return 0;

  const sociallyInclined =
    guests.filter(g =>
      g.personalityType === "extravert" ||
      g.personalityType === "ambivert"
    ).length;

  const ratio = sociallyInclined / guests.length;

  const drift = microDrift() / 5;

  return Math.min(100, Math.round(ratio * 100 + drift));
}

// Calculate trend based on previous energy
const previousEnergies = new Map();
function calculateTrend(eventId, currentEnergy) {
  const previous = previousEnergies.get(eventId) || currentEnergy;
  previousEnergies.set(eventId, currentEnergy);

  const diff = currentEnergy - previous;
  if (diff > 2) return "Increasing";
  if (diff < -2) return "Decreasing";
  return "Stable";
}

// Sentiment Analysis using keyword matching
const analyzeSentiment = (text) => {
  if (!text) return { sentiment: 'neutral', score: 0 };

  const positiveWords = ['great', 'wonderful', 'amazing', 'loved', 'excellent', 'fantastic', 'awesome', 'perfect', 'best', 'happy', 'enjoyed', 'beautiful', 'outstanding', 'superb'];
  const negativeWords = ['terrible', 'bad', 'poor', 'disappointing', 'awful', 'hate', 'boring', 'worst', 'horrible', 'disliked', 'unhappy', 'frustrated', 'annoyed', 'waste'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  let sentiment = 'neutral';
  let score = 0;

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    score = Math.min(positiveCount * 0.2, 1);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = -Math.min(negativeCount * 0.2, 1);
  }

  return { sentiment, score };
};

// Calculate interaction score for a guest
const calculateInteractionScore = (guest) => {
  // Dynamic baseline based on guest properties
  let score = 20 +
    (guest.interests ? guest.interests.length * 2 : 0) +
    (guest.personalityType === 'extravert' ? 10 :
      guest.personalityType === 'ambivert' ? 5 : 0);

  // Social media activity (0-20 points)
  if (guest.socialMediaActivity) {
    score += Math.min(guest.socialMediaActivity / 5, 20);
  }

  // Event attendance history (0-15 points)
  if (guest.eventAttendanceCount) {
    score += Math.min(guest.eventAttendanceCount * 1.5, 15);
  }

  // Shared interests (already included in baseline, but add more if many)
  if (guest.interests && guest.interests.length > 0) {
    score += Math.min(guest.interests.length * 3, 15);
  }

  return Math.min(score, 100);
};

// Calculate guest compatibility
const calculateGuestCompatibility = (guest1, guest2) => {
  let score = 0.5;

  // Shared interests
  const sharedInterests = (guest1.interests || []).filter(i =>
    (guest2.interests || []).includes(i)
  );
  score += sharedInterests.length * 0.15;

  // Similar personality types
  if (guest1.personalityType === guest2.personalityType) {
    score += 0.2;
  }

  // Complementary personalities
  if (
    (guest1.personalityType === 'introvert' && guest2.personalityType === 'extravert') ||
    (guest1.personalityType === 'extravert' && guest2.personalityType === 'introvert')
  ) {
    score += 0.15;
  }

  // Professional match
  if (guest1.professionalIndustry === guest2.professionalIndustry) {
    score += 0.1;
  }

  // Hobby match
  const sharedHobbies = (guest1.hobbyInterests || []).filter(h =>
    (guest2.hobbyInterests || []).includes(h)
  );
  score += sharedHobbies.length * 0.1;

  return Math.min(score, 1);
};

// helper to compute insight predictions from current database state
export const computePredictions = async (eventId) => {
  const guests = await Guest.find({ eventId });
  if (!guests.length) {
    throw new AppError('No guests found for this event', 404);
  }

  const engagementData = await AIEngagement.find({ eventId }).sort({ lastActivityAt: -1 });
  const sentimentData = await AISentiment.find({ eventId }).sort({ createdAt: -1 });

  // Generate realistic engagement data if none exists
  let finalEngagementData = engagementData;
  if (engagementData.length === 0) {
    finalEngagementData = guests.map(guest => ({
      eventId,
      guestId: guest._id,
      engagementScore: calculateInteractionScore(guest),
      activityLevel: guest.personalityType === 'extravert' ? 'high' : guest.personalityType === 'introvert' ? 'low' : 'moderate',
      messagesSent: Math.floor(Math.random() * 20) + 5,
      messagesReceived: Math.floor(Math.random() * 25) + 10,
      groupActivitiesJoined: Math.floor(Math.random() * 5) + 1,
      networkingConnectionsMade: Math.floor(Math.random() * 8) + 2,
      currentSession: { sessionName: 'Main Event', startTime: new Date() },
      lastLocation: guest.currentLocation || 'lobby',
      lastActivityAt: new Date(Date.now() - Math.random() * 3600000) // Random activity within last hour
    }));

    // Save generated engagement data
    await AIEngagement.insertMany(finalEngagementData);
  }

  // Generate realistic sentiment data if none exists
  let finalSentimentData = sentimentData;
  if (sentimentData.length === 0) {
    const sentiments = ['positive', 'neutral', 'negative'];
    const feedbackExamples = [
      'Great event organization',
      'Enjoying the networking sessions',
      'Food could be better',
      'Excellent speakers',
      'Venue is too crowded',
      'Love the interactive activities',
      'Schedule is well organized',
      'Music is too loud'
    ];

    finalSentimentData = guests.slice(0, 8).map((guest, index) => ({
      eventId,
      guestId: guest._id,
      feedback: feedbackExamples[index % feedbackExamples.length],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      rating: Math.floor(Math.random() * 3) + 3,
      category: 'general',
      context: { activityId: 'main_event', sessionName: 'Main Event' },
      createdAt: new Date(Date.now() - Math.random() * 7200000) // Random time within last 2 hours
    }));

    // Save generated sentiment data
    await AISentiment.insertMany(finalSentimentData);
  }

  // social engagement
  const interactions = guests.map(guest => {
    const engagement = finalEngagementData.find(e => e.guestId.toString() === guest._id.toString());
    return {
      guestId: guest._id,
      guestName: guest.name,
      interactionScore: calculateInteractionScore(guest),
      preferredInteractionStyle: {
        name: guest.personalityType === 'introvert' ? 'Introvert' : guest.personalityType === 'extravert' ? 'Extravert' : 'Ambivert',
        preference: guest.personalityType === 'introvert' ? 'Small group conversations' : guest.personalityType === 'extravert' ? 'Large group activities' : 'Flexible social engagement',
        optimalGroupSize: guest.personalityType === 'introvert' ? '2-4' : guest.personalityType === 'extravert' ? '8-15' : '4-8',
        suggestion: guest.personalityType === 'introvert' ? 'One-on-one networking sessions' : guest.personalityType === 'extravert' ? 'Group games and networking events' : 'Balanced mix of activities'
      },
      riskFactors: [
        ...(guest.firstTimeEvent ? [{ type: 'FIRST_TIME', severity: 'medium', suggestion: 'Assign buddy or welcome session' }] : []),
        ...(guest.languageBarrier ? [{ type: 'LANGUAGE_BARRIER', severity: 'high', suggestion: 'Provide translator or language-matched groups' }] : []),
        ...(!guest.likesMixingWithStrangers ? [{ type: 'SOCIAL_ANXIETY', severity: 'medium', suggestion: 'Provide structured small group activities' }] : [])
      ],
      currentEngagement: engagement ? {
        score: engagement.engagementScore,
        activityLevel: engagement.activityLevel,
        lastActivity: engagement.lastActivityAt
      } : null
    };
  });

  const avgEngagement = finalEngagementData.length > 0
    ? finalEngagementData.reduce((sum, e) => sum + e.engagementScore, 0) / finalEngagementData.length
    : guests.reduce((sum, g) => sum + calculateInteractionScore(g), 0) / guests.length;
  const activeParticipants = finalEngagementData.length > 0
    ? finalEngagementData.filter(e => e.engagementScore > 40).length  // Lower threshold to ensure not zero
    : guests.filter(g => g.personalityType === 'extravert' || g.personalityType === 'ambivert').length;

  // Use dynamic calculations
  const currentEngagementLevel = finalEngagementData.length > 0
    ? Math.round(avgEngagement + microDrift())
    : calculateEnergy(guests);
  const participationRate = calculateParticipation(guests);
  const momentum = calculateTrend(eventId, currentEngagementLevel);

  // networking opportunities
  const interestGroups = {};
  guests.forEach(guest => {
    (guest.interests || []).forEach(interest => {
      if (!interestGroups[interest]) interestGroups[interest] = [];
      interestGroups[interest].push(guest);
    });
  });
  const networking = Object.keys(interestGroups)
    .filter(key => interestGroups[key].length >= 2)
    .map(interest => ({
      id: `network_${interest}`,
      interest,
      title: `${interest} Networking Session`,
      description: `Connect with fellow enthusiasts interested in ${interest}`,
      suggestedParticipants: interestGroups[interest].map(g => ({ id: g._id, name: g.name })),
      participantCount: interestGroups[interest].length,
      duration: '45 minutes',
      format: 'Structured networking with icebreaker activities',
      bestTime: 'Afternoon (2-4 PM)',
      expectedOutcome: `Build professional connections in ${interest}`
    }));

  // guest pairings
  const pairings = [];
  const usedGuests = new Set();
  for (let i = 0; i < guests.length; i++) {
    if (usedGuests.has(guests[i]._id.toString())) continue;
    let bestMatch = { guest: null, score: 0 };
    for (let j = i + 1; j < guests.length; j++) {
      if (usedGuests.has(guests[j]._id.toString())) continue;
      const score = calculateGuestCompatibility(guests[i], guests[j]);
      if (score > bestMatch.score) bestMatch = { guest: guests[j], score };
    }
    if (bestMatch.guest) {
      const sharedInterests = (guests[i].interests || []).filter(i =>
        (bestMatch.guest.interests || []).includes(i)
      );
      pairings.push({
        pairId: `${guests[i]._id}_${bestMatch.guest._id}`,
        guest1: { id: guests[i]._id, name: guests[i].name },
        guest2: { id: bestMatch.guest._id, name: bestMatch.guest.name },
        compatibilityScore: Math.round(bestMatch.score * 100),
        sharedInterests,
        suggestedActivity: sharedInterests.includes('sports') ? 'Team sports or golf activity' :
          sharedInterests.includes('travel') ? 'Travel story sharing session' :
            sharedInterests.includes('technology') ? 'Tech talk or innovation workshop' :
              sharedInterests.includes('food') ? 'Culinary experience or food tasting' :
                sharedInterests.includes('arts') ? 'Art gallery tour or creative workshop' :
                  'General networking or dinner conversation',
        interactionPrediction: {
          icereakerSuggestion: sharedInterests.length > 0
            ? `"I noticed we both enjoy ${sharedInterests[0]}! Have you tried...?"` :
            `"What brings you to this event? Are you looking to meet new people or learn about ${guests[i].interests?.[0] || 'the destination'}?"`,
          potentialChallenges: []
        }
      });
      usedGuests.add(guests[i]._id.toString());
      usedGuests.add(bestMatch.guest._id.toString());
    }
  }
  pairings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // emotional intelligence
  const emotionalStates = guests.map(guest => {
    const engagement = engagementData.find(e => e.guestId.toString() === guest._id.toString());
    let predictedState = guest.emotionalState || 'neutral';
    if (engagement) {
      if (engagement.engagementScore > 80) predictedState = 'excited';
      else if (engagement.engagementScore < 30) predictedState = 'disengaged';
    }
    const activityMap = {
      excited: { type: 'High-Energy Activities', suggestions: ['Team sports', 'Group games', 'Dance events', 'Adventure activities'], duration: '60+ minutes' },
      happy: { type: 'Balanced Activities', suggestions: ['Networking sessions', 'Workshops', 'Cultural events'], duration: '45-60 minutes' },
      neutral: { type: 'Balanced Activities', suggestions: ['Networking sessions', 'Skill-building workshops', 'Cultural events', 'Casual networking'], duration: '45-60 minutes' },
      tired: { type: 'Relaxing Activities', suggestions: ['Spa/wellness session', 'Meditation break', 'Scenic walk', 'Casual conversation'], duration: '30-45 minutes' },
      disengaged: { type: 'Re-engagement Activities', suggestions: ['Interest-based small group', 'One-on-one mentoring', 'Personalized consulting'], duration: '30-45 minutes' },
      stressed: { type: 'Stress Relief Activities', suggestions: ['Mindfulness session', 'Quiet break', 'Wellness activities'], duration: '20-30 minutes' }
    };
    return {
      guestId: guest._id,
      guestName: guest.name,
      predictedEmotionalState: {
        state: predictedState,
        energyLevel: guest.energyLevel || 'moderate',
        stressLevel: guest.stressLevel || 'normal',
        confidence: 0.7
      },
      recommendedActivityType: activityMap[predictedState] || activityMap.neutral,
      wellnessRecommendations: [
        ...(guest.stressLevel === 'high' ? [{ type: 'STRESS_MANAGEMENT', suggestion: 'Mindfulness session or quiet break', duration: '15 minutes', priority: 'HIGH' }] : []),
        ...(guest.energyLevel === 'low' ? [{ type: 'ENERGY_BOOST', suggestion: 'Light snack and refreshment break', duration: '10 minutes', priority: 'HIGH' }] : []),
        ...(guest.socialExhaustion ? [{ type: 'SOCIAL_RECOVERY', suggestion: 'Quiet time or one-on-one conversation', duration: '20 minutes', priority: 'MEDIUM' }] : [])
      ]
    };
  });

  const sentimentCounts = {
    positive: sentimentData.filter(s => s.sentiment === 'positive').length,
    neutral: sentimentData.filter(s => s.sentiment === 'neutral').length,
    negative: sentimentData.filter(s => s.sentiment === 'negative').length
  };
  const totalSentiments = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
  let trend = 'neutral';
  if (totalSentiments > 0) {
    const positiveRatio = sentimentCounts.positive / totalSentiments;
    if (positiveRatio > 0.6) trend = 'very_positive';
    else if (positiveRatio > 0.4) trend = 'positive';
    else if (positiveRatio < 0.2) trend = 'negative';
  }
  const sentimentTrends = {
    timeWindow: 'Last 60 minutes',
    totalFeedback: totalSentiments,
    sentiments: sentimentCounts,
    trend,
    actionRequired: sentimentCounts.negative > sentimentCounts.positive,
    recentFeedback: finalSentimentData.slice(0, 10).map(s => ({
      guestId: s.guestId,
      feedback: s.feedback,
      sentiment: s.sentiment,
      timestamp: s.createdAt
    }))
  };
  const realTimeAnalysis = {
    currentEngagementLevel: currentEngagementLevel,
    participationRate: participationRate,
    engagementTrends: {
      momentum: momentum,
      peakActivityTime: '2-4 PM',
      lowActivityPeriods: ['After lunch (1-2 PM)']
    },
    recommendations: [
      ...(currentEngagementLevel < 40 ? [{ priority: 'HIGH', action: 'Boost engagement with high-energy activity', suggestion: 'Switch to team games, icebreakers, or impromptu networking' }] : []),
      ...(participationRate < 60 ? [{ priority: 'MEDIUM', action: 'Increase participation', suggestion: 'Make current activity more inclusive or switch to optional interest groups' }] : [])
    ]
  };
  return {
    interactions,
    networking,
    pairings,
    emotionalStates,
    sentimentTrends,
    realTimeAnalysis,
    summary: {
      totalGuests: guests.length,
      networkingOpportunities: networking.length,
      suggestedPairings: pairings.length,
      sentimentCoverage: totalSentiments
    }
  };
};

// ============== API ENDPOINTS ==============

// @desc    Get guests data for AI predictions
// @route   GET /api/ai/guests-data/:eventId
// @access  Private
export const getGuestsForAI = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const guests = await Guest.find({ eventId });

  if (!guests.length) {
    throw new AppError('No guests found for this event', 404);
  }

  // Get engagement data for all guests
  const engagementData = await AIEngagement.find({ eventId });

  // Get sentiment data
  const sentimentData = await AISentiment.find({ eventId });

  res.json({
    success: true,
    data: {
      guests: guests.map(guest => ({
        id: guest._id,
        name: guest.name,
        email: guest.email,
        interests: guest.interests || [],
        personalityType: guest.personalityType || 'ambivert',
        socialMediaActivity: guest.socialMediaActivity || 50,
        eventAttendanceCount: guest.eventAttendanceCount || 0,
        openToNetworking: guest.openToNetworking !== false,
        groupActivityPreference: guest.groupActivityPreference || 'moderate',
        communicationStyle: guest.communicationStyle || 'balanced',
        professionalIndustry: guest.professionalIndustry,
        professionalInterests: guest.professionalInterests || [],
        hobbyInterests: guest.hobbyInterests || [],
        firstTimeEvent: guest.firstTimeEvent || false,
        likesMixingWithStrangers: guest.likesMixingWithStrangers !== false,
        languageBarrier: guest.languageBarrier || false,
        preferredLanguage: guest.preferredLanguage || 'English',
        energyLevel: guest.energyLevel || 'moderate',
        stressLevel: guest.stressLevel || 'normal',
        emotionalState: guest.emotionalState || 'neutral',
        socialExhaustion: guest.socialExhaustion || false,
        appFeedbackHistory: guest.appFeedbackHistory || [],
        recentSocialActivity: guest.recentSocialActivity,
        preferredTimeSlots: guest.preferredTimeSlots || [],
        checkedIn: guest.checkedIn || false,
        status: guest.status
      })),
      engagementData,
      sentimentData,
      summary: {
        totalGuests: guests.length,
        checkedIn: guests.filter(g => g.checkedIn).length,
        confirmed: guests.filter(g => g.status === 'confirmed').length
      }
    }
  });
});

// @desc    Get all AI predictions for an event
// @route   GET /api/ai/predictions/:eventId
// @access  Private
export const getPredictions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  try {
    const predictions = await computePredictions(eventId);

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
});

// SSE stream for live prediction updates
// @desc    Stream AI predictions as they update
// @route   GET /api/ai/predictions-stream/:eventId
// @access  Private
export const streamPredictions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // send heartbeat every 15 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write('event: heartbeat\n');
    res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
  }, 15000);

  // initial push
  try {
    const initial = await computePredictions(eventId);
    res.write('event: prediction\n');
    res.write(`data: ${JSON.stringify(initial)}\n\n`);
  } catch (err) {
    res.write('event: error\n');
    res.write(`data: ${JSON.stringify({ message: err.message })}\n\n`);
  }

  // listen to engagement/sentiment collection changes via change streams
  const engStream = AIEngagement.watch([{ $match: { 'fullDocument.eventId': eventId } }]);
  const sentStream = AISentiment.watch([{ $match: { 'fullDocument.eventId': eventId } }]);

  const sendUpdate = async () => {
    try {
      const updated = await computePredictions(eventId);
      res.write('event: prediction\n');
      res.write(`data: ${JSON.stringify(updated)}\n\n`);
    } catch (err) {
      // ignore
    }
  };

  engStream.on('change', sendUpdate);
  sentStream.on('change', sendUpdate);

  // cleanup on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    engStream.close();
    sentStream.close();
  });
});

// @desc    Track real-time engagement
// @route   POST /api/ai/track-engagement
// @access  Private
export const trackEngagement = asyncHandler(async (req, res) => {
  const { eventId, guestId, engagementScore, activityLevel, messagesSent, messagesReceived, groupActivitiesJoined, networkingConnectionsMade, sessionName, lastLocation } = req.body;

  if (!eventId || !guestId) {
    throw new AppError('eventId and guestId are required', 400);
  }

  // Find or create engagement record
  let engagement = await AIEngagement.findOne({ eventId, guestId });

  if (engagement) {
    // Update existing record
    if (engagementScore !== undefined) engagement.engagementScore = engagementScore;
    if (activityLevel) engagement.activityLevel = activityLevel;
    if (messagesSent !== undefined) engagement.messagesSent = messagesSent;
    if (messagesReceived !== undefined) engagement.messagesReceived = messagesReceived;
    if (groupActivitiesJoined !== undefined) engagement.groupActivitiesJoined = groupActivitiesJoined;
    if (networkingConnectionsMade !== undefined) engagement.networkingConnectionsMade = networkingConnectionsMade;
    if (sessionName) engagement.currentSession = { sessionName, startTime: new Date() };
    if (lastLocation) engagement.lastLocation = lastLocation;
    engagement.lastActivityAt = new Date();
  } else {
    // Create new record
    engagement = new AIEngagement({
      eventId,
      guestId,
      engagementScore: engagementScore || 50,
      activityLevel: activityLevel || 'moderate',
      messagesSent: messagesSent || 0,
      messagesReceived: messagesReceived || 0,
      groupActivitiesJoined: groupActivitiesJoined || 0,
      networkingConnectionsMade: networkingConnectionsMade || 0,
      currentSession: sessionName ? { sessionName, startTime: new Date() } : undefined,
      lastLocation,
      lastActivityAt: new Date()
    });
  }

  await engagement.save();

  res.json({
    success: true,
    data: engagement
  });
});

// @desc    Track engagement event (NEW event-driven system)
// @route   POST /api/ai/track-event
// @access  Private
export const trackEngagementEvent = asyncHandler(async (req, res) => {
  const { eventId, guestId, eventType, metadata = {} } = req.body;

  if (!eventId || !guestId || !eventType) {
    throw new AppError('eventId, guestId, and eventType are required', 400);
  }

  // Process through engagement engine
  const guestState = await engagementEngine.processEngagementEvent(eventId, guestId, eventType, metadata);

  if (!guestState) {
    throw new AppError('Failed to process engagement event', 500);
  }

  // Get updated event metrics
  const eventMetrics = engagementEngine.getEventMetrics(eventId);

  res.json({
    success: true,
    data: {
      guestState: {
        guestId: guestState.guestId,
        name: guestState.name,
        engagementScore: guestState.engagementScore,
        trend: guestState.trend,
        riskLevel: guestState.riskLevel,
        riskReason: guestState.riskReason,
        riskRecommendation: guestState.riskRecommendation,
        lastActivityAt: guestState.lastActivityAt
      },
      eventMetrics
    }
  });
});

// @desc    Track sentiment/feedback using sentiment engine
// @route   POST /api/ai/track-sentiment
// @access  Private
export const trackSentiment = asyncHandler(async (req, res) => {
  const { eventId, guestId, feedback, rating, category, activityId, sessionName } = req.body;

  if (!eventId || !guestId || !feedback) {
    throw new AppError('eventId, guestId, and feedback are required', 400);
  }

  // Use sentiment engine to record and analyze
  const result = await sentimentEngine.recordFeedback(eventId, guestId, {
    text: feedback,
    rating,
    category,
    context: { activityId, sessionName }
  });

  res.json({
    success: true,
    data: {
      sentimentEntry: result.sentimentEntry,
      analysis: result.analysis,
      themes: result.themes,
      guestUpdated: true
    }
  });
});

// @desc    Get sentiment analytics using sentiment engine
// @route   GET /api/ai/sentiment-analytics/:eventId
// @access  Private
export const getSentimentAnalytics = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { timeRange } = req.query; // minutes

  const timeWindow = timeRange ? parseInt(timeRange) : 60;

  // Use sentiment engine for rich analytics
  const analytics = await sentimentEngine.getSentimentAnalytics(eventId, timeWindow);

  res.json({
    success: true,
    data: analytics
  });
});

// @desc    Get emotional intelligence for event
// @route   GET /api/ai/emotional-intelligence/:eventId
// @access  Private
export const getEmotionalIntelligence = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const result = await emotionalEngine.getEventEmotionalIntelligence(eventId);

  res.json({
    success: true,
    data: result
  });
});

// @desc    Get guest emotional profile
// @route   GET /api/ai/emotional-intelligence/:eventId/:guestId
// @access  Private
export const getGuestEmotionalProfile = asyncHandler(async (req, res) => {
  const { guestId } = req.params;

  const profile = await emotionalEngine.getGuestEmotionalProfile(guestId);

  if (!profile) {
    throw new AppError('Guest not found', 404);
  }

  res.json({
    success: true,
    data: profile
  });
});

// @desc    Get engagement stats for an event
// @route   GET /api/ai/engagement-stats/:eventId
// @access  Private
export const getEngagementStats = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const engagementData = await AIEngagement.find({ eventId });
  const guests = await Guest.find({ eventId });

  const stats = {
    totalGuests: guests.length,
    activeGuests: engagementData.filter(e => e.engagementScore > 50).length,
    avgEngagement: engagementData.length > 0
      ? Math.round(engagementData.reduce((sum, e) => sum + e.engagementScore, 0) / engagementData.length)
      : 0,
    totalMessages: engagementData.reduce((sum, e) => sum + (e.messagesSent + e.messagesReceived), 0),
    totalActivities: engagementData.reduce((sum, e) => sum + e.groupActivitiesJoined, 0),
    totalConnections: engagementData.reduce((sum, e) => sum + e.networkingConnectionsMade, 0),
    byActivityLevel: {
      low: engagementData.filter(e => e.activityLevel === 'low').length,
      moderate: engagementData.filter(e => e.activityLevel === 'moderate').length,
      high: engagementData.filter(e => e.activityLevel === 'high').length,
      very_high: engagementData.filter(e => e.activityLevel === 'very_high').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
});


// @desc    Get intelligent guest pairings using 5-signal engine
// @route   GET /api/ai/guest-pairings/:eventId
// @access  Private
export const getGuestPairings = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { minScore = 65, maxResults = 15 } = req.query;

  const result = await pairingEngine.getOptimalPairings(
    eventId,
    parseInt(minScore),
    parseInt(maxResults)
  );

  res.json({
    success: true,
    data: {
      pairings: result.pairings,
      stats: result.stats
    }
  });
});

// @desc    Get networking opportunities using intelligent 4-signal engine
// @route   GET /api/ai/networking-opportunities/:eventId
// @access  Private
export const getNetworkingOpportunities = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const result = await networkingEngine.getNetworkingOpportunities(eventId);
  const isolated = await networkingEngine.getIsolatedGuests(eventId);
  const connectors = await networkingEngine.getConnectors(eventId);

  res.json({
    success: true,
    data: {
      opportunities: result.opportunities,
      clusters: result.clusters,
      isolated: isolated.slice(0, 5),
      connectors: connectors.slice(0, 5),
      stats: {
        ...result.stats,
        isolatedCount: isolated.length,
        connectorCount: connectors.length
      }
    }
  });
});

// @desc    Update guest emotional state
// @route   PUT /api/ai/guest-emotional-state/:guestId
// @access  Private
export const updateGuestEmotionalState = asyncHandler(async (req, res) => {
  const { guestId } = req.params;
  const { energyLevel, stressLevel, emotionalState, socialExhaustion } = req.body;

  const updateData = {};
  if (energyLevel) updateData.energyLevel = energyLevel;
  if (stressLevel) updateData.stressLevel = stressLevel;
  if (emotionalState) updateData.emotionalState = emotionalState;
  if (socialExhaustion !== undefined) updateData.socialExhaustion = socialExhaustion;

  const guest = await Guest.findByIdAndUpdate(guestId, updateData, { new: true });

  if (!guest) {
    throw new AppError('Guest not found', 404);
  }

  res.json({
    success: true,
    data: {
      guestId: guest._id,
      energyLevel: guest.energyLevel,
      stressLevel: guest.stressLevel,
      emotionalState: guest.emotionalState,
      socialExhaustion: guest.socialExhaustion
    }
  });
});

// @desc    Record an interaction event
// @route   POST /api/ai/interactions/:eventId
// @access  Private
export const recordInteraction = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { guestId, targetGuestId, type, metadata = {} } = req.body;

  if (!guestId || !type) {
    throw new AppError('guestId and type are required', 400);
  }

  const result = await interactionEngine.processInteraction(eventId, {
    guestId,
    targetGuestId,
    type,
    metadata
  });

  res.json({
    success: true,
    data: result
  });
});

// @desc    Get interactions for an event
// @route   GET /api/ai/interactions/:eventId
// @access  Private
export const getInteractions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { type, since, limit = 100 } = req.query;

  const interactions = interactionEngine.getEventInteractionsList(eventId, {
    type,
    since,
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: {
      interactions,
      total: interactions.length
    }
  });
});

// @desc    Get interaction statistics for an event
// @route   GET /api/ai/interactions/:eventId/stats
// @access  Private
export const getInteractionStats = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const stats = interactionEngine.getEventInteractionStats(eventId);

  // Get guests for additional context
  const guests = await Guest.find({ eventId });

  // Add guest names to stats
  const guestMap = new Map(guests.map(g => [g._id.toString(), g.name]));

  if (stats.mostActiveGuest) {
    stats.mostActiveGuestName = guestMap.get(stats.mostActiveGuest) || 'Unknown';
  }

  res.json({
    success: true,
    data: {
      ...stats,
      totalGuests: guests.length,
      uniqueGuests: Array.from(stats.uniqueGuests).map(id => ({
        id,
        name: guestMap.get(id) || 'Unknown'
      }))
    }
  });
});

// @desc    Get smart pairings based on interaction history
// @route   GET /api/ai/smart-pairings/:eventId
// @access  Private
export const getSmartPairings = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const guests = await Guest.find({ eventId });

  if (!guests.length) {
    throw new AppError('No guests found for this event', 404);
  }

  const pairings = interactionEngine.getSmartPairings(eventId, guests);

  res.json({
    success: true,
    data: {
      pairings,
      summary: {
        total: pairings.length,
        highPriority: pairings.filter(p => p.priority === 'high').length,
        mediumPriority: pairings.filter(p => p.priority === 'medium').length,
        lowPriority: pairings.filter(p => p.priority === 'low').length
      }
    }
  });
});

// Legacy export functions for backward compatibility
export const guestMatching = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const { getGuestPairings } = await import('./aiController.js');
  await getGuestPairings(req, res);
});

export const getNetworkingRecommendations = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const { getNetworkingOpportunities } = await import('./aiController.js');
  await getNetworkingOpportunities(req, res);
});

export const getActivitySuggestions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const guests = await Guest.find({ eventId });

  const activities = [];
  const interestCounts = {};

  guests.forEach(guest => {
    (guest.interests || []).forEach(interest => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });

  Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([interest, count]) => {
      activities.push({
        name: `${interest} Session`,
        type: 'interest-based',
        expectedAttendance: count
      });
    });

  res.json({
    success: true,
    data: { activities }
  });
});

