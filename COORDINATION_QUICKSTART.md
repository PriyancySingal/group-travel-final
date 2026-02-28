# 🎉 Coordination Platform - Quick Start Guide

## ⚡ 2-Minute Setup

### Step 1: Import the Component

```jsx
import EventMicrosite from "./pages/Event/EventMicrosite";

// In your App component
<EventMicrosite eventId={1} guestId={1} />;
```

### Step 2: Browse the Microsite

- Visit the event page
- Click through the 6 tabs to explore features
- View schedules, itineraries, updates, and guest info

---

## 📋 What's Available in This Platform?

### As an Admin

✅ View all event information  
✅ See guest assignments and preferences  
✅ Monitor real-time updates  
✅ Export guest lists as CSV  
✅ View event statistics and analytics

### As a Guest

✅ View your personalized information  
✅ See your hotel assignment  
✅ Review event schedule  
✅ Print your personal itinerary  
✅ Check dietary preferences  
✅ Receive real-time notifications

---

## 🗂️ Tabs Explained

### 📋 Overview

**What you see**: Event summary, total guests, number of days, activities count
**Special feature**: Quick info cards (Event Type, Organizer, Hotel)

### 📅 Schedule

**What you see**: Day-by-day event schedule with times and locations
**Interactions**: Click day headers to expand/collapse
**Indicators**: 🍽️ Dietary, 👔 Formal attire

### 👤 My Itinerary

**What you see**: Your personal timeline of activities
**Interactions**: Click to print your itinerary
**Visual**: Timeline with day numbers and special notes

### 🎯 My Info

**What you see**: Your room assignment, dining preferences, accessibility needs
**Sections**: Hotel, Dining, Special Requests, Emergency Contact
**Interactions**: Click section headers to expand/collapse

### ⚡ Updates

**What you see**: Real-time notifications about schedule changes, room assignments, etc.
**Badge**: Red number shows unread updates
**Interactions**: Click to mark as read, or "Mark all as read"

### 📦 Inventory

**What you see**: Available rooms, transport, dining, and activities
**Detailed info**: Capacity, availability, costs

---

## 🎯 Common Tasks

### View Your Hotel Room

1. Click **🎯 My Info** tab
2. Click **Hotel Assignment** section
3. See your room number, floor, and check-in time

### Check Dietary Preferences

1. Click **🎯 My Info** tab
2. Click **Dining Preferences** section
3. View restrictions and preferences

### Print Your Itinerary

1. Click **👤 My Itinerary** tab
2. Click **🖨️ Print Itinerary** button
3. Select Print from browser menu

### Check Real-Time Updates

1. Click **⚡ Updates** tab
2. See unread updates count at top
3. Click update to mark as read
4. See timestamp of when update arrived

### Export Guest List

```javascript
// Admin only
const csv = EventCoordinationService.exportEventAsCSV(eventId);
// Paste into Excel or Google Sheets
```

---

## 🔔 Understanding Update Types

| Type           | Meaning              | Example                     |
| -------------- | -------------------- | --------------------------- |
| 🔵 **Info**    | General information  | "Schedule available online" |
| 🟢 **Success** | Positive change      | "Room upgrade available"    |
| 🟠 **Warning** | Important notice     | "Dinner time changed"       |
| 🔴 **Error**   | Problem notification | "Room unavailable"          |

---

## 🌐 Real-Time Updates Explained

### How Updates Work

1. Admin makes a change (e.g., dinner time updated)
2. Update is sent to all guests via WebSocket
3. You see a notification appear instantly
4. Badge shows number of unread updates
5. Click to mark as read

### Update Features

- ⏱️ **Time Stamp**: Shows when update happened (e.g., "5m ago")
- 🏷️ **Type Badge**: Shows category (schedule, accommodation, etc.)
- 📍 **Severity**: Color indicates importance
- ✓ **Read Status**: Click checkmark to mark as read

---

## 📊 Event Statistics

| Metric             | Example | What It Means                        |
| ------------------ | ------- | ------------------------------------ |
| **Total Guests**   | 230     | Number of people attending           |
| **Event Days**     | 3       | How many days the event runs         |
| **Activities**     | 15      | Total number of scheduled activities |
| **Unread Updates** | 2       | Notifications you haven't seen       |

---

## 🏨 Understanding Your Hotel Assignment

When you expand **Hotel Assignment** you'll see:

```
🏨 Hotel Assignment
├─ Hotel: Grand Himalayan Resort
├─ Room Number: 501
├─ Room Type: Deluxe Double
├─ Floor: 5
├─ Check-in: Dec 20, 2024, 2:00 PM
└─ Check-out: Dec 22, 2024, 12:00 PM
```

**Pro Tips**:

- Save your room number (shown on your key card)
- Note check-in time (you can often check in earlier)
- Check-out time is usually 12:00 PM (ask hotel for late checkout)

---

## 🍽️ Dining Preferences

### Dietary Restrictions

These are medical/religious needs:

- Vegetarian 🥬
- Vegan 🌱
- Gluten-Free 🌾
- Halal ☪️
- Kosher ✡️

### Dining Preferences

These are personal choices:

- Spicy food (no onion, no garlic, etc.)
- Cuisine preferences
- Allergen concerns

**Note**: Hotels use this info to prepare your meals before the event

---

## 🎯 Pro Tips for Best Experience

1. **Check Updates Daily**: New updates arrive throughout the day
2. **Mark Updates as Read**: Keeps your notification count accurate
3. **Download Schedule**: Print or screenshot for offline access
4. **Share Your Info**: Make sure dietary needs are accurate
5. **Check Itinerary**: Shows your personal schedule, not all events
6. **Contact Hotel**: Save hotel contact info from My Info section

---

## ❓ FAQ

### Q: Can I change my room?

**A**: Contact the event organizer. They can request a different room from the hotel.

### Q: What if I have a dietary emergency?

**A**: Call the emergency contact number shown in your profile.

### Q: Will I get notifications?

**A**: Yes! When there's an update, you'll see a badge with the number of new notifications.

### Q: Can I access this offline?

**A**: No, but you can print or screenshot your itinerary and hotel info.

### Q: What is this food restriction?

**A**: Check with event organizer if you're unsure about a dietary restriction label.

---

## 🔐 Privacy & Security

✅ **Your data is private**: Only you and event organizers can see your info  
✅ **Emergency contact is confidential**: Only shown to organizers  
✅ **Room assignments are secure**: Hotel staff and organizers only  
✅ **Updates are real-time**: Encrypted via WebSocket connection

---

## 📞 Need Help?

| Question                | Where to Look                       |
| ----------------------- | ----------------------------------- |
| My hotel room details   | **🎯 My Info** → Hotel Assignment   |
| My dietary restrictions | **🎯 My Info** → Dining Preferences |
| My personal schedule    | **👤 My Itinerary**                 |
| Event schedule          | **📅 Schedule**                     |
| Latest changes          | **⚡ Updates**                      |
| Who can I contact       | **🎯 My Info** → Emergency Contact  |

---

## 🚀 Next Steps

1. **Explore each tab** to see all your information
2. **Mark updates as read** to clear notifications
3. **Print your itinerary** for the event
4. **Save hotel details** to your phone
5. **Share any changes** with event organizer

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Ready to Use ✅
