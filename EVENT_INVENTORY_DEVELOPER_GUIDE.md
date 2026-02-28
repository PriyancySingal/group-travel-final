# Event-Specific Inventory Management - Developer Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Layer (React)                        │
├──────────────────────────┬──────────────────────────────────┤
│  EventMicrosite.jsx      │  EventInventory.jsx              │
│  - Tab Navigation        │  - Tabs (Rooms/Transport/etc)    │
│  - Event Overview        │  - Summary Cards                 │
│  - Component Router      │  - Alerts Display                │
│                          │  - Recommendations Panel         │
│                          │  - Add Item Modal                │
├─────────────────────────────────────────────────────────────┤
│                 Component Layer (React)                      │
├──────────────────────────────────────────────────────────────┤
│  InventoryCard.jsx                                           │
│  - Reusable item display with +/- controls                  │
│  - Availability visualization                               │
│  - Occupancy alerts                                          │
├──────────────────────────────────────────────────────────────┤
│              Business Logic Layer (Services)                 │
├──────────┬──────────────────────────────────────────────────┤
│ EventInventoryService.js │ ResourceAllocationEngine.js      │
│ ─────────────────────────│ ────────────────────────────────│
│ • CRUD operations        │ • Smart suggestions              │
│ • Availability tracking  │ • AI allocation                  │
│ • Occupancy math         │ • Confidence scoring             │
│ • Alerts generation      │ • Guest integration              │
│ • CSV export             │ • Report generation              │
├──────────┴──────────────────────────────────────────────────┤
│                Data Storage (localStorage)                   │
├──────────────────────────────────────────────────────────────┤
│ event_inventory: {                                           │
│   "event-id": {                                              │
│     rooms: [...],        transport: [...],                   │
│     dining: [...],       activities: [...]                   │
│   }                                                          │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## How to Add a New Resource Type

Example: Adding "Accommodations" (hotels/Airbnbs) alongside rooms

### Step 1: Update EventInventoryService.js

```javascript
// Add to the service class
addAccommodation(eventId, accommodation) {
  const inventory = this.getEventInventory(eventId);
  const newAccommodation = {
    id: Date.now(),
    name: accommodation.name,
    type: accommodation.type,
    address: accommodation.address,
    rooms: accommodation.rooms,       // Number of rooms
    booked: 0,
    price: accommodation.price,
    description: accommodation.description
  };
  inventory.accommodations = inventory.accommodations || [];
  inventory.accommodations.push(newAccommodation);
  this.saveInventory(eventId, inventory);
  return newAccommodation;
}

getAvailableAccommodations(eventId) {
  const inventory = this.getEventInventory(eventId);
  return (inventory.accommodations || []).filter(
    acc => acc.rooms - acc.booked > 0
  );
}

updateAccommodationAvailability(eventId, accommodationId, booked) {
  const inventory = this.getEventInventory(eventId);
  const accommodation = inventory.accommodations.find(a => a.id === accommodationId);
  if (!accommodation) throw new Error("Accommodation not found");
  if (booked > accommodation.rooms) throw new Error("Cannot exceed capacity");
  accommodation.booked = booked;
  this.saveInventory(eventId, inventory);
}

deleteAccommodation(eventId, accommodationId) {
  const inventory = this.getEventInventory(eventId);
  inventory.accommodations = inventory.accommodations.filter(
    a => a.id !== accommodationId
  );
  this.saveInventory(eventId, inventory);
}
```

### Step 2: Update ResourceAllocationEngine.js

```javascript
suggestAccommodations(eventId, guests) {
  const inventory = EventInventoryService.getEventInventory(eventId);
  const accommodations = inventory.accommodations || [];

  const suggestions = accommodations.map(acc => ({
    accommodationId: acc.id,
    name: acc.name,
    availableRooms: acc.rooms - acc.booked,
    pricePerNight: acc.price,
    confidence: 85
  }));

  return suggestions;
}
```

### Step 3: Update EventInventory.jsx

```javascript
// Add accommodation state
const [showAccommodationForm, setShowAccommodationForm] = useState(false);

// Add accommodation tab
{
  activeTab === "accommodations" && (
    <div className="inventory-items">
      {inventory.accommodations?.map((acc) => (
        <InventoryCard
          key={acc.id}
          item={acc}
          type="accommodation"
          onUpdate={(booked) => updateAccommodation(acc.id, booked)}
          onDelete={() => deleteAccommodation(acc.id)}
        />
      ))}
    </div>
  );
}
```

---

## How to Extend ResourceAllocationEngine

### Add Custom Scoring Algorithm

```javascript
// Example: Priority-based scoring
calculateAllocationScore(guest, resource) {
  let score = 0;

  // Factor 1: Priority (0-40 points)
  if (guest.priority === "VIP") score += 40;
  else if (guest.priority === "HIGH") score += 25;
  else score += 10;

  // Factor 2: Preference Match (0-30 points)
  if (this.matchesPreference(guest, resource)) score += 30;

  // Factor 3: Availability (0-20 points)
  const availability = (1 - (resource.booked / resource.capacity)) * 20;
  score += availability;

  // Factor 4: Accessibility (0-10 points, override others)
  if (guest.accessibility && resource.wheelchair) score += 10;

  return Math.min(100, score);
}
```

### Add Machine Learning Integration

```javascript
// Example: Use external API for ML predictions
async suggestWithML(eventId, guests) {
  const inventory = EventInventoryService.getEventInventory(eventId);

  // Prepare data
  const data = {
    guests: guests.map(g => ({
      preferences: g.preferences,
      accessibility: g.accessibility
    })),
    resources: {
      rooms: inventory.rooms,
      dining: inventory.dining
    }
  };

  // Call ML service
  const response = await fetch("/api/ml/allocate", {
    method: "POST",
    body: JSON.stringify(data)
  });

  return await response.json();
}
```

---

## How to Add Backend Integration

### Step 1: Create Backend Endpoints

```javascript
// server.js (backend)
app.get("/api/events/:eventId/inventory", (req, res) => {
  const inventory = db.getInventory(req.params.eventId);
  res.json(inventory);
});

app.post("/api/events/:eventId/inventory/rooms", (req, res) => {
  const room = db.addRoom(req.params.eventId, req.body);
  res.json(room);
});

app.put(
  "/api/events/:eventId/inventory/rooms/:roomId/availability",
  (req, res) => {
    const room = db.updateRoomAvailability(
      req.params.eventId,
      req.params.roomId,
      req.body.booked,
    );
    res.json(room);
  },
);

app.get("/api/events/:eventId/inventory/recommendations", (req, res) => {
  const recs = generateRecommendations(req.params.eventId);
  res.json(recs);
});
```

### Step 2: Create API Service Layer

```javascript
// src/pages/Event/EventInventoryAPI.js
export class EventInventoryAPI {
  static async getInventory(eventId) {
    const res = await fetch(`/api/events/${eventId}/inventory`);
    return res.json();
  }

  static async addRoom(eventId, room) {
    const res = await fetch(`/api/events/${eventId}/inventory/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });
    return res.json();
  }

  static async updateRoomAvailability(eventId, roomId, booked) {
    const res = await fetch(
      `/api/events/${eventId}/inventory/rooms/${roomId}/availability`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booked }),
      },
    );
    return res.json();
  }
}
```

### Step 3: Update EventInventory to Use API

```javascript
// In EventInventory.jsx
import { EventInventoryAPI } from "./EventInventoryAPI";

useEffect(() => {
  // Try API first, fallback to service
  EventInventoryAPI.getInventory(eventId)
    .then((inv) => setInventory(inv))
    .catch(() => {
      const localInv = EventInventoryService.getEventInventory(eventId);
      setInventory(localInv);
    });
}, []);

// Update functions use API
const updateRoom = async (roomId, booked) => {
  await EventInventoryAPI.updateRoomAvailability(eventId, roomId, booked);
  loadInventory(); // Refresh from API
};
```

---

## How to Add Custom Reports

### Example: Occupancy Trend Report

```javascript
// In EventInventoryService.js
generateOccupancyTrendReport(eventId, startDate, endDate) {
  const inventory = this.getEventInventory(eventId);
  const snapshots = inventory.snapshots || []; // Need to add time-series

  return snapshots
    .filter(s => s.timestamp >= startDate && s.timestamp <= endDate)
    .map(s => ({
      date: new Date(s.timestamp),
      rooms: (s.booked.rooms / s.capacity.rooms) * 100,
      dining: (s.booked.dining / s.capacity.dining) * 100,
      transport: (s.booked.transport / s.capacity.transport) * 100,
      activities: (s.booked.activities / s.capacity.activities) * 100
    }));
}

exportOccupancyTrendReport(eventId) {
  const trend = this.generateOccupancyTrendReport(eventId, ... );
  const csv = this.convertToCSV(trend);
  return csv;
}
```

---

## How to Style New Components

### Base Glass-Morphism Card

```css
.inventory-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  padding: 20px;
  transition: all 0.3s ease;
}

.inventory-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

### Gradient Button Pattern

```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
```

---

## How to Debug Issues

### Enable Logging

```javascript
// In EventInventoryService.js
const DEBUG = true; // Set to false in production

addRoom(eventId, room) {
  if (DEBUG) console.log(`[EventInventory] Adding room:`, room);
  // ... implementation
  if (DEBUG) console.log(`[EventInventory] Room added with ID:`, newRoom.id);
}
```

### Check LocalStorage State

```javascript
// In browser console
localStorage.getItem("event_inventory");
JSON.parse(localStorage.getItem("event_inventory"));
localStorage.removeItem("event_inventory"); // Clear all data
```

### Test Resource Allocation

```javascript
// In browser console
import ResourceAllocationEngine from "./ResourceAllocationEngine.js";

const recs =
  ResourceAllocationEngine.getAllocationRecommendations("wedding-2024");
console.table(recs.rooms);
```

---

## Testing Strategy

### Unit Tests (Jest)

```javascript
// EventInventoryService.test.js
describe("EventInventoryService", () => {
  it("should add room without exceeding capacity", () => {
    const service = new EventInventoryService();
    const room = { name: "Test", capacity: 2 };
    service.addRoom("test-event", room);

    expect(() => {
      service.updateRoomAvailability("test-event", room.id, 3);
    }).toThrow("Cannot exceed capacity");
  });
});
```

### Integration Tests

```javascript
// EventInventory.integration.test.js
describe("EventInventory Integration", () => {
  it("should allocate rooms respecting accessibility", () => {
    const guests = [{ id: 1, preferences: { wheelchair: true } }];
    const recs = ResourceAllocationEngine.suggestRoomAssignments(
      "test-event",
      guests,
    );
    expect(recs[0].confidence).toBeGreaterThan(80);
  });
});
```

---

## Performance Optimization

### Memoization

```javascript
import { useMemo } from "react";

function EventInventory() {
  const summary = useMemo(
    () => EventInventoryService.getInventorySummary(eventId),
    [eventId],
  );

  return <div>{JSON.stringify(summary)}</div>;
}
```

### Lazy Loading Resources

```javascript
// Only load active tab data
const loadTabData = (tab) => {
  switch (tab) {
    case "rooms":
      return EventInventoryService.getAvailableRooms(eventId);
    case "transport":
      return EventInventoryService.getAvailableTransport(eventId);
    // ...
  }
};
```

### Virtual Lists for Large Datasets

```javascript
import { FixedSizeList } from "react-window";

function LargeInventoryList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <InventoryCard item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## Security Considerations

### Input Validation

```javascript
function validateRoom(room) {
  if (!room.name || room.name.trim().length === 0) {
    throw new Error("Room name is required");
  }
  if (room.capacity <= 0) {
    throw new Error("Capacity must be positive");
  }
  if (room.booked > room.capacity) {
    throw new Error("Booked cannot exceed capacity");
  }
  return true;
}
```

### Sanitize User Input

```javascript
const sanitizeInput = (str) => {
  return str.trim().replace(/<[^>]*>/g, ""); // Remove HTML tags
};

addRoom(eventId, room) {
  room.name = sanitizeInput(room.name);
  room.description = sanitizeInput(room.description);
  // ... add room
}
```

### Protect Sensitive Data

```javascript
// Don't expose prices in client-side suggestions
const suggestions = recs.map((r) => ({
  ...r,
  price: undefined, // Remove before sending to client
}));
```

---

## Deployment Checklist

- [ ] All imports resolved (no red squigglies)
- [ ] No `console.log()` statements in production
- [ ] DEBUG flag set to false
- [ ] localStorage keys consistent across app
- [ ] Error messages user-friendly
- [ ] Mobile responsive verified
- [ ] Performance profiled (React DevTools)
- [ ] Accessibility tested (Color contrast, keyboard nav)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Build succeeds without warnings

---

## Resources & References

- **React Docs:** https://react.dev
- **LocalStorage API:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **CSS Grid:** https://developer.mozilla.org/en-US/docs/Web/CSS/Grid

---

**Happy Coding! 🚀**
