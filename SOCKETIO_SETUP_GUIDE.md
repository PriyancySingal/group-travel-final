# Socket.io Real-Time Integration Guide

This guide walks you through setting up Socket.io for real-time updates in the "Add to Group Plan" feature.

## Quick Setup (Copy-Paste Ready)

### Step 1: Install Socket.io Package

```bash
cd backend
npm install socket.io
```

### Step 2: Update `backend/server.js`

Add these imports at the top of your server.js file (after existing imports):

```javascript
import { Server } from "socket.io";
import {
  setupSocketio,
  emitNewGroupBooking,
  emitMemberAdded,
  emitPricingUpdated,
  emitBookingStatusChanged,
} from "./services/socketioService.js";
```

Then, replace the existing `app.listen()` call with this:

```javascript
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = createServer(app); // Add: import { createServer } from "http";
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io globally accessible
global.io = io;

// Setup Socket.io event handlers
setupSocketio(io);

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.io enabled for real-time updates`);
});
```

### Step 3: Enable Socket.io Events in Controllers

Update `backend/controllers/groupController.js`:

Add these imports at the top:

```javascript
import {
  emitNewGroupBooking,
  emitMemberAdded,
  emitPricingUpdated,
  emitBookingStatusChanged,
} from "../services/socketioService.js";
```

Then update the `createGroupBooking` function to emit events:

```javascript
exports.createGroupBooking = async (req, res) => {
  try {
    // ... existing create logic ...

    const bookingData = await groupBooking.populate("createdBy");

    // ✨ ADD THIS: Emit real-time event
    emitNewGroupBooking(global.io, bookingData);

    res.status(201).json({
      success: true,
      data: bookingData,
      message: "Group booking created successfully",
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

Update the `addMemberToGroup` function:

```javascript
exports.addMemberToGroup = async (req, res) => {
  try {
    // ... existing add member logic ...

    // ✨ ADD THIS: Emit real-time event
    emitMemberAdded(global.io, booking._id, {
      name: newMember.name,
      email: newMember.email,
      totalMembers: booking.members.length,
      updatedPricing: booking.pricingBreakdown,
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: "Member added to group",
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

Update the `updateGroupBooking` function to emit status changes:

```javascript
exports.updateGroupBooking = async (req, res) => {
  try {
    // ... existing update logic ...

    // ✨ ADD THIS: Emit real-time status change
    if (
      req.body.bookingStatus &&
      req.body.bookingStatus !== booking.bookingStatus
    ) {
      emitBookingStatusChanged(global.io, booking._id, req.body.bookingStatus);
    }

    res.status(200).json({
      success: true,
      data: booking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

### Step 4: Set Up Frontend Socket Listeners

Create a new Group Dashboard component or use the hook in an existing component:

```javascript
// src/pages/GroupDashboard.jsx

import { useParams } from "react-router-dom";
import { useGroupBookingSocket } from "../hooks/useGroupBookingSocket";
import { useRealtimeNotification } from "../hooks/useGroupBookingSocket";
import { useEffect, useState } from "react";

function GroupDashboard() {
  const { bookingId } = useParams();
  const { connected, memberAdded, pricingUpdated, alerts } =
    useGroupBookingSocket(bookingId);
  const { notification, showNotification } = useRealtimeNotification();
  const [booking, setBooking] = useState(null);

  // Show notification when member added
  useEffect(() => {
    if (memberAdded) {
      showNotification(
        `✅ ${memberAdded.memberName} joined the group!`,
        "success",
        4000,
      );
    }
  }, [memberAdded]);

  // Show notification when pricing updates
  useEffect(() => {
    if (pricingUpdated) {
      showNotification(
        `💰 Price updated to ₹${pricingUpdated.finalTotal}`,
        "info",
        4000,
      );
    }
  }, [pricingUpdated]);

  return (
    <div className="group-dashboard">
      {/* Connection Status */}
      <div
        className={`status-badge ${connected ? "connected" : "disconnected"}`}
      >
        {connected ? "🟢 Connected" : "🔴 Reconnecting..."}
      </div>

      {/* Alerts */}
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.severity}`}>
          {alert.message}
        </div>
      ))}

      {/* Toast Notification */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Dashboard Content */}
      {booking && (
        <div>
          <h1>{booking.eventName}</h1>
          <p>Total: ₹{booking.pricingBreakdown.totalForAllRooms}</p>
          <p>Members: {booking.members.length}</p>
        </div>
      )}
    </div>
  );
}

export default GroupDashboard;
```

## Testing Socket.io Connection

### Method 1: Browser Console Test

```javascript
// In browser console of admin dashboard:

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to Socket.io!");
});

socket.on("newGroupBookingCreated", (data) => {
  console.log("🆕 New booking:", data);
});
```

### Method 2: Create a Test Endpoint

Add this temporary endpoint in your server for testing:

```javascript
app.get("/api/test-socket", (req, res) => {
  if (global.io) {
    // Emit test event to all connected clients
    global.io.emit("newGroupBookingCreated", {
      bookingId: "test-123",
      eventName: "Test Event",
      eventType: "Conference",
      hotelName: "Test Hotel",
      totalAmount: 50000,
      memberCount: 5,
    });
    res.json({ success: true, message: "Test event emitted" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Socket.io not initialized" });
  }
});
```

Then visit: `http://localhost:5000/api/test-socket`

You should see the event in the browser console!

## Events Reference

### Backend → Frontend Events

| Event                    | Data                                                      | Trigger                 |
| ------------------------ | --------------------------------------------------------- | ----------------------- |
| `newGroupBookingCreated` | bookingId, eventName, hotelName, totalAmount, memberCount | New booking created     |
| `memberAdded`            | memberName, totalMembers, updatedPricing                  | Member joins group      |
| `memberConfirmed`        | memberName, confirmedCount, totalMembers                  | Member confirms         |
| `pricingUpdated`         | baseTotal, gst, finalTotal, pricePerMember                | Pricing changes         |
| `bookingStatusChanged`   | newStatus, changedAt                                      | Admin updates status    |
| `availabilityAlert`      | type, message, remainingRooms, severity                   | Availability changes    |
| `surgePriceAlert`        | surgePercentage, reason, message                          | Surge pricing triggered |

### Frontend → Backend Events

| Event                | Data      | Purpose                |
| -------------------- | --------- | ---------------------- |
| `joinAdminDashboard` | none      | Admin joins dashboard  |
| `joinGroupChat`      | bookingId | User joins group room  |
| `leaveGroupChat`     | bookingId | User leaves group room |

## Environment Variables

Add to `.env` (backend):

```
SOCKET_IO_ENABLED=true
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### Connection fails

**Problem:** "Socket.io connection refused"

**Solution:**

- Ensure `http://localhost:5000` is accessible
- Check CORS settings in server.js
- Verify `global.io` is initialized

### Events not received

**Problem:** Emitting events but frontend doesn't receive them

**Solution:**

- Check browser Console for "Socket.io connected" message
- Verify client joined correct room (joinGroupChat emission)
- Check server logs for emit calls

### CORS errors

**Problem:** "Access to XMLHttpRequest blocked by CORS"

**Solution:** Update CORS in server.js:

```javascript
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (development only!)
    methods: ["GET", "POST"],
  },
});
```

## Next Steps

1. ✅ Install socket.io: `npm install socket.io`
2. ✅ Copy imports to server.js
3. ✅ Replace app.listen() with server setup
4. ✅ Add emissions to controller functions
5. ✅ Create GroupDashboard component with hooks
6. ✅ Test connection via browser console
7. ✅ Deploy with Socket.io enabled

## Production Deployment

For production (e.g., on Azure/AWS):

```javascript
// Use environment-based URL
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://yourapp.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Fallback for disconnected networks
});
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ useGroupBookingSocket Hook                                 │ │
│ │ ├─ Connects to Socket.io on mount                         │ │
│ │ ├─ Listens: memberAdded, pricingUpdated, etc.            │ │
│ │ └─ Returns: connected, alerts, updates state             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    WebSocket Connection                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express + Socket.io)                                   │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Socket.io Server (global.io)                               │ │
│ │ ├─ setupSocketio() initializes rooms                      │ │
│ │ ├─ "admin-dashboard" room for admins                      │ │
│ │ └─ "group-{bookingId}" rooms for members                  │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Controllers emit events                                     │ │
│ │ ├─ createGroupBooking → emitNewGroupBooking()            │ │
│ │ ├─ addMemberToGroup → emitMemberAdded()                  │ │
│ │ └─ updateGroupBooking → emitBookingStatusChanged()       │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Database (MongoDB)                                          │ │
│ │ └─ Persists booking & member data                         │ │
│ └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

**Created:** 2024 | Part of Group Travel Coordination Platform
**Related Files:**

- backend/services/socketioService.js
- src/hooks/useGroupBookingSocket.js
- backend/controllers/groupController.js (to be updated)
- backend/server.js (to be updated)
