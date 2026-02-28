# Guest Engagement Platform - Integration Guide

## 🎯 Quick Start: 5 Steps to Activate

### Step 1: Add Route to App.jsx

```javascript
// At the top of App.jsx
import GuestEventApp from './pages/Event/GuestEventApp';

// In your Route definitions:
<Route
  path="/event/:eventId/guest-app"
  element={
    <ProtectedRoute>
      <GuestEventApp
        guestId={currentUser?.id}
        guestName={currentUser?.name}
        eventData={...}
      />
    </ProtectedRoute>
  }
/>
```

### Step 2: Add Navigation Link

From EventMicrosite or event details page:

```javascript
// In EventMicrosite.jsx or similar
<button
  onClick={() => navigate(`/event/${eventId}/guest-app`)}
  className="btn btn-primary"
>
  ✨ Open Guest Companion App
</button>
```

### Step 3: Initialize Services in Event Handler

```javascript
// When guest enters event
useEffect(() => {
  // Service singletons are ready to use
  const guestId = currentUser?.id;

  // Initialize guest in gamification system
  GamificationService.initializeGuest(
    guestId,
    currentUser?.name,
    currentUser?.avatar,
  );

  // Set up preferences
  PersonalizationService.initializePreferences(guestId, {
    interests: currentUser?.interests || [],
    activityLevel: "moderate",
    socialPreference: "mixed",
  });

  // Subscribe to updates
  const unsubscribe = GuestEngagementService.subscribe((update) => {
    // Handle real-time updates
    console.log("Event update:", update);
  });

  return unsubscribe;
}, [currentUser?.id]);
```

### Step 4: Bind Real Event Data

Replace sample data in components with actual event data:

```javascript
// EventScheduleView.jsx
useEffect(() => {
  // Fetch from API instead of using hardcoded sample
  const fetchSchedule = async () => {
    const schedule = await fetch(`/api/events/${eventId}/schedule`).then((r) =>
      r.json(),
    );
    setEvents(schedule);
  };
  fetchSchedule();
}, [eventId]);
```

### Step 5: Set Up Backend Endpoints

Create these endpoints in your backend:

```javascript
// Express example
// Feedback
app.post("/api/feedback", (req, res) => {
  const feedback = GuestEngagementService.submitFeedback(
    req.body.guestId,
    req.body,
  );
  // Persist to database
  saveFeedback(feedback);
  res.json(feedback);
});

// Polls
app.post("/api/polls", (req, res) => {
  const poll = GuestEngagementService.createPoll(req.body);
  savePoll(poll);
  broadcastToGuests("poll:created", poll); // WebSocket
  res.json(poll);
});

// Notifications
app.get("/api/guests/:guestId/notifications", (req, res) => {
  const notifs = GuestEngagementService.getNotifications(req.params.guestId);
  res.json(notifs);
});

// Activities
app.post("/api/activities/:activityId/signup", (req, res) => {
  const signup = PersonalizationService.signUpForActivity(
    req.body.guestId,
    req.params.activityId,
    req.body,
  );
  saveSignup(signup);
  updateCapacity(req.params.activityId);
  res.json(signup);
});

// Challenges
app.post("/api/challenges/:challengeId/complete", (req, res) => {
  const result = GamificationService.completeChallenge(
    req.params.challengeId,
    req.body.guestId,
  );
  awardPoints(req.body.guestId, result.points);
  res.json(result);
});
```

---

## 📱 Component Usage Examples

### In Admin Dashboard

```javascript
// Show live engagement metrics
import GuestEngagementService from "../../services/GuestEngagementService";

function AdminDashboard() {
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = GuestEngagementService.getLiveEventSentiment(eventId);
      setSentiment(data);
    }, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div>
      <div>Average Guest Satisfaction: ⭐{sentiment?.averageRating}/5</div>
      <div>😊 {sentiment?.sentiments?.positive} Positive</div>
      <div>😐 {sentiment?.sentiments?.neutral} Neutral</div>
      <div>😞 {sentiment?.sentiments?.negative} Negative</div>
    </div>
  );
}
```

### In EventListView

```javascript
// Show which guests are most engaged
import GamificationService from "../../services/GamificationService";

function EventListItem({ eventId }) {
  const [topGuests, setTopGuests] = useState([]);

  useEffect(() => {
    const guests = GamificationService.getTopEngagedGuests((limit = 5));
    setTopGuests(guests);
  }, []);

  return (
    <div>
      <h3>Most Active Guests</h3>
      {topGuests.map((guest) => (
        <div key={guest.id}>
          {guest.name} - {guest.totalPoints} points 🎯
        </div>
      ))}
    </div>
  );
}
```

### In Reports Page

```javascript
// Generate engagement report
import GuestEngagementService from "../../services/GuestEngagementService";

function EngagementReport() {
  const insights = GuestEngagementService.getEngagementInsights();

  return (
    <div>
      <h2>Event Engagement Analysis</h2>
      <p>Total Participants: {insights.totalParticipants}</p>
      <p>Avg Engagement Score: {insights.averageEngagementScore}/100</p>
      <p>High Engagement: {insights.membersByEngagementLevel.high}%</p>
      <p>Avg Response Time: {insights.avgResponseTime} min</p>
      <p>Total Interactions: {insights.interactions}</p>
    </div>
  );
}
```

---

## 🔌 Real-time WebSocket Integration

```javascript
// Set up Socket.io for live updates
import io from "socket.io-client";

// In your service initialization
const socket = io("http://localhost:3000", {
  query: { guestId: currentUser.id, eventId: eventId },
});

// Listen for real-time events
socket.on("poll:vote", (data) => {
  // Poll voting happened
  console.log("New poll vote:", data);
});

socket.on("feedback:submitted", (data) => {
  // New feedback received
  GuestEngagementService.processIncomingFeedback(data);
});

socket.on("challenge:completed", (data) => {
  // Guest completed challenge
  GamificationService.updateChallengeProgress(data);
  // Notify other guests
  GuestEngagementService.sendNotification({
    guestId: data.guestId,
    type: "achievement",
    title: "🎉 Achievement Unlocked!",
    message: `You earned "${data.badgeName}" badge!`,
  });
});

socket.on("activity:signup-confirmed", (data) => {
  // Activity spot filled
  updateActivityCapacity(data.activityId);
});
```

---

## 🗄️ Database Schema (Example)

```javascript
// MongoDB collections
db.createCollection("feedback", {
  schema: {
    guestId: String,
    eventId: String,
    type: String, // 'event', 'activity', 'service', 'food'
    rating: Number, // 1-5
    comment: String,
    sentiment: String, // 'positive', 'neutral', 'negative'
    isAnonymous: Boolean,
    timestamp: Date,
  },
});

db.createCollection("polls", {
  schema: {
    eventId: String,
    question: String,
    options: [String],
    votes: Map, // optionId -> [guestId, ...]
    startTime: Date,
    endTime: Date,
    isActive: Boolean,
  },
});

db.createCollection("notifications", {
  schema: {
    guestId: String,
    type: String,
    title: String,
    message: String,
    priority: String,
    actionUrl: String,
    isRead: Boolean,
    timestamp: Date,
  },
});

db.createCollection("activitySignups", {
  schema: {
    guestId: String,
    activityId: String,
    eventId: String,
    groupSize: Number,
    dietaryRestrictions: [String],
    notes: String,
    status: String, // 'pending', 'confirmed', 'cancelled'
    signupDate: Date,
  },
});

db.createCollection("challenges", {
  schema: {
    eventId: String,
    name: String,
    description: String,
    category: String,
    difficulty: String,
    pointsReward: Number,
    badgeId: String,
    completedBy: [String], // guestIds
    participants: Map, // guestId -> progress
    createdAt: Date,
  },
});

db.createCollection("leaderboards", {
  schema: {
    eventId: String,
    name: String,
    type: String, // 'points', 'challenges'
    metric: String,
    rankings: [
      {
        rank: Number,
        guestId: String,
        name: String,
        score: Number,
        medal: String,
      },
    ],
    lastUpdated: Date,
  },
});
```

---

## 🔐 Environment Variables

```env
# .env file
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
REACT_APP_ENABLE_REALTIME=true
REACT_APP_NOTIFICATION_TIMEOUT=5000
REACT_APP_POLL_AUTO_CLOSE=true
```

---

## 🧪 Testing the Integration

### Manual Test Checklist

```
[ ] Guest can see event schedule in guest app
[ ] Guest can submit feedback and see sentiment updated
[ ] Guest can vote on polls in real-time
[ ] Guest can ask/answer questions in Q&A
[ ] Guest can sign up for activities
[ ] Guest can create custom itinerary
[ ] Guest earns points for actions
[ ] Guest can see leaderboard rankings
[ ] Guest receives notifications for their actions
[ ] Admin can see live sentiment scores
[ ] Admin can create challenges
[ ] Admin notifications appear in guest app
```

### Unit Test Example

```javascript
// GuestEngagementService.test.js
describe("GuestEngagementService", () => {
  it("should submit feedback with sentiment analysis", () => {
    const feedback = GuestEngagementService.submitFeedback("guest-1", {
      rating: 5,
      comment: "Amazing experience!",
      type: "event",
    });

    expect(feedback.sentiment).toBe("positive");
    expect(feedback.rating).toBe(5);
  });

  it("should create active polls", () => {
    const poll = GuestEngagementService.createPoll({
      question: "Test?",
      options: ["Yes", "No"],
      endTime: new Date(Date.now() + 60000),
    });

    expect(poll.isActive).toBe(true);
  });
});
```

---

## 📊 Performance Considerations

| Feature             | Data Volume        | Frequency  | Impact                             |
| ------------------- | ------------------ | ---------- | ---------------------------------- |
| Feedback Collection | 100-5000 per event | Continuous | Low (sentiment analysis on-demand) |
| Live Polls          | 5-20 active        | Moderate   | Medium (real-time vote updates)    |
| Notifications       | 1000s per hour     | High       | Low (queued delivery)              |
| Leaderboards        | Updates per action | High       | Medium (cached, updated on action) |
| Challenges          | 10-50 active       | Low        | Low (weekly updates)               |

**Optimization Tips:**

- Cache leaderboards and update only on point changes
- Batch sentiment analysis (every 5 minutes vs real-time)
- Limit notification frequency per guest
- Use pagination for Q&A and feedback lists
- Archive old polls after completion

---

## 🚨 Common Issues & Fixes

**Issue: Services returning undefined**

```javascript
// Wrong
import GuestEngagementService from './services/GuestEngagementService';
const service = new GuestEngagementService(); // ❌ Creates new instance

// Right
import GuestEngagementService from './services/GuestEngagementService';
GuestEngagementService.submitFeedback(...); // ✅ Uses singleton
```

**Issue: Guest not seeing notifications**

```javascript
// Check: Is guestId matching?
const notifs = GuestEngagementService.getNotifications(guestId);
console.log(`Found ${notifs.length} notifications`);

// Debug: Listen for subscription updates
GuestEngagementService.subscribe((update) => {
  console.log("Notification update:", update);
});
```

**Issue: Leaderboard not updating**

```javascript
// After awarding points, manually trigger update
GamificationService.addPoints(guestId, 50, "reason");
GamificationService.updateLeaderboard(leaderboardId);
```

---

## 📚 Next Steps

1. **Install dependencies** if needed
2. **Add routes** to App.jsx
3. **Set up backend endpoints** for persistence
4. **Configure WebSocket** for real-time updates
5. **Test in guest browser** with multiple users
6. **Monitor analytics** real-time in admin dashboard
7. **Iterate on challenges** based on guest engagement

---

**Last Updated:** February 2025
**Integration Status:** Ready to Deploy ✅
