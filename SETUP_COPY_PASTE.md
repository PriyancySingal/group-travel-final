# Quick Setup: Copy-Paste Implementation

## 🎯 Step 1: Update App.jsx Routes

Add this to your main `App.jsx` file in the routes section:

```javascript
// At the top with other imports
import GuestEventApp from "./pages/Event/GuestEventApp";
import EventMicrosite from "./pages/Event/EventMicrosite"; // if not already imported

// In your Route definitions (inside <Routes>)
<Route
  path="/event/:eventId/guest-experience"
  element={
    <ProtectedRoute>
      <GuestEventApp />
    </ProtectedRoute>
  }
/>;
```

---

## 🎯 Step 2: Add Navigation Link in EventMicrosite or Event Details Page

```javascript
// In EventMicrosite.jsx or wherever you show event details
import { useNavigate, useParams } from "react-router-dom";

function EventMicrosite() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const currentUser = useContext(AuthContext);

  return (
    <div>
      {/* Existing event details... */}

      {/* Add this button */}
      <button
        className="btn btn-primary btn-large"
        onClick={() => navigate(`/event/${eventId}/guest-experience`)}
        style={{ marginTop: "20px", padding: "12px 24px", fontSize: "16px" }}
      >
        ✨ Open Guest Companion App
      </button>

      {/* Or add to a tab/menu */}
      <nav className="event-tabs">
        <button>📝 Details</button>
        <button onClick={() => navigate(`/event/${eventId}/guest-experience`)}>
          ✨ Guest App
        </button>
        <button>🎤 Updates</button>
      </nav>
    </div>
  );
}
```

---

## 🎯 Step 3: Complete GuestEventApp Props Example

```javascript
// If you want to pass real event data to GuestEventApp
<Route
  path="/event/:eventId/guest-experience"
  element={
    <ProtectedRoute>
      <GuestEventAppWrapper />
    </ProtectedRoute>
  }
/>;

// Create a wrapper component
function GuestEventAppWrapper() {
  const { eventId } = useParams();
  const currentUser = useContext(AuthContext);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Fetch event details
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((data) => setEventData(data))
      .catch((err) => console.error("Failed to load event:", err));
  }, [eventId]);

  if (!eventData) return <div>Loading...</div>;

  return (
    <GuestEventApp
      guestId={currentUser?.id}
      guestName={currentUser?.name}
      guestAvatar={currentUser?.avatar}
      eventData={eventData}
      eventId={eventId}
    />
  );
}
```

---

## 🎯 Step 4: Initialize Services with User Data

Add this to your App's main authentication/context hook:

```javascript
// In your AuthContext or useAuth hook
import GamificationService from "./services/GamificationService";
import PersonalizationService from "./services/PersonalizationService";
import GuestEngagementService from "./services/GuestEngagementService";

function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ... your existing auth logic

    // When user logs in, initialize services
    if (currentUser?.id) {
      // Initialize gamification
      GamificationService.initializeGuest(
        currentUser.id,
        currentUser.name,
        currentUser.avatar || null,
      );

      // Initialize preferences
      PersonalizationService.initializePreferences(currentUser.id, {
        interests: currentUser.interests || [],
        dietaryRestrictions: currentUser.dietaryRestrictions || [],
        activityLevel: currentUser.activityLevel || "moderate",
        socialPreference: currentUser.socialPreference || "mixed",
        budget: currentUser.budget || "moderate",
        language: currentUser.language || "english",
        timezone: currentUser.timezone || "UTC",
        notificationPreference: currentUser.notificationPreference || "all",
      });

      // Subscribe to engagement updates
      const unsubscribe = GuestEngagementService.subscribe(
        ({ eventType, data }) => {
          // Handle real-time updates
          if (
            eventType === "notification:sent" &&
            data.targetGuests?.includes(currentUser.id)
          ) {
            // Show notification to user
            console.log("New notification:", data);
          }
        },
      );

      return () => unsubscribe();
    }
  }, [currentUser?.id]);

  return { currentUser, setCurrentUser };
}
```

---

## 🎯 Step 5: Example: Add Engagement Tracking

Add this to track guest actions throughout the app:

```javascript
// Create a custom hook for engagement tracking
import GuestEngagementService from "./services/GuestEngagementService";

function useEngagementTracking(guestId) {
  const trackAction = (action, metadata = {}) => {
    // Update engagement metrics
    GuestEngagementService.updateEngagementMetrics(guestId, action);

    // Optional: Log to backend
    fetch("/api/tracking/engagement", {
      method: "POST",
      body: JSON.stringify({
        guestId,
        action,
        timestamp: new Date(),
        ...metadata,
      }),
    }).catch((err) => console.error("Failed to track action:", err));
  };

  return { trackAction };
}

// Use in any component
function HotelCard({ hotel }) {
  const { trackAction } = useEngagementTracking(currentUser?.id);

  const handleBooking = () => {
    // ... booking logic
    trackAction("participated-activity", { activityId: hotel.id });
  };
}
```

---

## 🎯 Step 6: Admin: Create and Monitor Challenges

```javascript
// In AdminDashboard.jsx or EventManagementPanel.jsx
import GamificationService from "../services/GamificationService";
import GuestEngagementService from "../services/GuestEngagementService";

function AdminChallengeManager({ eventId }) {
  const handleCreateChallenge = () => {
    const challenge = GamificationService.createChallenge({
      name: "Meet the Team",
      description: "Connect with at least 5 people from different groups",
      icon: "👥",
      category: "networking",
      difficulty: "easy",
      pointsReward: 50,
      badgeId: "networker",
      participantIds: [],
    });

    // Notify all guests
    GuestEngagementService.sendNotification({
      guestId: "ALL", // or array of guest IDs
      type: "achievement",
      title: "🎪 New Challenge Available!",
      message: challenge.description,
      priority: "high",
      actionUrl: "/event/guest-experience#challenges",
    });

    console.log("Challenge created:", challenge);
  };

  return (
    <div>
      <button onClick={handleCreateChallenge}>Create Challenge</button>
    </div>
  );
}
```

---

## 🎯 Step 7: Admin: Monitor Live Engagement

```javascript
// In AdminDashboard.jsx
import GuestEngagementService from "../services/GuestEngagementService";

function EngagementMonitor({ eventId }) {
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    // Check sentiment every 10 seconds
    const interval = setInterval(() => {
      const data = GuestEngagementService.getLiveEventSentiment(eventId);
      setSentiment(data);
    }, 10000);

    // Initial check
    setSentiment(GuestEngagementService.getLiveEventSentiment(eventId));

    return () => clearInterval(interval);
  }, [eventId]);

  if (!sentiment) return <div>Loading sentiment data...</div>;

  return (
    <div className="engagement-monitor">
      <h3>Live Event Sentiment</h3>
      <div className="sentiment-stats">
        <div>
          <strong>Average Rating:</strong> ⭐{sentiment.averageRating}/5
        </div>
        <div>
          <strong>😊 Positive:</strong> {sentiment.sentiments?.positive || 0}
        </div>
        <div>
          <strong>😐 Neutral:</strong> {sentiment.sentiments?.neutral || 0}
        </div>
        <div>
          <strong>😞 Negative:</strong> {sentiment.sentiments?.negative || 0}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Step 8: Activity Sign-up Integration

Replace your existing activity sign-up with personalization:

```javascript
// In ActivityCard or ActivitySignUp component
import PersonalizationService from "../services/PersonalizationService";

function ActivitySignUpModal({ activity, guestId, onClose }) {
  const [groupSize, setGroupSize] = useState(1);
  const [notes, setNotes] = useState("");
  const [dietary, setDietary] = useState([]);

  const handleSignUp = async () => {
    // Sign up via personalization service
    const signup = PersonalizationService.signUpForActivity(
      guestId,
      activity.id,
      {
        groupSize,
        dietaryRestrictions: dietary,
        notes,
        status: "confirmed",
      },
    );

    // Send to backend
    await fetch("/api/activities/signup", {
      method: "POST",
      body: JSON.stringify(signup),
    });

    // Update engagement
    GuestEngagementService.updateEngagementMetrics(
      guestId,
      "signed-up-activity",
    );

    // Notify admin
    GuestEngagementService.sendNotification({
      guestId: "admin",
      type: "activity",
      title: `New Signup: ${activity.name}`,
      message: `${guestName} signed up for ${activity.name}`,
    });

    onClose();
  };

  return (
    <div className="modal">
      <h2>Sign Up for {activity.name}</h2>
      <input
        type="number"
        min="1"
        max="5"
        value={groupSize}
        onChange={(e) => setGroupSize(Number(e.target.value))}
        placeholder="Group size"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any special requests?"
      />
      <button onClick={handleSignUp}>Confirm Sign Up</button>
    </div>
  );
}
```

---

## 🎯 Step 9: Feedback Integration Example

```javascript
// In any page where you want to collect feedback
import GuestEngagementService from "../services/GuestEngagementService";

function HotelDetailsPage({ hotel }) {
  const handleFeedback = (rating, comment) => {
    const feedback = GuestEngagementService.submitFeedback(currentUser?.id, {
      type: "activity",
      targetId: hotel.id,
      rating, // 1-5
      comment,
      tags: ["quality", "service", "location"],
      isAnonymous: false,
    });

    // Send to backend
    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(feedback),
    });

    // Award points
    GuestEngagementService.updateEngagementMetrics(
      currentUser?.id,
      "gave-feedback",
    );

    alert("Thanks for your feedback! 🙏");
  };

  return (
    <div>
      {/* existing content */}
      <FeedbackPanel onSubmit={handleFeedback} placeholderType="activity" />
    </div>
  );
}
```

---

## 🎯 Step 10: Polling Example (Admin)

```javascript
// In AdminEventPanel.jsx
import GuestEngagementService from "../services/GuestEngagementService";

function AdminPollingPanel({ eventId, guests }) {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);

  const handleCreatePoll = () => {
    const poll = GuestEngagementService.createPoll({
      question: pollQuestion,
      options: options.filter((o) => o.trim()),
      endTime: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      createdBy: currentAdmin?.id,
      eventId,
    });

    // Send to backend
    fetch("/api/polls", {
      method: "POST",
      body: JSON.stringify(poll),
    }).then(() => {
      // Notify all guests
      GuestEngagementService.sendNotification({
        guestId: guests.map((g) => g.id),
        type: "poll",
        title: "🗳️ New Poll!",
        message: pollQuestion,
        priority: "high",
        actionUrl: "/event/guest-experience#polls",
      });

      // Reset form
      setPollQuestion("");
      setOptions(["", "", ""]);
    });
  };

  return (
    <div className="polling-panel">
      <h3>Create Live Poll</h3>
      <textarea
        value={pollQuestion}
        onChange={(e) => setPollQuestion(e.target.value)}
        placeholder="What would you like to ask?"
      />
      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
          placeholder={`Option ${i + 1}`}
        />
      ))}
      <button onClick={handleCreatePoll}>Send Poll to Guests</button>
    </div>
  );
}
```

---

## ✅ Verification Checklist

After implementing, verify these work:

```
✅ Can navigate to /event/{eventId}/guest-experience
✅ GuestEventApp loads with 9 tabs visible
✅ Can submit feedback from FeedbackPanel
✅ Can vote on a poll (create one in admin first)
✅ Can ask/answer questions in Q&A
✅ Can sign up for activities
✅ Engagement score increases after actions
✅ Notifications appear in NotificationCenter
✅ Can see challenges and leaderboard
✅ Can create custom itinerary
✅ Admin can see live sentiment scores
```

---

**All done!** Your guest engagement platform is ready to use. 🚀
