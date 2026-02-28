/**
 * Behavioral Intelligence Seeder - 12 Guest Demo Dataset
 * 
 * This dataset is engineered to showcase:
 * - Engagement variation (20-92 range)
 * - Emotional diversity
 * - Networking clusters (Sustainability, AI, Startup)
 * - Risk detection (2 at-risk guests)
 * - Pairing intelligence
 * - Sentiment variation
 * - Event-level metrics (energy ~65-75)
 * 
 * Run: node backend/scripts/seedBehavioralData.js [eventId]
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';
import AISentiment from '../models/AISentiment.js';
import AIPrediction from '../models/AIPrediction.js';

dotenv.config();

// ============================================
// 12 ENGINEERED GUEST PROFILES
// ============================================

const BEHAVIORAL_GUESTS = [
  {
    // 1. PRAGATI SHARMA - The Connector (High Influence)
    name: 'Pragati Sharma',
    email: 'pragati.sharma@techstart.io',
    interests: ['Startup', 'AI', 'Networking'],
    goals: ['collaboration', 'funding'],
    personalityType: 'extravert',
    messagesSent: 18,
    activitiesJoined: 4,
    networkingConnectionsMade: 6,
    engagementHistory: [65, 72, 78, 85],
    feedback: 'Amazing energy and great conversations!',
    currentLocation: 'Networking Hall',
    connections: 6,
    professionalIndustry: 'Technology',
    openToNetworking: true,
    energyLevel: 'high',
    stressLevel: 'low',
    emotionalState: 'excited',
    firstTimeEvent: false,
  },
  {
    // 2. RAHUL MEHTA - The Rising Builder (Medium → High growth)
    name: 'Rahul Mehta',
    email: 'rahul.mehta@buildr.co',
    interests: ['Startup', 'Travel'],
    goals: ['learning', 'partnerships'],
    personalityType: 'ambivert',
    messagesSent: 10,
    activitiesJoined: 3,
    networkingConnectionsMade: 3,
    engagementHistory: [40, 48, 58, 66],
    feedback: 'Workshops are very helpful.',
    currentLocation: 'Workshop A',
    connections: 3,
    professionalIndustry: 'Technology',
    openToNetworking: true,
    energyLevel: 'moderate',
    stressLevel: 'low',
    emotionalState: 'excited',
    firstTimeEvent: true,
  },
  {
    // 3. ADITI KAPOOR - The Specialist (Niche Cluster Member)
    name: 'Aditi Kapoor',
    email: 'aditi.kapoor@greenpath.org',
    interests: ['Sustainability', 'Travel'],
    goals: ['collaboration'],
    personalityType: 'ambivert',
    messagesSent: 6,
    activitiesJoined: 2,
    networkingConnectionsMade: 2,
    engagementHistory: [55, 57, 54, 52],
    feedback: 'Would love more sustainability focused discussions.',
    currentLocation: 'Main Hall',
    connections: 2,
    professionalIndustry: 'Environmental',
    openToNetworking: true,
    energyLevel: 'moderate',
    stressLevel: 'low',
    emotionalState: 'neutral',
    firstTimeEvent: false,
  },
  {
    // 4. ARJUN VERMA - High Energy Extrovert (Hyper Engaged)
    name: 'Arjun Verma',
    email: 'arjun.verma@aiforge.ai',
    interests: ['AI', 'Startup'],
    goals: ['networking'],
    personalityType: 'extravert',
    messagesSent: 25,
    activitiesJoined: 5,
    networkingConnectionsMade: 7,
    engagementHistory: [70, 80, 88, 92],
    feedback: 'This is the best event I have attended!',
    currentLocation: 'Networking Hall',
    connections: 7,
    professionalIndustry: 'Technology',
    openToNetworking: true,
    energyLevel: 'high',
    stressLevel: 'normal',
    emotionalState: 'excited',
    firstTimeEvent: false,
  },
  {
    // 5. NEHA SINGH - The Quiet Observer (Introvert Risk Case)
    name: 'Neha Singh',
    email: 'neha.singh@lenswork.in',
    interests: ['Photography'],
    goals: ['learning'],
    personalityType: 'introvert',
    messagesSent: 1,
    activitiesJoined: 1,
    networkingConnectionsMade: 0,
    engagementHistory: [50, 45, 38, 30],
    feedback: 'Sessions are good but networking feels overwhelming.',
    currentLocation: 'Quiet Room',
    connections: 0,
    professionalIndustry: 'Creative',
    openToNetworking: false,
    energyLevel: 'low',
    stressLevel: 'high',
    emotionalState: 'tired',
    firstTimeEvent: true,
    quietRoom: true,
  },
  {
    // 6. KABIR KHAN - The Isolated Guest (At Risk)
    name: 'Kabir Khan',
    email: 'kabir.khan@wanderlust.com',
    interests: ['Travel'],
    goals: ['networking'],
    personalityType: 'ambivert',
    messagesSent: 0,
    activitiesJoined: 0,
    networkingConnectionsMade: 0,
    engagementHistory: [40, 35, 28, 20],
    feedback: null,
    currentLocation: 'Lobby',
    connections: 0,
    professionalIndustry: 'Travel',
    openToNetworking: true,
    energyLevel: 'low',
    stressLevel: 'normal',
    emotionalState: 'disengaged',
    firstTimeEvent: true,
  },
  {
    // 7. MEERA IYER - Sustainability Cluster Leader
    name: 'Meera Iyer',
    email: 'meera.iyer@climatefwd.org',
    interests: ['Sustainability', 'Climate Tech'],
    goals: ['collaboration'],
    personalityType: 'ambivert',
    messagesSent: 9,
    activitiesJoined: 3,
    networkingConnectionsMade: 4,
    engagementHistory: [60, 64, 68, 70],
    feedback: 'Loved meeting like-minded founders.',
    currentLocation: 'Workshop B',
    connections: 4,
    professionalIndustry: 'Environmental',
    openToNetworking: true,
    energyLevel: 'moderate',
    stressLevel: 'low',
    emotionalState: 'happy',
    firstTimeEvent: false,
  },
  {
    // 8. ROHAN MALHOTRA - Burnout Case
    name: 'Rohan Malhotra',
    email: 'rohan.malhotra@neuraltech.io',
    interests: ['AI'],
    goals: ['networking'],
    personalityType: 'extravert',
    messagesSent: 22,
    activitiesJoined: 4,
    networkingConnectionsMade: 5,
    engagementHistory: [85, 88, 82, 75],
    feedback: 'A bit tired after back-to-back sessions.',
    currentLocation: 'Cafeteria',
    connections: 5,
    professionalIndustry: 'Technology',
    openToNetworking: true,
    energyLevel: 'low',
    stressLevel: 'high',
    emotionalState: 'tired',
    firstTimeEvent: false,
  },
  {
    // 9. SIMRAN GILL - Balanced Social
    name: 'Simran Gill',
    email: 'simran.gill@travelscape.in',
    interests: ['Travel', 'Photography'],
    goals: ['networking', 'learning'],
    personalityType: 'ambivert',
    messagesSent: 8,
    activitiesJoined: 2,
    networkingConnectionsMade: 3,
    engagementHistory: [55, 60, 58, 62],
    feedback: 'Good balance of activities and networking.',
    currentLocation: 'Main Hall',
    connections: 3,
    professionalIndustry: 'Travel',
    openToNetworking: true,
    energyLevel: 'moderate',
    stressLevel: 'low',
    emotionalState: 'happy',
    firstTimeEvent: true,
  },
  {
    // 10. KARAN BHATIA - Late Joiner
    name: 'Karan Bhatia',
    email: 'karan.bhatia@funder.io',
    interests: ['Startup'],
    goals: ['funding'],
    personalityType: 'ambivert',
    messagesSent: 3,
    activitiesJoined: 1,
    networkingConnectionsMade: 1,
    engagementHistory: [20, 25, 32, 40],
    feedback: 'Just arrived, excited to connect!',
    currentLocation: 'Registration Desk',
    connections: 1,
    professionalIndustry: 'Finance',
    openToNetworking: true,
    energyLevel: 'high',
    stressLevel: 'low',
    emotionalState: 'excited',
    firstTimeEvent: true,
  },
  {
    // 11. TANVI DESAI - Negative Sentiment Case
    name: 'Tanvi Desai',
    email: 'tanvi.desai@explorer.net',
    interests: ['Travel'],
    goals: ['learning'],
    personalityType: 'introvert',
    messagesSent: 4,
    activitiesJoined: 1,
    networkingConnectionsMade: 1,
    engagementHistory: [50, 45, 42, 38],
    feedback: 'Networking area is too crowded.',
    currentLocation: 'Quiet Room',
    connections: 1,
    professionalIndustry: 'Education',
    openToNetworking: false,
    energyLevel: 'low',
    stressLevel: 'high',
    emotionalState: 'stressed',
    firstTimeEvent: true,
  },
  {
    // 12. DEV PATEL - Highly Connected Facilitator
    name: 'Dev Patel',
    email: 'dev.patel@techmentor.io',
    interests: ['Startup', 'AI', 'Sustainability'],
    goals: ['mentorship'],
    personalityType: 'extravert',
    messagesSent: 15,
    activitiesJoined: 3,
    networkingConnectionsMade: 8,
    engagementHistory: [68, 72, 75, 78],
    feedback: 'Great to see so much innovation happening!',
    currentLocation: 'Networking Hall',
    connections: 8,
    professionalIndustry: 'Technology',
    openToNetworking: true,
    energyLevel: 'high',
    stressLevel: 'low',
    emotionalState: 'excited',
    firstTimeEvent: false,
  },
];

// ============================================
// TUNED ENGAGEMENT SCORING ALGORITHM
// ============================================

/**
 * Calculate engagement score using tuned weights:
 * 
 * FinalScore = BasePropensity (30%) + LiveActivity (40%) + 
 *              SocialGraphInfluence (15%) + SentimentImpact (10%) + 
 *              MomentumAdjustment (5%)
 */
const calculateEngagementScore = (guest) => {
  // 1. BASE PROPENSITY (Max ±20 from 50)
  let base = 50;

  // Goals influence (tuned weights)
  if (guest.goals?.includes('networking')) base += 8;
  if (guest.goals?.includes('collaboration')) base += 5;
  if (guest.goals?.includes('funding')) base += 3;
  if (guest.goals?.includes('learning')) base += 2;
  if (guest.goals?.includes('partnerships')) base += 3;
  if (guest.goals?.includes('mentorship')) base += 4;

  // Personality
  if (guest.personalityType === 'introvert') base -= 5;
  if (guest.personalityType === 'extravert') base += 5;

  // Special conditions
  if (guest.quietRoom) base -= 5;
  if (guest.firstTimeEvent) base += 2;

  // Clamp base between 35 and 65
  base = Math.max(35, Math.min(65, base));

  // 2. LIVE ACTIVITY (40% weight, max ±25 from base)
  let activityScore = 0;
  activityScore += (guest.messagesSent || 0) * 0.8;
  activityScore += (guest.activitiesJoined || 0) * 6;
  activityScore += (guest.networkingConnectionsMade || 0) * 4;

  // Clamp activity contribution
  activityScore = Math.max(-25, Math.min(25, activityScore));

  // 3. SOCIAL GRAPH INFLUENCE (15%, cap at +15)
  const graphInfluence = Math.min((guest.connections || 0) * 2, 15);

  // 4. SENTIMENT IMPACT (10%, cap at ±10)
  let sentimentImpact = 0;
  if (guest.feedback) {
    const positiveWords = ['amazing', 'great', 'best', 'loved', 'excited', 'fantastic', 'wonderful', 'excellent'];
    const negativeWords = ['tired', 'overwhelming', 'crowded', 'disappointed', 'bad', 'terrible'];

    const lowerFeedback = guest.feedback.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerFeedback.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerFeedback.includes(w)).length;

    if (positiveCount > 0) sentimentImpact = Math.min(positiveCount * 5, 10);
    if (negativeCount > 0) sentimentImpact = -Math.min(negativeCount * 4, 10);
  }

  // 5. MOMENTUM ADJUSTMENT (5%)
  const history = guest.engagementHistory || [];
  let momentum = 0;
  if (history.length >= 2) {
    const change = history[history.length - 1] - history[0];
    if (change > 10) momentum = 5;
    if (change < -10) momentum = -5;
  }

  // Calculate final score
  let finalScore = base + activityScore + graphInfluence + sentimentImpact + momentum;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(finalScore)));
};

/**
 * Determine trend from engagement history
 */
const calculateTrend = (history) => {
  if (!history || history.length < 2) return 'stable';
  const change = history[history.length - 1] - history[0];
  if (change > 10) return 'rising';
  if (change < -10) return 'falling';
  return 'stable';
};

/**
 * Determine emotional state based on score and trend
 */
const determineEmotionalState = (score, trend, guest) => {
  // Priority: Use guest's declared state if fresh activity
  if (guest.emotionalState && guest.messagesSent > 0) {
    const stateMap = {
      'excited': 'Excited',
      'energized': 'Energized',
      'motivated': 'Motivated',
      'happy': 'Content',
      'content': 'Content',
      'neutral': 'Neutral',
      'tired': 'Fatigued',
      'stressed': 'Stressed',
      'disengaged': 'Disengaged'
    };
    return stateMap[guest.emotionalState] || 'Neutral';
  }

  // Derived from score and trend
  if (score > 80 && trend === 'rising') return 'Excited';
  if (score > 70 && trend === 'falling') return 'Fatigue Risk';
  if (score < 35 && trend === 'falling') return 'Disengaged';
  if (score < 35) return 'At Risk';
  if (score > 85) return 'Peak Energy';
  if (score > 70) return 'Engaged';
  if (score > 50) return 'Neutral';
  return 'Passive';
};

/**
 * Calculate risk level
 */
const calculateRiskLevel = (score, trend, guest) => {
  // HIGH RISK: Critical conditions
  if (score < 25 || (score < 35 && trend === 'falling' && guest.messagesSent === 0)) {
    return { level: 'high', reason: 'critically_low_engagement' };
  }

  // MEDIUM RISK: Declining
  if (trend === 'falling' && score < 45) {
    return { level: 'medium', reason: 'declining_engagement' };
  }

  // MEDIUM RISK: Negative feedback
  if (guest.feedback) {
    const negativeIndicators = ['tired', 'overwhelming', 'crowded', 'stress', 'disappointed'];
    if (negativeIndicators.some(w => guest.feedback.toLowerCase().includes(w))) {
      return { level: 'medium', reason: 'negative_sentiment_detected' };
    }
  }

  // LOW RISK: Quiet but present
  if (score < 40 && guest.personalityType === 'introvert') {
    return { level: 'low', reason: 'introvert_quiet_behavior' };
  }

  return { level: 'none', reason: null };
};

// ============================================
// SEEDING LOGIC
// ============================================

const seedBehavioralData = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get event ID from command line or generate new
    const eventId = process.argv[2] || new mongoose.Types.ObjectId();
    console.log(`📋 Seeding behavioral dataset for event: ${eventId}`);

    // Clear existing data
    await Guest.deleteMany({ eventId });
    await AIEngagement.deleteMany({ eventId });
    await AISentiment.deleteMany({ eventId });
    await AIPrediction.deleteMany({ eventId });
    console.log('🗑️ Cleared existing data');

    // Create guests
    const createdGuests = [];
    for (const profile of BEHAVIORAL_GUESTS) {
      // Calculate derived metrics
      const engagementScore = calculateEngagementScore(profile);
      const trend = calculateTrend(profile.engagementHistory);
      const emotionalState = determineEmotionalState(engagementScore, trend, profile);
      const risk = calculateRiskLevel(engagementScore, trend, profile);

      // Create guest document
      const guestData = {
        eventId,
        name: profile.name,
        email: profile.email,
        status: 'attended',
        checkedIn: true,
        checkedInAt: new Date(),
        interests: profile.interests,
        personalityType: profile.personalityType,
        professionalIndustry: profile.professionalIndustry,
        openToNetworking: profile.openToNetworking,
        energyLevel: profile.energyLevel,
        stressLevel: profile.stressLevel,
        emotionalState: profile.emotionalState,
        firstTimeEvent: profile.firstTimeEvent,
        goals: profile.goals,
        specialNeeds: profile.quietRoom ? ['quiet_space'] : [],
      };

      const guest = await Guest.create(guestData);
      createdGuests.push({ guest, profile, engagementScore, trend, emotionalState, risk });

      // Create engagement record
      await AIEngagement.create({
        eventId,
        guestId: guest._id,
        engagementScore,
        participationRate: Math.min(100, Math.round((profile.activitiesJoined / 5) * 100 + (profile.messagesSent / 20) * 100) / 2),
        activityLevel: engagementScore > 80 ? 'very_high' : engagementScore > 60 ? 'high' : engagementScore > 40 ? 'moderate' : 'low',
        messagesSent: profile.messagesSent,
        messagesReceived: Math.floor(profile.messagesSent * 0.7),
        groupActivitiesJoined: profile.activitiesJoined,
        networkingConnectionsMade: profile.networkingConnectionsMade,
        trend,
        riskLevel: risk.level,
        lastActivityAt: new Date(),
        isActive: engagementScore > 30,
        currentLocation: profile.currentLocation,
        interactionStyle: engagementScore > 80 ? 'Connector' : engagementScore > 60 ? 'Active Participant' : engagementScore > 40 ? 'Observer' : 'Reserved',
      });

      // Create sentiment record if feedback exists
      if (profile.feedback) {
        const sentimentScore = emotionalState === 'Excited' || emotionalState === 'Energized' ? 0.8
          : emotionalState === 'Stressed' || emotionalState === 'Disengaged' ? -0.4
            : 0.2;

        await AISentiment.create({
          eventId,
          guestId: guest._id,
          feedback: profile.feedback,
          sentiment: sentimentScore > 0.3 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral',
          sentimentScore,
          rating: sentimentScore > 0.5 ? 5 : sentimentScore > 0 ? 4 : sentimentScore > -0.3 ? 3 : 2,
          category: 'overall',
          emotionalState,
        });
      }

      console.log(`  ✅ ${profile.name}: Score ${engagementScore}, Trend ${trend}, ${emotionalState}`);
    }

    // Create event-level AI predictions
    const predictions = [];

    // Social engagement prediction
    const highEngagers = createdGuests.filter(g => g.engagementScore > 80);
    const atRisk = createdGuests.filter(g => g.risk.level !== 'none');
    const risingGuests = createdGuests.filter(g => g.trend === 'rising');

    predictions.push({
      eventId,
      predictionType: 'social_engagement',
      predictions: {
        eventEnergy: Math.round(createdGuests.map(g => g.engagementScore).reduce((a, b) => a + b, 0) / createdGuests.length),
        highEngagementCount: highEngagers.length,
        atRiskCount: atRisk.length,
        risingCount: risingGuests.length,
        summary: `${highEngagers.length} guests highly engaged, ${atRisk.length} need attention`,
        topConnectors: createdGuests.filter(g => g.engagementScore > 90).map(g => g.profile.name),
        riskGuests: atRisk.map(g => ({ name: g.profile.name, reason: g.risk.reason }))
      },
      confidence: 0.82,
      guestCount: createdGuests.length
    });

    // Guest pairings prediction
    const compatibilityPairs = [];
    for (let i = 0; i < createdGuests.length; i++) {
      for (let j = i + 1; j < createdGuests.length; j++) {
        const g1 = createdGuests[i];
        const g2 = createdGuests[j];
        const shared = g1.profile.interests.filter(i => g2.profile.interests.includes(i));
        if (shared.length > 0 && g1.engagementScore > 50 && g2.engagementScore > 50) {
          compatibilityPairs.push({
            guest1: g1.profile.name,
            guest2: g2.profile.name,
            compatibility: Math.min(95, 50 + shared.length * 15),
            sharedInterests: shared
          });
        }
      }
    }

    predictions.push({
      eventId,
      predictionType: 'guest_pairings',
      predictions: {
        recommendedPairings: compatibilityPairs.slice(0, 6),
        totalPossible: compatibilityPairs.length,
        strategy: 'Interest-based matching with engagement filter'
      },
      confidence: 0.78,
      guestCount: createdGuests.length
    });

    // Emotional state prediction
    const emotionalBreakdown = {
      excited: createdGuests.filter(g => g.emotionalState === 'Excited').length,
      happy: createdGuests.filter(g => g.emotionalState === 'Content' || g.emotionalState === 'Happy').length,
      neutral: createdGuests.filter(g => g.emotionalState === 'Neutral').length,
      tired: createdGuests.filter(g => g.emotionalState === 'Fatigued' || g.emotionalState === 'Tired').length,
      stressed: createdGuests.filter(g => g.emotionalState === 'Stressed').length
    };

    predictions.push({
      eventId,
      predictionType: 'emotional_state',
      predictions: {
        breakdown: emotionalBreakdown,
        dominantMood: emotionalBreakdown.excited > 3 ? 'Positive Energy' : 'Mixed',
        burnoutRisk: createdGuests.filter(g => g.engagementScore > 85 && g.trend === 'falling').map(g => g.profile.name),
        isolationRisk: createdGuests.filter(g => g.risk.level === 'high').map(g => g.profile.name)
      },
      confidence: 0.75,
      guestCount: createdGuests.length
    });

    // Networking clusters prediction
    const interestClusters = {};
    for (const { profile } of createdGuests) {
      for (const interest of profile.interests) {
        if (!interestClusters[interest]) interestClusters[interest] = [];
        interestClusters[interest].push(profile.name);
      }
    }

    predictions.push({
      eventId,
      predictionType: 'networking',
      predictions: {
        clusters: Object.entries(interestClusters)
          .filter(([_, members]) => members.length >= 2)
          .map(([interest, members]) => ({ interest, members, size: members.length })),
        suggestedSessions: [
          { topic: 'AI & Startup Synergy', target: 'AI + Startup interest guests' },
          { topic: 'Sustainability in Travel', target: 'Sustainability + Travel guests' }
        ]
      },
      confidence: 0.80,
      guestCount: createdGuests.length
    });

    await AIPrediction.insertMany(predictions);
    console.log(`✅ Created ${predictions.length} AI predictions`);

    // Summary
    const scores = createdGuests.map(g => g.engagementScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highCount = scores.filter(s => s > 80).length;
    const lowCount = scores.filter(s => s < 35).length;

    console.log('\n📊 BEHAVIORAL DATASET SUMMARY');
    console.log('================================');
    console.log(`Event ID: ${eventId}`);
    console.log(`Total Guests: ${createdGuests.length}`);
    console.log(`Event Energy: ${avgScore}%`);
    console.log(`High Engagement (>80): ${highCount} guests`);
    console.log(`At Risk (<35): ${lowCount} guests`);
    console.log(`Risk Cases: ${atRisk.length} guests`);

    console.log('\n🎯 PROFILE DISTRIBUTION');
    console.log('----------------------');
    for (const { profile, engagementScore, trend, emotionalState, risk } of createdGuests) {
      const tag = engagementScore > 80 ? '🟢' : engagementScore > 50 ? '🟡' : '🔴';
      console.log(`${tag} ${profile.name.padEnd(20)} | ${engagementScore}% | ${trend.padEnd(7)} | ${emotionalState.padEnd(15)} ${risk.level !== 'none' ? `| ${risk.level.toUpperCase()}` : ''}`);
    }

    console.log('\n📌 API ENDPOINTS TO TEST');
    console.log('------------------------');
    console.log(`GET  /api/ai/guests-data/${eventId}`);
    console.log(`GET  /api/ai/predictions/${eventId}`);
    console.log(`POST /api/ai/refresh/${eventId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding behavioral data:', error);
    process.exit(1);
  }
};

seedBehavioralData();
