# Real-Time AI Insights - Feature Checklist & Quick Reference

## ✅ Implementation Complete

### Core Real-Time Features
- ✅ **computePredictions()** – Centralized computation from live DB state
- ✅ **streamPredictions()** – SSE streaming endpoint for live updates
- ✅ **MongoDB Change Streams** – Auto-trigger on engagement/sentiment changes
- ✅ **EventSource Integration** – Frontend SSE subscription
- ✅ **Query String Auth** – Support for token in URL (EventSource requirement)

### 5 AI Prediction Features (All Real-Time)
1. ✅ **Social Engagement** – Guest interaction patterns & risk assessment
2. ✅ **Networking Opportunities** – Interest-based group recommendations
3. ✅ **Guest Pairings** – Compatibility matching with suggestions
4. ✅ **Emotional Intelligence** – Emotional state & wellness support
5. ✅ **Sentiment Analysis** – Feedback trends & action items

### Data Collection
- ✅ **POST /api/ai/track-engagement** – Log guest activity
- ✅ **POST /api/ai/track-sentiment** – Log feedback & sentiment
- ✅ **Frontend Simulation** – Demo post every 4 seconds
- ✅ **Frontend Polling** – Refresh every 5 seconds (fallback)

### Authentication
- ✅ Bearer token in `Authorization` header
- ✅ Token in `?token=` query string (for EventSource)
- ✅ Demo token support (`demo_token_*`)

## 🚀 How to Test

### Step 1: Seed Demo Data
```bash
cd backend
npm run seed:ai
```

### Step 2: Start Backend
```bash
npm start
# Server runs on http://localhost:5001
```

### Step 3: Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Open AI Insights Page
1. Navigate to Admin Dashboard (or Events page)
2. Click "AI Insights" tab
3. Should see predictions updating every 5 seconds (polling)

### Step 5: Monitor Real-Time Updates
- **Engagement Data:** Posts every 4 seconds (simulation)
- **Predictions Update:** Reflective of latest engagement data
- **No Refresh Needed:** All updates happen automatically

## 📡 API Endpoints

### Get Predictions (One-time)
```http
GET http://localhost:5001/api/ai/predictions/<eventId>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interactions": [...],
    "networking": [...],
    "pairings": [...],
    "emotionalStates": [...],
    "sentimentTrends": {...},
    "realTimeAnalysis": {...},
    "summary": {...}
  }
}
```

### Stream Predictions (Real-Time SSE)
```http
GET http://localhost:5001/api/ai/predictions-stream/<eventId>?token=<jwt>
```

**Events:**
- `heartbeat` – Sent every 15s (connection alive signal)
- `prediction` – Full updated prediction object
- `error` – Error message

### Track Engagement
```http
POST http://localhost:5001/api/ai/track-engagement
Content-Type: application/json

{
  "eventId": "...",
  "guestId": "...",
  "engagementScore": 75,
  "activityLevel": "high",
  "messagesSent": 5,
  "messagesReceived": 8,
  "groupActivitiesJoined": 2,
  "networkingConnectionsMade": 3,
  "sessionName": "Main Hall",
  "lastLocation": "Room 101"
}
```

### Track Sentiment
```http
POST http://localhost:5001/api/ai/track-sentiment
Content-Type: application/json

{
  "eventId": "...",
  "guestId": "...",
  "feedback": "Great networking opportunity!",
  "rating": 5,
  "category": "activity",
  "activityId": "...",
  "sessionName": "Panel Discussion"
}
```

## 📚 Documentation Files

1. **REALTIME_AI_SETUP.md** – Complete technical setup guide
   - Architecture overview
   - Database schema
   - Testing procedures
   - Troubleshooting

2. **REALTIME_AI_IMPLEMENTATION.md** – Feature implementation summary
   - Data flow diagrams
   - Modified files list
   - Next steps & enhancements
   - Production considerations

3. This file – Quick reference checklist

## 🔍 Verify Installation

### Backend Validation
```bash
cd backend
node -e "import('./controllers/aiController.js').then(() => console.log('✓ aiController ready')).catch(e => console.error('✗', e.message))"
node -e "import('./routes/aiRoutes.js').then(() => console.log('✓ aiRoutes ready')).catch(e => console.error('✗', e.message))"
```

### Frontend Validation
```bash
npm run build 2>&1 | grep -i error
# Should have no errors
```

## 🎯 Key Changes Summary

| File | Change | Purpose |
|------|--------|---------|
| `aiController.js` | Added `computePredictions()` | Centralized real-time computation |
| `aiController.js` | Added `streamPredictions()` | SSE endpoint for live updates |
| `aiRoutes.js` | Added `/predictions-stream/:eventId` route | Expose SSE endpoint |
| `authMiddleware.js` | Added query string token support | Allow EventSource to pass token |
| `AISocialIntelligenceService.js` | Added `subscribeToPredictionStream()` | Frontend SSE subscription |

## 🔄 Data Flow Summary

```
Database (Guest, AIEngagement, AISentiment)
           ↓ (Change Streams)
    computePredictions()
           ↓ (SSE Stream)
    Frontend EventSource
           ↓
    setPredictions() → UI Update
```

## 💡 Configuration Options

### Polling Interval (Frontend)
Edit `src/pages/AIInsights/AIInsights.jsx`:
```javascript
const interval = setInterval(() => {
  loadAIPredictions();
}, 5000); // Change to desired milliseconds
```

### Simulation Interval (Frontend)
```javascript
const simInterval = setInterval(async () => {
  // Post engagement data
}, 4000); // Change to desired milliseconds
```

### Heartbeat Interval (Backend)
Edit `backend/controllers/aiController.js`:
```javascript
const heartbeat = setInterval(() => {
  res.write('event: heartbeat\n');
  res.write(`data: ...\n\n`);
}, 15000); // Change heartbeat frequency
```

## 🆘 Troubleshooting Quick Guide

| Issue | Cause | Fix |
|-------|-------|-----|
| "No guests found" | Database empty | Run `npm run seed:ai` |
| Auth 401 errors | Invalid/expired token | Use demo token or login again |
| Predictions not updating | Polling disabled or no data | Check browser console logs |
| SSE stream closes | Network issue or auth failure | Verify token in query string |
| Database connection error | MongoDB not running | Start MongoDB service |

## 📞 Support

For complete details, see:
- **Setup Issues?** → Read `REALTIME_AI_SETUP.md`
- **Architecture Questions?** → Read `REALTIME_AI_IMPLEMENTATION.md`
- **Code Issues?** → Check browser console and server logs

## ✨ Success Indicators

When everything is working:
1. ✅ AI Insights page loads without errors
2. ✅ Predictions display all 5 features
3. ✅ Engagement metrics update every ~5 seconds
4. ✅ Guest profiles show varied interaction scores
5. ✅ Networking opportunities populate based on interests
6. ✅ Guest pairings show compatibility scores
7. ✅ Emotional states vary by engagement level
8. ✅ Sentiment trends reflect posted feedback

---

**Last Updated:** Implementation Complete  
**Status:** 🟢 Ready for Testing
