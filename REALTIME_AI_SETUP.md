# Real-Time AI Predictions Setup

This document describes the real-time AI prediction system that powers the AI Insights page.

## Overview

The AI Insights page now provides **true real-time** predictions based on actual guest data flowing from the backend. Rather than static outputs, the system continuously analyzes:

1. **Guest Profiles** – Personality type, interests, energy levels, engagement history
2. **Engagement Data** – Real-time activity tracking (messages, group activities, networking connections)
3. **Sentiment Feedback** – Guest feedback and emotional sentiment over time
4. **Dynamic Algorithms** – Predictions recalculate whenever engagement/sentiment data changes

## Architecture

### Backend (`aiController.js`)

#### `computePredictions(eventId)`  
Centralized helper function that computes all five AI features from current database state:
- **Social Engagement** – Guest interaction scores, preferred styles, risk factors
- **Networking Opportunities** – Interest-based group suggestions
- **Guest Pairings** – Compatibility matching with icebreaker suggestions
- **Emotional Intelligence** – Predicted emotional states & wellness recommendations
- **Sentiment Analysis** – Trend analysis of guest feedback

#### `streamPredictions(eventId)` - SSE Endpoint  
**Route:** `GET /api/ai/predictions-stream/:eventId?token=<jwt>`

Streams live prediction updates to connected clients using Server-Sent Events (SSE):
- Opens a persistent HTTP connection
- Sends heartbeat every 15 seconds to keep connection alive
- Listens to MongoDB change streams on `AIEngagement` and `AISentiment` collections
- Recalculates and pushes predictions whenever data changes
- Gracefully closes on client disconnect

#### Real-Time Data Collection
- **`POST /api/ai/track-engagement`** – Log guest activity (messages, group activities, networking, session info)
- **`POST /api/ai/track-sentiment`** – Log guest feedback and sentiment

### Frontend (`AIInsights.jsx`)

#### Data Fetching Strategy
1. **Initial Load** – Fetch full predictions from `/api/ai/predictions/:eventId`
2. **Polling** – Refresh every 5 seconds as a fallback
3. **SSE Subscription** – Subscribe to `/api/ai/predictions-stream/:eventId` for live updates
4. **Simulation** – Demo mode posts randomized engagement data every 4 seconds to test backend

#### Guest Data
- Fetches from backend if props are empty
- Falls back to localStorage via `GuestPreferencesService`
- Maintains local `guestList` state for continuous analysis

### Service (`AISocialIntelligenceService.js`)

#### Key Methods
```javascript
// Fetch initial guests from backend
fetchGuestsFromBackend(eventId)

// Fetch all predictions (one-time)
fetchPredictionsFromBackend(eventId)

// Subscribe to live SSE stream
subscribeToPredictionStream(eventId, onPrediction, onError)

// Post engagement data
trackEngagementToBackend(engagementData)

// Post sentiment data
trackSentimentToBackend(sentimentData)

// Fallback local computation
predictGuestInteractions(guests)
suggestNetworkingOpportunities(guests)
suggestGuestPairings(guests)
predictGuestEmotionalStates(guests)
```

## Authentication

### Bearer Token in Headers
```http
GET /api/ai/predictions/:eventId HTTP/1.1
Authorization: Bearer <JWT_TOKEN>
```

### For SSE Connections (EventSource)
```javascript
const token = AuthService.getToken();
const source = new EventSource(
  `/api/api/predictions-stream/${eventId}?token=${token}`
);
```

The `authMiddleware.js` now accepts tokens in both:
- `Authorization: Bearer <token>` header
- `?token=<token>` query parameter (for SSE)

### Demo Token Support
For quick testing without a full login:
```javascript
const demoToken = 'demo_token_' + Date.now();
AuthService.setToken(demoToken);
```

The middleware treats demo tokens (starting with `demo_token_`) as admin users.

## Data Flow Example

```
1. Guest data exists in DB (seeded or via API)
   ↓
2. Frontend requests /api/ai/predictions/:eventId
   ↓
3. computePredictions() reads:
   - Guest collection (profiles)
   - AIEngagement collection (activity data)
   - AISentiment collection (feedback data)
   ↓
4. Calculations produce 5 AI features
   ↓
5. Simulated engagement updates every 4s:
   - POST /api/ai/track-engagement
   - POST /api/ai/track-sentiment
   ↓
6. MongoDB change streams trigger SSE push
   ↓
7. Frontend receives prediction update in real-time
```

## Testing

### Seed Demo Data
```bash
npm run seed:ai
```

Populates:
- 3 demo guests with varied profiles
- Initial engagement records
- Sample sentiment data

### In Postman
1. **Get Token:**
   ```
   POST http://localhost:5001/api/auth/login
   Body: { email: "demo@example.com", password: "password" }
   ```
   Copy `token` from response.

2. **Fetch Predictions:**
   ```
   GET http://localhost:5001/api/ai/predictions/<eventId>
   Headers: Authorization: Bearer <token>
   ```

3. **Track Engagement:**
   ```
   POST http://localhost:5001/api/ai/track-engagement
   Body: {
     "eventId": "<eventId>",
     "guestId": "<guestId>",
     "engagementScore": 75,
     "activityLevel": "high",
     "messagesSent": 5,
     "messagesReceived": 8,
     "groupActivitiesJoined": 2,
     "networkingConnectionsMade": 3,
     "sessionName": "Panel A",
     "lastLocation": "Room 101"
   }
   ```

4. **Stream Predictions (if using curl with SSE support):**
   ```bash
   curl -N "http://localhost:5001/api/ai/predictions-stream/<eventId>?token=<token>"
   ```

## Configuration

### Environment Variables
- `API_BASE_URL` – Frontend API endpoint (default: vite env)
- `JWT_SECRET` – Backend JWT signing secret
- `MONGODB_URI` – Database connection string
- `PORT` – Server port (default: 5001)

### Event Source / SSE Polling Interval
Edit `AIInsights.jsx`:
```javascript
const interval = setInterval(() => {
  loadAIPredictions();
}, 5000); // Change to desired poll interval
```

### Engagement Simulation Interval
Edit `AIInsights.jsx`:
```javascript
const simInterval = setInterval(async () => {
  // Simulation posts engagement data
}, 4000); // Change to desired frequency
```

## Database Schema

### AIEngagement (tracks guest activity)
```javascript
{
  eventId: ObjectId,
  guestId: ObjectId,
  engagementScore: Number (0-100),
  activityLevel: String,
  messagesSent: Number,
  messagesReceived: Number,
  groupActivitiesJoined: Number,
  networkingConnectionsMade: Number,
  currentSession: { sessionName: String, startTime: Date },
  lastLocation: String,
  lastActivityAt: Date
}
```

### AISentiment (tracks feedback)
```javascript
{
  eventId: ObjectId,
  guestId: ObjectId,
  feedback: String,
  sentiment: String (positive/neutral/negative),
  sentimentScore: Number,
  rating: Number,
  category: String,
  context: { activityId, sessionName, timestamp },
  keywords: [String],
  emotions: { happy, excited, neutral, disappointed, frustrated },
  createdAt: Date
}
```

## Common Issues

**Issue:** SSE stream closes immediately  
**Solution:** 
- Ensure token is valid
- Check browser console for auth errors
- Use `?token=<jwt>` in URL if needed

**Issue:** No engagement data visible  
**Solution:**
- Run `npm run seed:ai` to populate demo data
- Check that demo engagement is being posted to `/track-engagement`
- Verify MongoDB is running and data persists

**Issue:** Predictions don't update  
**Solution:**
- Check `/predictions` endpoint returns data
- Verify polling interval in component
- Monitor browser console for fetch errors
- Monitor server for change stream errors

## Future Enhancements

- [ ] WebSocket instead of SSE for bidirectional updates
- [ ] Real-time guest checkin/activity tracking via mobile app
- [ ] Machine learning model integration for improved pairing
- [ ] Persistent sentiment analysis dashboard
- [ ] Guest notification system for recommended activities
- [ ] Analytics export (CSV, PDF)
