/**
 * AI Insights Demo Data Seeder
 * Run this to generate sample guests with AI fields for testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';
import AISentiment from '../models/AISentiment.js';

dotenv.config();

// Sample interests
const interests = ['Photography', 'Travel', 'Technology', 'Food & Cuisine', 'Sports', 'Music', 'Arts', 'Adventure', 'Wellness', 'Business'];

// Sample personalities
const personalities = ['introvert', 'extravert', 'ambivert'];

// Sample industries
const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Legal', 'Engineering', 'Creative'];

// Generate random guests
const generateSampleGuests = (eventId, count = 20) => {
  const guests = [];

  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Cameron', 'Drew', 'Sam', 'Jamie', 'Robin', 'Skyler', 'Dakota', 'Reese', 'Parker', 'Sage', 'River', 'Phoenix'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const numInterests = Math.floor(Math.random() * 4) + 1;
    const guestInterests = [];

    // Pick random interests
    const shuffled = [...interests].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numInterests; j++) {
      guestInterests.push(shuffled[j]);
    }

    guests.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      eventId,
      status: Math.random() > 0.3 ? 'confirmed' : 'attended',
      checkedIn: Math.random() > 0.5,
      checkedInAt: Math.random() > 0.5 ? new Date() : null,
      interests: guestInterests,
      personalityType: personalities[Math.floor(Math.random() * personalities.length)],
      socialMediaActivity: Math.floor(Math.random() * 100),
      eventAttendanceCount: Math.floor(Math.random() * 10),
      openToNetworking: Math.random() > 0.2,
      groupActivityPreference: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      communicationStyle: ['formal', 'casual', 'balanced'][Math.floor(Math.random() * 3)],
      professionalIndustry: industries[Math.floor(Math.random() * industries.length)],
      professionalInterests: [shuffled[0], shuffled[1]].filter(Boolean),
      hobbyInterests: [shuffled[2], shuffled[3]].filter(Boolean),
      firstTimeEvent: Math.random() > 0.6,
      likesMixingWithStrangers: Math.random() > 0.3,
      languageBarrier: Math.random() > 0.8,
      preferredLanguage: 'English',
      energyLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      stressLevel: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
      emotionalState: ['excited', 'happy', 'neutral', 'tired', 'disengaged'][Math.floor(Math.random() * 5)],
      socialExhaustion: Math.random() > 0.7,
      preferredTimeSlots: ['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Early Evening (5-7 PM)'].slice(0, Math.floor(Math.random() * 3) + 1),
      dietaryRequirements: Math.random() > 0.7 ? [['vegetarian', 'vegan', 'gluten-free'][Math.floor(Math.random() * 3)]] : [],
    });
  }

  return guests;
};

// Main seeder function
const seedAIData = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get event ID from command line or use default
    const eventId = process.argv[2] || new mongoose.Types.ObjectId();
    console.log(`📋 Seeding data for event: ${eventId}`);

    // Clear existing AI data for this event
    await Guest.deleteMany({ eventId });
    await AIEngagement.deleteMany({ eventId });
    await AISentiment.deleteMany({ eventId });
    console.log('🗑️ Cleared existing data');

    // Generate sample guests
    const guests = generateSampleGuests(eventId, 20);
    const savedGuests = await Guest.insertMany(guests);
    console.log(`✅ Created ${savedGuests.length} sample guests`);

    // Generate engagement data for some guests
    const engagementData = [];
    for (const guest of savedGuests.slice(0, 15)) {
      engagementData.push({
        eventId,
        guestId: guest._id,
        engagementScore: Math.floor(Math.random() * 100),
        participationRate: Math.floor(Math.random() * 100),
        activityLevel: ['low', 'moderate', 'high', 'very_high'][Math.floor(Math.random() * 4)],
        messagesSent: Math.floor(Math.random() * 20),
        messagesReceived: Math.floor(Math.random() * 30),
        groupActivitiesJoined: Math.floor(Math.random() * 5),
        networkingConnectionsMade: Math.floor(Math.random() * 8),
        lastActivityAt: new Date(Date.now() - Math.random() * 3600000),
        isActive: Math.random() > 0.3,
      });
    }
    await AIEngagement.insertMany(engagementData);
    console.log(`✅ Created ${engagementData.length} engagement records`);

    // Generate sentiment data
    const sentiments = [];
    const feedbackTemplates = [
      { text: 'Amazing experience! The activities were fantastic!', sentiment: 'positive', rating: 5 },
      { text: 'Great event, loved the networking opportunities', sentiment: 'positive', rating: 4 },
      { text: 'The food was excellent and well organized', sentiment: 'positive', rating: 5 },
      { text: 'It was okay, nothing special', sentiment: 'neutral', rating: 3 },
      { text: 'Good but could use more interactive activities', sentiment: 'neutral', rating: 3 },
      { text: 'The venue was not great and scheduling was off', sentiment: 'negative', rating: 2 },
      { text: 'Disappointed with the overall experience', sentiment: 'negative', rating: 1 },
      { text: 'Too crowded and chaotic at times', sentiment: 'negative', rating: 2 },
      { text: 'Wonderful people and great conversations!', sentiment: 'positive', rating: 5 },
      { text: 'Loved the personalized attention', sentiment: 'positive', rating: 4 },
    ];

    for (const guest of savedGuests.slice(0, 10)) {
      const feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
      sentiments.push({
        eventId,
        guestId: guest._id,
        feedback: feedback.text,
        sentiment: feedback.sentiment,
        sentimentScore: feedback.sentiment === 'positive' ? 0.7 : feedback.sentiment === 'negative' ? -0.5 : 0,
        rating: feedback.rating,
        category: ['food', 'venue', 'activities', 'networking', 'overall'][Math.floor(Math.random() * 5)],
        createdAt: new Date(Date.now() - Math.random() * 7200000),
      });
    }
    await AISentiment.insertMany(sentiments);
    console.log(`✅ Created ${sentiments.length} sentiment records`);

    console.log('\n🎉 AI Demo Data seeded successfully!');
    console.log(`📝 Event ID to use: ${eventId}`);
    console.log('\n📌 To test the API:');
    console.log(`   GET /api/ai/predictions/${eventId}`);
    console.log(`   GET /api/ai/guests-data/${eventId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAIData();

