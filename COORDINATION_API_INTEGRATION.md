# 🔗 Coordination Platform - API Integration Guide

## Overview

This guide explains how to integrate the Centralized Group Coordination Platform with your backend API for production use.

---

## 📋 Required API Endpoints

### Events

#### Get All Events

```
GET /api/events
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sharma–Verma Wedding",
      "type": "wedding",
      "location": "Gangtok, Sikkim",
      "startDate": "2024-12-20",
      "endDate": "2024-12-22",
      "organizer": "Priya Sharma",
      "hotel": "Grand Himalayan Resort",
      "guestCount": 230,
      "budget": "₹50,00,000"
    }
  ]
}
```

#### Get Single Event

```
GET /api/events/:eventId
Response:
{
  "success": true,
  "data": { /* event object */ }
}
```

### Schedules

#### Get Event Schedule

```
GET /api/events/:eventId/schedule
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "day": 1,
      "date": "2024-12-20",
      "title": "Arrival & Welcome",
      "activities": [
        {
          "time": "14:00-16:00",
          "name": "Guest Arrival & Check-in",
          "location": "Grand Himalayan Resort",
          "dietary": false,
          "formal": false
        }
      ]
    }
  ]
}
```

### Guest Information

#### Get Guest Itinerary

```
GET /api/guests/:guestId/itinerary?eventId=:eventId
Response:
{
  "success": true,
  "data": {
    "guestId": 1,
    "eventId": 1,
    "personalItinerary": [
      {
        "day": 1,
        "activity": "Arrival at 14:30",
        "notes": "Room 501, Deluxe Double"
      }
    ]
  }
}
```

#### Get Guest Personalization

```
GET /api/guests/:guestId/profile?eventId=:eventId
Response:
{
  "success": true,
  "data": {
    "guestId": 1,
    "eventId": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "hotelAssignment": {
      "hotel": "Grand Himalayan Resort",
      "roomNumber": "501",
      "roomType": "Deluxe Double",
      "floor": 5,
      "checkIn": "2024-12-20T14:00:00Z",
      "checkOut": "2024-12-22T12:00:00Z"
    },
    "dietaryRestrictions": ["Vegetarian"],
    "diningPreferences": ["No Onion", "No Garlic"],
    "specialRequests": "Ground floor preferred",
    "transportationNeeds": "Airport pickup required",
    "accessibility": "Wheelchair accessible room",
    "emergencyContact": "+91-9876543210"
  }
}
```

#### Get Event Guests

```
GET /api/events/:eventId/guests
Response:
{
  "success": true,
  "data": [
    { /* guest personalization objects */ }
  ]
}
```

### Updates

#### Get Event Updates

```
GET /api/events/:eventId/updates?limit=50
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "timestamp": "2024-12-15T10:30:00Z",
      "type": "schedule",
      "message": "Dinner time updated from 8:00 PM to 8:30 PM",
      "severity": "info",
      "read": false
    }
  ]
}
```

#### Get Updates Since Timestamp

```
GET /api/events/:eventId/updates?since=2024-12-15T10:00:00Z
Response: Same as above, but only updates after the timestamp
```

#### Create Update (Admin Only)

```
POST /api/events/:eventId/updates
Body:
{
  "type": "schedule",
  "message": "Dinner time updated to 8:30 PM",
  "severity": "warning"
}
Response:
{
  "success": true,
  "data": { /* created update object */ }
}
```

#### Mark Update as Read

```
PATCH /api/updates/:updateId
Body: { "read": true }
Response:
{
  "success": true,
  "data": { /* updated update object */ }
}
```

#### Update Guest Preferences

```
PATCH /api/guests/:guestId/profile
Body:
{
  "dietaryRestrictions": ["Vegetarian", "Gluten-Free"],
  "diningPreferences": ["No Spicy"],
  "specialRequests": "High floor preferred"
}
Response:
{
  "success": true,
  "data": { /* updated guest profile */ }
}
```

### Analytics

#### Get Event Statistics

```
GET /api/events/:eventId/stats
Response:
{
  "success": true,
  "data": {
    "totalGuests": 230,
    "totalDays": 3,
    "totalActivities": 15,
    "unreadUpdates": 2
  }
}
```

#### Get Dietary Summary

```
GET /api/events/:eventId/dietary-summary
Response:
{
  "success": true,
  "data": {
    "Vegetarian": 50,
    "Vegan": 20,
    "Gluten-Free": 15,
    "Halal": 10,
    "None": 135
  }
}
```

#### Get Accessibility Summary

```
GET /api/events/:eventId/accessibility-summary
Response:
{
  "success": true,
  "data": {
    "wheelchairAccessible": 5,
    "mobilityAssistance": 8,
    "groundFloor": 12,
    "specialRequests": 45
  }
}
```

### Exports

#### Export Event as CSV

```
GET /api/events/:eventId/export/csv
Response: CSV file download
```

#### Export Event Data as JSON

```
GET /api/events/:eventId/export/json
Response:
{
  "success": true,
  "data": {
    "event": { /* event object */ },
    "schedule": [ /* schedule array */ ],
    "guests": [ /* guest objects */ ],
    "updates": [ /* updates array */ ],
    "dietary": { /* dietary summary */ },
    "accessibility": { /* accessibility summary */ }
  }
}
```

---

## 🔌 WebSocket Endpoints

### Connect to Event Updates

```
WS /ws/events/:eventId
```

#### Message Format (Server → Client)

```javascript
{
  "type": "update",
  "eventId": 1,
  "id": 5,
  "timestamp": "2024-12-15T10:30:00Z",
  "messageType": "schedule",
  "message": "Dinner time updated to 8:30 PM",
  "severity": "warning"
}
```

#### Message Format (Client → Server)

```javascript
{
  "type": "subscribe",
  "eventId": 1
}
```

---

## 🔄 Integration Steps

### Step 1: Update EventCoordinationService

Replace the static data with API calls:

```javascript
static async getEventById(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

static async getEventSchedule(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/schedule`);
    if (!response.ok) throw new Error('Failed to fetch schedule');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

// Similar updates for other methods...
```

### Step 2: Configure RealTimeUpdateService

Update WebSocket connection details:

```javascript
// src/services/RealTimeUpdateService.js
const wsUrl =
  process.env.REACT_APP_WS_URL || `ws://localhost:5001/ws/events/${eventId}`;
```

### Step 3: Add Environment Variables

```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com/ws

# .env.development
REACT_APP_API_URL=http://localhost:5001
REACT_APP_WS_URL=ws://localhost:5001/ws
```

### Step 4: Update Component Props

Ensure EventMicrosite receives correct eventId and guestId:

```jsx
// App.jsx
<EventMicrosite eventId={parseInt(params.eventId)} guestId={currentUser.id} />
```

---

## 🔐 Authentication

### Add Authorization Header

```javascript
// In all API calls
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${authToken}`,
};

fetch(`${API_BASE_URL}/api/events/${eventId}`, { headers });
```

### WebSocket Authentication

```javascript
// Connect with token
const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/events/${eventId}?token=${authToken}`;
this.wsConnection = new WebSocket(wsUrl);
```

---

## 📊 Error Handling

### Standard Error Response

```javascript
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User not authorized to view this event"
  }
}
```

### Handle Errors in Components

```javascript
try {
  const event = await EventCoordinationService.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  setEvent(event);
} catch (error) {
  console.error("Error:", error);
  setError(error.message);
}
```

---

## 🚀 Performance Optimization

### Implement Caching

```javascript
static eventCache = new Map();

static async getEventById(eventId) {
  if (this.eventCache.has(eventId)) {
    return this.eventCache.get(eventId);
  }

  const event = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
  this.eventCache.set(eventId, event);
  return event;
}
```

### Implement Lazy Loading

```javascript
static async getEventSchedule(eventId) {
  // Only fetch when needed
  return fetch(`${API_BASE_URL}/api/events/${eventId}/schedule`)
    .then(r => r.json())
    .then(d => d.data);
}
```

### Batch Requests

```javascript
static async getEventDetails(eventId, guestId) {
  const [event, schedule, guest] = await Promise.all([
    this.getEventById(eventId),
    this.getEventSchedule(eventId),
    this.getGuestPersonalization(guestId, eventId)
  ]);

  return { event, schedule, guest };
}
```

---

## 📝 Testing API Integration

### Test with Curl

```bash
# Get event
curl -H "Authorization: Bearer TOKEN" \
  https://api.yourdomain.com/api/events/1

# Get schedule
curl -H "Authorization: Bearer TOKEN" \
  https://api.yourdomain.com/api/events/1/schedule

# Create update
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"schedule","message":"Update text","severity":"info"}' \
  https://api.yourdomain.com/api/events/1/updates
```

### Test WebSocket

```javascript
// Browser console
const ws = new WebSocket("wss://api.yourdomain.com/ws/events/1?token=TOKEN");
ws.onmessage = (event) => console.log("Update:", event.data);
ws.send(JSON.stringify({ type: "subscribe", eventId: 1 }));
```

---

## 🔄 Migration Checklist

- [ ] Database schema created for events, schedules, guests, updates
- [ ] API endpoints implemented and tested
- [ ] Authentication system integrated
- [ ] WebSocket server configured
- [ ] EventCoordinationService updated with API calls
- [ ] RealTimeUpdateService WebSocket configured
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Performance tested with load
- [ ] HTTPS/WSS configured
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Documentation updated
- [ ] User acceptance testing completed

---

## 📚 Related Files

- [EventCoordinationService.js](src/services/EventCoordinationService.js)
- [RealTimeUpdateService.js](src/services/RealTimeUpdateService.js)
- [EventMicrosite.jsx](src/pages/Event/EventMicrosite.jsx)
- [COORDINATION_PLATFORM_GUIDE.md](COORDINATION_PLATFORM_GUIDE.md)

---

## 💡 Best Practices

1. **Always use async/await** for API calls
2. **Implement proper error handling** with user-friendly messages
3. **Cache frequently accessed data** (events, schedules)
4. **Use batch requests** to reduce number of API calls
5. **Implement request timeouts** to prevent hanging
6. **Log all API calls** for debugging
7. **Use request/response validation** to catch issues early
8. **Implement retry logic** for failed requests
9. **Monitor WebSocket connection** status
10. **Test with real data** before production

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Ready for Integration ✅
