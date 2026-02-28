# Socket.io Quick Reference

Fast lookup guide for Socket.io events and implementations.

## 🎯 Architecture Overview

```
Frontend (React)                      Backend (Express + Socket.io)
───────────────────────────────────────────────────────────────────
useGroupBookingSocket()    ←→    global.io server
  ↓ connects                       ↑ emits events
  ↓ joins room              ←→    setupSocketio()
  ↓ listens events          ←→    groupController
  ↓                                 ↑ calls emit functions

Storage: State                     Storage: MongoDB
```

## 📡 Event Reference Table

| Event                    | Direction | Trigger                        | Data          | Receiver        |
| ------------------------ | --------- | ------------------------------ | ------------- | --------------- |
| `joinAdminDashboard`     | →         | Admin opens dashboard          | none          | Server          |
| `joinGroupChat`          | →         | User opens group               | `{bookingId}` | Server          |
| `newGroupBookingCreated` | ←         | POST /api/group/create         | booking data  | admin-dashboard |
| `memberAdded`            | ←         | POST /api/group/:id/add-member | member data   | group-{id}      |
| `memberConfirmed`        | ←         | Member status = Confirmed      | member data   | group-{id}      |
| `pricingUpdated`         | ←         | Pricing recalculated           | pricing data  | group-{id}      |
| `bookingStatusChanged`   | ←         | Admin updates status           | status data   | group-{id}      |
| `availabilityAlert`      | ←         | Hotel availability low         | alert data    | group-{id}      |
| `surgePriceAlert`        | ←         | Surge pricing triggered        | surge data    | group-{id}      |
| `dashboardUpdate`        | ←         | Analytics updated              | metrics       | admin-dashboard |

## 🔌 Server Events (Backend Emits)

### 1. New Group Booking

```javascript
io.to("admin-dashboard").emit("newGroupBookingCreated", {
  bookingId: "507f1f77bcf86cd799439011",
  eventName: "Wedding Reception",
  eventType: "Wedding",
  hotelName: "Taj Palace",
  createdAt: "2024-01-15T10:30:00Z",
  createdBy: "Rajesh Kumar",
  totalAmount: 250000,
  memberCount: 12,
  status: "Draft",
  suitabilityScore: 92,
});
```

### 2. Member Added

```javascript
io.to("group-507f1f77bcf86cd799439011").emit("memberAdded", {
  bookingId: "507f1f77bcf86cd799439011",
  memberName: "Priya Singh",
  memberEmail: "priya@email.com",
  totalMembers: 13,
  updatedPricing: {
    baseTotal: 312500,
    totalForAllRooms: 360625,
    pricePerMember: 27740,
  },
  timestamp: "2024-01-15T11:15:00Z",
});
```

### 3. Pricing Updated

```javascript
io.to("group-507f1f77bcf86cd799439011").emit("pricingUpdated", {
  bookingId: "507f1f77bcf86cd799439011",
  baseTotal: 312500,
  gst: 37500,
  serviceFee: 15625,
  groupDiscount: 31250, // 10% for 5+ members
  earlyBirdDiscount: 0,
  finalTotal: 334375,
  pricePerMember: 25721,
  updatedAt: "2024-01-15T11:16:00Z",
});
```

### 4. Status Changed

```javascript
io.to("group-507f1f77bcf86cd799439011").emit("bookingStatusChanged", {
  bookingId: "507f1f77bcf86cd799439011",
  newStatus: "Confirmed",
  changedAt: "2024-01-15T14:30:00Z",
});

// Also emit to admin dashboard
io.to("admin-dashboard").emit("bookingStatusChanged", {
  bookingId: "507f1f77bcf86cd799439011",
  newStatus: "Confirmed",
});
```

### 5. Availability Alert

```javascript
io.to("group-507f1f77bcf86cd799439011").emit("availabilityAlert", {
  bookingId: "507f1f77bcf86cd799439011",
  type: "low_inventory",
  message: "Only 3 rooms left at this property!",
  remainingRooms: 3,
  severity: "warning",
  timestamp: "2024-01-15T12:00:00Z",
});
```

### 6. Surge Price Alert

```javascript
io.to("group-507f1f77bcf86cd799439011").emit("surgePriceAlert", {
  bookingId: "507f1f77bcf86cd799439011",
  originalPrice: 2500,
  surgePrice: 3000,
  surgePercentage: 20,
  reason: "last_minute",
  message: "Suite pricing up 20% due to last-minute demand",
  timestamp: "2024-01-15T15:45:00Z",
});
```

### 7. Dashboard Metrics Update

```javascript
io.to("admin-dashboard").emit("dashboardUpdate", {
  totalBookings: 45,
  totalRevenue: 11250000,
  averageGroupSize: 8.5,
  bookingsByType: {
    MICE: 15,
    Wedding: 18,
    Conference: 12,
  },
  bookingsByStatus: {
    Draft: 5,
    Confirmed: 35,
    Completed: 5,
  },
  timestamp: "2024-01-15T16:00:00Z",
});
```

## 🎧 Client Events (Frontend Sends)

### Join Admin Dashboard

```javascript
socket.emit("joinAdminDashboard");
```

### Join Group Chat

```javascript
socket.emit("joinGroupChat", {
  bookingId: "507f1f77bcf86cd799439011",
});
```

### Leave Group Chat

```javascript
socket.emit("leaveGroupChat", {
  bookingId: "507f1f77bcf86cd799439011",
});
```

## 🪝 React Hook Usage

### Basic Setup

```javascript
import { useGroupBookingSocket } from "../hooks/useGroupBookingSocket";

function MyComponent() {
  const {
    connected, // boolean
    error, // string | null
    bookingUpdates, // object | null
    memberAdded, // object | null
    pricingUpdated, // object | null
    statusChanged, // object | null
    alerts, // array
    sendMessage, // function(event, data)
  } = useGroupBookingSocket(bookingId);

  return <div>{connected ? "Connected" : "Connecting..."}</div>;
}
```

### Listen to Specific Events

```javascript
useEffect(() => {
  if (memberAdded) {
    console.log(`${memberAdded.memberName} joined!`);
    showNotification(`Welcome ${memberAdded.memberName}!`);
  }
}, [memberAdded]);

useEffect(() => {
  if (pricingUpdated) {
    updatePricingDisplay(pricingUpdated);
  }
}, [pricingUpdated]);
```

### Admin Dashboard Hook

```javascript
import { useAdminDashboardSocket } from "../hooks/useGroupBookingSocket";

function AdminDashboard() {
  const {
    connected, // boolean
    newBookings, // array
    updates, // array
    metrics, // object
    error, // string | null
  } = useAdminDashboardSocket();

  return (
    <div>
      {newBookings.map((b) => (
        <BookingCard key={b.bookingId} {...b} />
      ))}
      <MetricsDisplay {...metrics} />
    </div>
  );
}
```

## 🚀 Emit from Controller

### Standard Pattern

```javascript
// 1. Import
import { emitNewGroupBooking } from "../services/socketioService.js";

// 2. Call in controller
exports.createGroupBooking = async (req, res) => {
  try {
    // ... create logic ...
    const booking = await groupBooking.populate("createdBy");

    // 3. Emit event
    emitNewGroupBooking(global.io, booking);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 📚 Service Functions Available

```javascript
// From: backend/services/socketioService.js

// Setup
setupSocketio(io);

// Emitters
emitNewGroupBooking(io, bookingData);
emitMemberAdded(io, bookingId, memberData);
emitMemberConfirmed(io, bookingId, memberData);
emitPricingUpdated(io, bookingId, pricingData);
emitBookingStatusChanged(io, bookingId, newStatus);
emitAvailabilityAlert(io, bookingId, alertData);
emitSurgePriceAlert(io, bookingId, surgeData);
emitAdminDashboardUpdate(io, analyticsData);
```

## 🔐 Security Considerations

### 1. Authentication Check

```javascript
// Always verify user before emitting sensitive data
export const addMemberToGroup = async (req, res) => {
  // Check if user is booking creator or admin
  if (booking.createdBy !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  // ... proceed with emit ...
};
```

### 2. Room-Based Access Control

```javascript
// Don't emit to "admin-dashboard" if user isn't admin
if (req.user.role === "admin") {
  io.to("admin-dashboard").emit("newBooking", data);
}
```

### 3. CORS for Socket.io

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Restrict to your domain
    credentials: true,
  },
});
```

## 🐛 Debug Helpers

### Server-Side Logger

```javascript
// Add to socketioService.js
io.on("connection", (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[SOCKET] Client disconnected: ${socket.id}`);
  });
});

// Emit logger
function emitWithLog(io, room, event, data) {
  console.log(`[EMIT] Room: ${room}, Event: ${event}`);
  io.to(room).emit(event, data);
}
```

### Client-Side Logger

```javascript
// In useGroupBookingSocket.js
socket.onAny((event, ...args) => {
  console.log(`[RX] ${event}:`, args[0]);
});

// When emitting
socket.emit("joinGroupChat", { bookingId }, () => {
  console.log(`[TX] Joined room: ${bookingId}`);
});
```

## 📊 Performance Tips

### 1. Throttle Emissions

```javascript
// Don't emit too frequently
let lastEmitTime = 0;
function throttledEmit(event, data) {
  const now = Date.now();
  if (now - lastEmitTime > 1000) {
    // Max once per second
    global.io.emit(event, data);
    lastEmitTime = now;
  }
}
```

### 2. Check Connection Count

```javascript
// Only emit if someone's listening
if (global.io.engine.clientsCount > 0) {
  emitNewGroupBooking(global.io, booking);
}
```

### 3. Use Rooms for Targeted Emission

```javascript
// Instead of: io.emit("event", data) - sends to EVERYONE
// Use:       io.to("group-123").emit("event", data) - sends to specific group
```

## 🔗 Integration Points

| Component        | Location                               | Action                                            |
| ---------------- | -------------------------------------- | ------------------------------------------------- |
| Results Page     | src/pages/Results.jsx                  | Sends POST to /api/group/create which emits event |
| Group Dashboard  | src/pages/GroupDashboard.jsx           | Listens to memberAdded, pricingUpdated, etc.      |
| Admin Dashboard  | src/pages/AdminDashboard.jsx           | Listens to newGroupBookingCreated                 |
| Group Controller | backend/controllers/groupController.js | Calls emit functions                              |
| Socket Service   | backend/services/socketioService.js    | Defines all emit functions                        |

## ✅ Checklist for Implementation

- [ ] Install socket.io in backend
- [ ] Update server.js with Socket.io setup
- [ ] Import socketioService in controllers
- [ ] Add emit calls to controller functions
- [ ] Install socket.io-client in frontend
- [ ] Create/update useGroupBookingSocket hook
- [ ] Use hook in Components
- [ ] Test connection in browser console
- [ ] Test event emission with /api/test-socket
- [ ] Verify admin dashboard shows real-time updates
- [ ] Verify group members see live pricing updates

## 📖 Code Snippets

### Copy-Paste: Full Controller Update

```javascript
import groupBooking from "../models/GroupBooking.js";
import {
  emitNewGroupBooking,
  emitMemberAdded,
  emitBookingStatusChanged,
} from "../services/socketioService.js";

exports.createGroupBooking = async (req, res) => {
  try {
    const groupBooking = new GroupBooking(req.body);
    await groupBooking.save();
    const booking = await groupBooking.populate("createdBy");

    emitNewGroupBooking(global.io, booking);

    res.status(201).json({
      success: true,
      data: booking,
      bookingId: booking._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await GroupBooking.findById(bookingId);

    booking.members.push({ name: req.body.name, email: req.body.email });
    await booking.save();

    emitMemberAdded(global.io, bookingId, {
      name: req.body.name,
      email: req.body.email,
      totalMembers: booking.members.length,
      updatedPricing: booking.pricingBreakdown,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Copy-Paste: Component Usage

```javascript
import {
  useGroupBookingSocket,
  useRealtimeNotification,
} from "../hooks/useGroupBookingSocket";

function GroupDashboard() {
  const { bookingId } = useParams();
  const { connected, memberAdded, pricingUpdated } =
    useGroupBookingSocket(bookingId);
  const { showNotification } = useRealtimeNotification();

  useEffect(() => {
    if (memberAdded) {
      showNotification(`${memberAdded.memberName} joined!`, "success");
    }
  }, [memberAdded]);

  return <div>{connected ? "🟢 Connected" : "🔴 Connecting..."}</div>;
}
```

---

**Quick Links:**

- [Socket.io Docs](https://socket.io/docs/)
- Setup Guide: `SOCKETIO_SETUP_GUIDE.md`
- Integration Checklist: `REALTIME_INTEGRATION_CHECKLIST.md`
- Implementation Guide: `IMPLEMENTATION_GUIDE.md`

**Version:** 1.0
**Last Updated:** 2024
