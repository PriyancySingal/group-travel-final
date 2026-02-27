# 🤖 AI-Powered Social Intelligence Backend

## Overview

This backend provides AI-powered insights for the Group Travel platform, enabling organizers to predict guest interactions, suggest networking opportunities, create guest pairings, analyze emotional states, and track sentiment in real-time.

## ✅ Features Implemented

### 1. 👥 Social Engagement Prediction
- Predicts guest interaction scores (0-100)
- Identifies interaction styles (Introvert/Extravert/Ambivert)
- Determines optimal group sizes
- Flags risk factors (first-time attendees, language barriers, social anxiety)

### 2. 🤝 Networking Opportunities
- Groups guests by shared interests
- Suggests interest-based networking sessions
- Recommends optimal session times
- Provides participant suggestions

### 3. 💑 Guest Pairings
- Calculates compatibility scores between guests
- Identifies shared interests
- Suggests icebreakers and activities
- Predicts potential challenges

### 4. 😊 Emotional Intelligence
- Predicts guest emotional states (excited/happy/neutral/tired/disengaged)
- Tracks energy and stress levels
- Provides activity recommendations by state
- Generates wellness recommendations

### 5. 💬 Sentiment Analysis
- Analyzes feedback text for sentiment
- Tracks positive/neutral/negative trends
- Provides action alerts when issues detected
- Calculates overall sentiment trends

---

## 📁 MongoDB Models

### AIEngagement.js
Stores real-time engagement metrics for each guest at an event.

```javascript
{
  eventId: ObjectId,
  guestId: ObjectId,
  engagementScore: Number (0-100),
  participationRate: Number (0-100),
  activityLevel: String ('low'|'moderate'|'high'|'very_high'),
  messagesSent: Number,
  messagesReceived: Number,
  groupActivitiesJoined: Number,
  networkingConnectionsMade: Number,
  lastActivityAt: Date
}
```

### AISentiment.js
Stores guest feedback and sentiment analysis results.

```javascript
{
  eventId: ObjectId,
  guestId: ObjectId,
  feedback: String,
  sentiment: String ('positive'|'neutral'|'negative'),
  sentimentScore: Number (-1 to 1),
  rating: Number (1-5),
  category: String,
  keywords: [String],
  emotions: Object
}
```

### AIPrediction.js
Caches AI predictions for quick retrieval.

```javascript
{
  eventId: ObjectId,
  predictionType: String,
  predictions: Mixed,
  validUntil: Date,
  isStale: Boolean
}
```

### Guest.js (Enhanced)
Added AI-related fields:

```javascript
{
  // Social & Activity
  socialMediaActivity: Number (0-100),
  eventAttendanceCount: Number,
  
  // Personality
  personalityType: String ('introvert'|'extravert'|'ambivert'),
  openToNetworking: Boolean,
  groupActivityPreference: String,
  communicationStyle: String,
  
  // Professional
  professionalIndustry: String,
  professionalInterests: [String],
  hobbyInterests: [String],
  
  // Risk Factors
  firstTimeEvent: Boolean,
  likesMixingWithStrangers: Boolean,
  languageBarrier: Boolean,
  
  // Emotional State
  energyLevel: String ('low'|'moderate'|'high'),
  stressLevel: String ('low'|'normal'|'high'),
  emotionalState: String,
  socialExhaustion: Boolean,
  
  // Feedback
  appFeedbackHistory: [{
    feedback: String,
    rating: Number,
    timestamp: Date
  }],
  recentSocialActivity: String,
  
  // Check-in
  checkedIn: Boolean,
  checkedInAt: Date
}
```

---

## 🔌 API Endpoints

### Base URL
```
/api/ai
```

### Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

### 1. Get Guests Data for AI
```
GET /api/ai/guests-data/:eventId
```
Returns all guests with AI-related fields for an event.

**Response:**
```json
{
  "success": true,
  "data": {
    "guests": [...],
    "engagementData": [...],
    "sentimentData": [...],
    "summary": { "totalGuests": 20, "checkedIn": 10, "confirmed": 15 }
  }
}
```

### 2. Get All AI Predictions
```
GET /api/ai/predictions/:eventId
```
Returns all 5 AI predictions in one call.

**Response:**
```json
{
  "success": true,
  "data": {
    "interactions": [...],      // Social Engagement
    "networking": [...],         // Networking Opportunities
    "pairings": [...],          // Guest Pairings
    "emotionalStates": [...],   // Emotional Intelligence
    "sentimentTrends": {...},   // Sentiment Analysis
    "realTimeAnalysis": {...},  // Engagement Metrics
    "summary": {...}
  }
}
```

### 3. Track Engagement
```
POST /api/ai/track-engagement
```
Body:
```json
{
  "eventId": "...",
  "guestId": "...",
  "engagementScore": 75,
  "activityLevel": "high",
  "messagesSent": 5,
  "messagesReceived": 10,
  "groupActivitiesJoined": 2,
  "networkingConnectionsMade": 3,
  "lastLocation": "Main Hall"
}
```

### 4. Track Sentiment
```
POST /api/ai/track-sentiment
```
Body:
```json
{
  "eventId": "...",
  "guestId": "...",
  "feedback": "Amazing event! Loved the activities!",
  "rating": 5,
  "category": "overall",
  "activityId": "...",
  "sessionName": "Team Building"
}
```

### 5. Get Engagement Stats
```
GET /api/ai/engagement-stats/:eventId
```

### 6. Get Sentiment Analytics
```
GET /api/ai/sentiment-analytics/:eventId?timeRange=60
```
`timeRange` is in minutes (default: 60)

### 7. Get Networking Opportunities
```
GET /api/ai/networking-opportunities/:eventId
```

### 8. Get Guest Pairings
```
GET /api/ai/guest-pairings/:eventId
```

### 9. Update Guest Emotional State
```
PUT /api/ai/guest-emotional-state/:guestId
```
Body:
```json
{
  "energyLevel": "high",
  "stressLevel": "normal",
  "emotionalState": "excited",
  "socialExhaustion": false
}
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Environment Variables
Create `.env` file:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5001
```

### 3. Seed Demo Data
```bash
npm run seed:ai
```
This creates 20 sample guests with AI fields, engagement data, and sentiment records.

### 4. Start Server
```bash
npm run dev
```

### 5. Test API
Use the seeded Event ID: `69a13e361eaa6d440b2ec72f`

```bash
# Get all predictions
curl http://localhost:5001/api/ai/predictions/69a13e361eaa6d440b2ec72f

# Get guests data
curl http://localhost:5001/api/ai/guests-data/69a13e361eaa6d440b2ec72f

# Get engagement stats
curl http://localhost:5001/api/ai/engagement-stats/69a13e361eaa6d440b2ec72f
```

---

## 🔧 Frontend Integration

### Using the AISocialIntelligenceService

```javascript
import AISocialIntelligenceService from './services/AISocialIntelligenceService';

// Set event ID
AISocialIntelligenceService.setEventId(eventId);

// Load all predictions from backend
const predictions = await AISocialIntelligenceService.loadAllPredictions(eventId, guests);

// Or use individual methods
const interactions = AISocialIntelligenceService.predictGuestInteractions(guests);
const networking = AISocialIntelligenceService.suggestNetworkingOpportunities(guests);
const pairings = AISocialIntelligenceService.suggestGuestPairings(guests);
const emotions = AISocialIntelligenceService.predictGuestEmotionalStates(guests);
const sentiments = AISocialIntelligenceService.getSentimentTrends();

// Track engagement
await AISocialIntelligenceService.trackEngagementToBackend({
  eventId,
  guestId,
  engagementScore: 75,
  activityLevel: 'high'
});

// Track sentiment
await AISocialIntelligenceService.trackSentimentToBackend({
  eventId,
  guestId,
  feedback: 'Great event!',
  rating: 5
});
```

---

## 📊 Algorithm Details

### Interaction Score Calculation
```
Score = 50 (base) 
      + min(socialMediaActivity / 5, 20)
      + min(eventAttendanceCount * 1.5, 15)
      + min(interests.length * 3, 15)
Max: 100
```

### Compatibility Score Calculation
```
Score = 0.5 (base)
      + sharedInterests.length * 0.15
      + (samePersonality ? 0.2 : 0)
      + (complementaryPersonality ? 0.15 : 0)
      + (sameIndustry ? 0.1 : 0)
      + sharedHobbies.length * 0.1
Max: 1.0
```

### Sentiment Analysis
Uses keyword matching with positive/negative word lists to determine sentiment score (-1 to 1).

---

## 🎯 Hackathon Tips

1. **Real-time Updates**: Use WebSocket to push engagement changes to the dashboard
2. **Feedback Collection**: Add a simple feedback form in the guest app
3. **Check-in Integration**: Connect engagement tracking to check-in system
4. **Demo Mode**: Use the seed script to quickly populate demo data
5. **Custom Weights**: Adjust algorithm weights based on event type

---

## 📝 Event ID for Testing

**Seeded Event ID:** `69a13e361eaa6d440b2ec72f`

Use this ID to test all API endpoints immediately after running the seed script.

---

## 🤝 Need Help?

1. Check the AI_INSIGHTS_IMPLEMENTATION_GUIDE.md in the project root
2. Review the frontend component at src/pages/AIInsights/AIInsights.jsx
3. Check console logs for debugging

---

**Status:** ✅ Production Ready  
**Last Updated:** December 2024

