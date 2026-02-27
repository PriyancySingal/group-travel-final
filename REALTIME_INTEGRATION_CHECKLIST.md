# Real-Time Integration Implementation Checklist

Complete step-by-step guide to integrate Socket.io real-time features into your group travel booking system.

## 📋 Pre-Integration Checklist

- [ ] Node.js and npm installed
- [ ] Backend running on `http://localhost:5000`
- [ ] MongoDB connected
- [ ] JWT authentication working
- [ ] Group booking API endpoints working
- [ ] Frontend running on `http://localhost:5173`

## 🔧 Installation & Setup

### Step 1: Install Socket.io Package

```bash
cd backend
npm install socket.io
```

**Verify installation:**

```bash
npm list socket.io
```

Expected output: `socket.io@4.7.x` (or latest version)

### Step 2: Update server.js

**Current state:** Your server.js likely has `app.listen()`

**Required changes:**

1. Add import at the top (after existing imports):

```javascript
import { createServer } from "http";
import { Server } from "socket.io";
import {
  setupSocketio,
  emitNewGroupBooking,
  emitMemberAdded,
  emitPricingUpdated,
  emitBookingStatusChanged,
} from "./services/socketioService.js";
```

2. Find your existing `app.listen()` call and replace it:

**❌ BEFORE:**

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**✅ AFTER:**

```javascript
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io compatibility
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io globally accessible to all routes/controllers
global.io = io;

// Setup Socket.io event handlers
setupSocketio(io);

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.io enabled`);
});
```

3. **Important:** If your backend uses `import` (ES6 modules), ensure this is in `backend/package.json`:

```json
{
  "type": "module",
  "main": "server.js"
}
```

### Step 3: Verify Setup

Start your backend:

```bash
npm start
```

You should see:

```
✅ Server running on port 5000
✅ Socket.io enabled
```

## 🎯 Controller Updates

### Update: `backend/controllers/groupController.js`

Add imports at the top:

```javascript
import {
  emitNewGroupBooking,
  emitMemberAdded,
  emitPricingUpdated,
  emitBookingStatusChanged,
} from "../services/socketioService.js";
```

#### 1. Emit Event on Create Booking

Find the `createGroupBooking` function and add emission:

```javascript
exports.createGroupBooking = async (req, res) => {
  try {
    // ... existing create logic ...

    // ✨ ADD THIS BLOCK:
    const populatedBooking = await groupBooking.populate("createdBy");

    // Emit real-time event to admins
    emitNewGroupBooking(global.io, populatedBooking);

    res.status(201).json({
      success: true,
      message: "Group booking created successfully",
      data: populatedBooking,
      bookingId: groupBooking._id, // For frontend redirect
    });
  } catch (error) {
    console.error("Error creating group booking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

#### 2. Emit Event on Add Member

Find the `addMemberToGroup` function:

```javascript
exports.addMemberToGroup = async (req, res) => {
  try {
    // ... existing add member logic ...

    // ✨ ADD THIS BLOCK before sending response:
    const updatedBooking = await booking.populate("members.userId");

    // Emit to entire group
    emitMemberAdded(global.io, booking._id, {
      name: newMember.name,
      email: newMember.email,
      totalMembers: booking.members.length,
      updatedPricing: booking.pricingBreakdown,
    });

    res.status(200).json({
      success: true,
      message: "Member added to group",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

#### 3. Emit Event on Status Update

Find the `updateGroupBooking` function:

```javascript
exports.updateGroupBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const oldStatus = booking.bookingStatus;

    // Update booking
    Object.assign(booking, req.body);
    await booking.save();

    // ✨ ADD THIS BLOCK:
    if (req.body.bookingStatus && oldStatus !== req.body.bookingStatus) {
      emitBookingStatusChanged(global.io, booking._id, req.body.bookingStatus);
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

## 🎨 Frontend Setup

### Step 1: Install Socket.io Client

```bash
npm install socket.io-client
```

### Step 2: Create hooks directory (if not exists)

```bash
mkdir -p src/hooks
```

The hook file `useGroupBookingSocket.js` has already been created for you at `src/hooks/useGroupBookingSocket.js`

### Step 3: Update .env for API URL

Create or update `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

### Step 4: Use Hook in Components

#### Example 1: Group Dashboard with Real-Time Updates

```javascript
// src/pages/GroupDashboard.jsx

import {
  useGroupBookingSocket,
  useRealtimeNotification,
} from "../hooks/useGroupBookingSocket";
import { useEffect, useState } from "react";

function GroupDashboard() {
  const { bookingId } = useParams();
  const { connected, memberAdded, pricingUpdated, alerts } =
    useGroupBookingSocket(bookingId);
  const { notification, showNotification } = useRealtimeNotification();

  // When member joins
  useEffect(() => {
    if (memberAdded) {
      showNotification(`✅ ${memberAdded.memberName} joined!`, "success", 4000);
      // Update your UI state here
    }
  }, [memberAdded]);

  // When pricing updates
  useEffect(() => {
    if (pricingUpdated) {
      showNotification(
        `💰 Total: ₹${pricingUpdated.finalTotal.toLocaleString()}`,
        "info",
      );
    }
  }, [pricingUpdated]);

  return (
    <div>
      {connected ? "🟢 Connected" : "🔴 Reconnecting..."}
      {notification && <Toast {...notification} />}
      {/* Dashboard content */}
    </div>
  );
}
```

#### Example 2: Admin Dashboard with New Bookings

```javascript
// src/pages/AdminDashboard.jsx

import { useAdminDashboardSocket } from "../hooks/useGroupBookingSocket";

function AdminDashboard() {
  const { connected, newBookings, updates, metrics } =
    useAdminDashboardSocket();

  return (
    <div className="admin-dashboard">
      {connected && <div className="live-badge">🟢 Live Updates Enabled</div>}

      <div className="metrics">
        <Card title="Total Revenue">
          ₹{metrics?.totalRevenue.toLocaleString()}
        </Card>
        <Card title="Active Bookings">{metrics?.totalBookings}</Card>
      </div>

      <div className="new-bookings">
        <h3>📊 New Bookings (Live)</h3>
        {newBookings.map((booking) => (
          <BookingCard key={booking.bookingId} {...booking} />
        ))}
      </div>
    </div>
  );
}
```

## ✅ Testing Real-Time Features

### Test 1: Connection Test

1. Open browser dev console
2. Go to admin dashboard
3. You should see in console: `"✅ Socket.io connected"`

### Test 2: Emit Test Event

Add this temporary endpoint to `server.js`:

```javascript
app.get("/test-emit", (req, res) => {
  if (global.io) {
    global.io.to("admin-dashboard").emit("newGroupBookingCreated", {
      bookingId: "test-" + Date.now(),
      eventName: "Test Event",
      hotelName: "Test Hotel",
      totalAmount: 50000,
      memberCount: 5,
      createdAt: new Date(),
      suitabilityScore: 85,
    });
    res.json({ success: true, message: "Test event emitted" });
  } else {
    res.status(500).json({ error: "Socket.io not initialized" });
  }
});
```

Then visit: `http://localhost:5000/test-emit`

Check admin dashboard - you should see the test booking appear!

### Test 3: Create Real Booking

1. Go to hotel results
2. Click "Add to Group Plan"
3. Complete form and submit
4. Check if:
   - ✅ Admin dashboard shows the booking in real-time
   - ✅ Toast notification appears
   - ✅ Booking data populates correctly

### Test 4: Add Member in Real-Time

1. In group dashboard, add a new member
2. Check if:
   - ✅ Member appears instantly in list
   - ✅ Pricing updates in real-time
   - ✅ "Member joined" notification appears

## 🐛 Troubleshooting

### Issue: "Socket.io not initialized"

**Solution:**

```javascript
// Check if global.io is set
// In any controller:
console.log("global.io:", global.io ? "✅ Set" : "❌ Not set");

// If not set, ensure you have this in server.js:
global.io = io;
```

### Issue: "Cannot find module 'socket.io'"

**Solution:**

```bash
npm install socket.io
npm install socket.io-client  # For frontend
```

### Issue: CORS errors in console

**Solution:** Update server.js CORS config:

```javascript
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all (development only!)
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

### Issue: Frontend not connecting

**Solution:** Check:

1. Backend running on port 5000
2. `VITE_API_URL` environment variable set
3. Browser console: `io()` is available
4. No firewall blocking port 5000

## 📊 Monitoring Real-Time Activity

### Enable Debug Mode

Add to client-side code:

```javascript
const socket = io(API_URL, {
  debug: true, // Enable debug logs
});

socket.onAny((event, ...args) => {
  console.log(`[Socket Event] ${event}:`, args);
});
```

Add to server-side:

```javascript
io.engine.on("connection_error", (err) => {
  console.log("Connection error:", err);
});
```

## 🚀 Production Deployment

### Environment Variables

Create `.env.production`:

```
PORT=5000
FRONTEND_URL=https://yourapp.com
DATABASE_URL=production_mongodb_url
JWT_SECRET=your_secret_key
```

### Socket.io Configuration

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Fallback for restrictive networks
  serveClient: false, // Don't serve Socket.io client js
  pingInterval: 25000,
  pingTimeout: 60000,
});
```

## 📈 Performance Optimization

### 1. Room-Based Broadcasting

Instead of emitting to all:

```javascript
// Before: Sends to everyone
global.io.emit("event", data);

// After: Send to specific room only
global.io.to("group-123").emit("event", data);
```

### 2. Limit Event Frequency

```javascript
// Emit pricing updates max once per second
const debounced = debounce(() => {
  emitPricingUpdated(global.io, bookingId, pricing);
}, 1000);
```

### 3. Check Connection Before Emit

```javascript
// Always check before emitting
if (global.io && global.io.engine.clientsCount > 0) {
  emitNewGroupBooking(global.io, booking);
}
```

## 📚 Next Steps

1. **After Integration Complete:**
   - [ ] Test all real-time features (see Testing section)
   - [ ] Deploy to production
   - [ ] Monitor Socket.io connections
   - [ ] Set up error logging

2. **Future Enhancements:**
   - [ ] Email notifications for members
   - [ ] SMS alerts for urgent events
   - [ ] Push notifications
   - [ ] Analytics dashboard showing live metrics
   - [ ] Group chat feature

## 📞 Support Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [Socket.io Examples](https://github.com/socketio/socket.io/tree/main/examples)
- [React Hooks with Socket.io](https://dev.to/braedonwatsons/using-socketio-with-react-hooks-428e)

## 🎯 Success Criteria

After completing this integration, you should have:

✅ Socket.io server running without errors
✅ Frontend connects to Socket.io automatically
✅ New bookings appear in real-time on admin dashboard
✅ Member additions trigger instant UI updates
✅ Pricing changes broadcast to all group members
✅ Status changes emit to affected users
✅ Toast notifications appear for all events
✅ No console errors on either frontend/backend

---

**Last Updated:** 2024
**Status:** Ready for Integration
**Estimated Time:** 30-45 minutes
