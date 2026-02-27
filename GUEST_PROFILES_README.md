# Guest Profiles & Preferences Management System

## Overview

This is a comprehensive Guest Profiles and Preferences Management system for the Group Travel application. It allows travel planners to collect, manage, and track guest preferences, dietary requirements, and special needs in real-time.

## Features

### 1. **Guest Information Collection**

- Full name, email, and phone number
- Room type preferences (Standard, Deluxe, Suite, Accessible)
- Specific room preferences (quiet room, high/ground floor)
- Dietary requirements (Vegetarian, Vegan, Gluten-Free, Halal, Kosher, etc.)
- Special needs and accessibility requirements
- Additional notes for special instructions

### 2. **Real-Time Guest Updates**

- Automatic alerts when guest preferences are added or updated
- Instant notifications for special needs and dietary requirements
- Planner alerts for booking changes
- Real-time guest list updates across all clients
- Alert dismissal and management

### 3. **Guest Analytics & Reporting**

- Dietary requirements summary
- Special needs and accessibility tracking
- Guest count and statistics
- CSV export functionality
- Comprehensive report generation

### 4. **Search and Filter**

- Search guests by name or email
- Filter by special needs requirement
- Sort by name, recent updates, or special needs priority

## File Structure

```
src/pages/Guests/
├── Guests.jsx                      # Main page component
├── Guests.css                      # Main page styles
├── GuestProfileForm.jsx            # Form for adding/editing guests
├── GuestProfile.css                # Form styles
├── GuestProfileCard.jsx            # Individual guest display card
├── GuestCard.css                   # Card styles
├── GuestStats.jsx                  # Analytics and statistics component
├── GuestStats.css                  # Stats styles
├── GuestAlerts.jsx                 # Real-time alerts component
├── GuestAlerts.css                 # Alerts styles
├── GuestPreferencesService.js      # LocalStorage-based service
└── GuestPreferencesAPI.js          # Optional backend API service
```

## Components

### GuestProfileForm

Comprehensive form for adding or editing guest profiles.

**Props:**

- `guest` (Object, optional): Guest data for editing
- `onSave` (Function): Callback when saving guest
- `onCancel` (Function): Callback when canceling edit

**Features:**

- Basic information input (name, email, phone)
- Room preference selection
- Dietary requirements checkboxes
- Special needs selection
- Additional notes textarea

### GuestProfileCard

Display card for individual guest information.

**Props:**

- `guest` (Object): Guest data to display
- `onEdit` (Function): Callback for edit button
- `onDelete` (Function): Callback for delete button

**Features:**

- Guest name and contact info
- Room preferences with tags
- Dietary requirements display
- Special needs highlights (with visual alerts)
- Last updated timestamp

### GuestAlerts

Real-time alerts component for planners.

**Props:**

- `alerts` (Array): Array of alerts to display
- `onDismiss` (Function): Callback when dismissing alert

**Alert Types:**

- `new_guest`: When a new guest is added
- `preference_update`: When guest preferences change
- `special_needs`: When guest has special requirements
- `dietary`: When dietary requirements are noted
- `booking_change`: When booking status changes

### GuestStats

Analytics and summary statistics.

**Props:**

- `guests` (Array): List of guests to analyze

**Displays:**

- Total guest count
- Dietary requirements breakdown
- Special needs and accessibility summary

## Services

### GuestPreferencesService (Default)

LocalStorage-based service for client-side guest data management. Perfect for development and small deployments.

**Methods:**

```javascript
// Get all guests
GuestPreferencesService.getAllGuests();

// Get single guest
GuestPreferencesService.getGuestById(guestId);

// Save guest (create or update)
GuestPreferencesService.saveGuest(guestData);

// Delete guest
GuestPreferencesService.deleteGuest(guestId);

// Get guests by dietary type
GuestPreferencesService.getGuestsByDietary(dietaryType);

// Get guests with special needs
GuestPreferencesService.getGuestsWithSpecialNeeds();

// Get dietary summary
GuestPreferencesService.getDietarySummary();

// Get special needs summary
GuestPreferencesService.getSpecialNeedsSummary();

// Create alert
GuestPreferencesService.createAlert(alertData);

// Get all alerts
GuestPreferencesService.getAllAlerts();

// Dismiss alert
GuestPreferencesService.dismissAlert(alertId);

// Clear all alerts
GuestPreferencesService.clearAllAlerts();

// Subscribe to updates (real-time)
GuestPreferencesService.subscribe(callback);

// Export as CSV
GuestPreferencesService.exportGuestsAsCSV();

// Generate report
GuestPreferencesService.generateGuestReport();
```

### GuestPreferencesAPI (Optional)

Backend API service for production deployments.

**Setup:**

1. Install and run the backend server
2. Update `src/pages/Guests/Guests.jsx`:

   ```javascript
   // Replace this import:
   import GuestPreferencesService from "./GuestPreferencesService";

   // With this:
   import GuestPreferencesAPI as GuestPreferencesService from "./GuestPreferencesAPI";
   ```

3. Set environment variable: `REACT_APP_API_URL=http://your-backend-url`

**Methods:** Same as GuestPreferencesService

## Backend API Endpoints

### Guest Endpoints

**GET /api/guests**
Get all guests

```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

**GET /api/guests/:id**
Get single guest

```json
{
  "success": true,
  "data": {...}
}
```

**POST /api/guests**
Create or update guest

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "roomPreference": "deluxe",
  "dietaryRequirements": ["Vegetarian"],
  "specialNeeds": ["Wheelchair Accessibility"],
  "mobilityAssistance": true,
  "wheelchairAccessible": true,
  "quietRoom": false,
  "highFloor": true,
  "groundFloor": false,
  "notes": "Needs accessible bathroom"
}
```

**DELETE /api/guests/:id**
Delete guest

### Alert Endpoints

**GET /api/alerts?limit=50**
Get all alerts

**DELETE /api/alerts/:id**
Dismiss specific alert

**DELETE /api/alerts**
Clear all alerts

### Analytics Endpoints

**GET /api/guests/analytics/dietary**
Get dietary requirements summary

**GET /api/guests/analytics/special-needs**
Get special needs summary

**GET /api/guests/report/summary**
Generate comprehensive guest report

## Data Structure

### Guest Object

```javascript
{
  id: 1234567890,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  roomPreference: "deluxe", // "standard" | "deluxe" | "suite" | "accessible"
  dietaryRequirements: ["Vegetarian", "Gluten-Free"],
  specialNeeds: ["Wheelchair Accessibility"],
  mobilityAssistance: true,
  wheelchairAccessible: true,
  quietRoom: true,
  highFloor: false,
  groundFloor: false,
  notes: "Prefer window seat",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

### Alert Object

```javascript
{
  id: 1234567890,
  type: "preference_update", // "new_guest" | "preference_update" | "special_needs" | "booking_change"
  title: "Guest Preference Updated",
  message: "John's preferences have been updated",
  guestName: "John Doe",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## Usage Examples

### Adding a New Guest

```javascript
const guestData = {
  id: Date.now(),
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+9876543210",
  roomPreference: "suite",
  dietaryRequirements: ["Vegan"],
  specialNeeds: [],
  mobilityAssistance: false,
  wheelchairAccessible: false,
  quietRoom: true,
  highFloor: true,
  groundFloor: false,
  notes: "Prefers room near elevator",
  updatedAt: new Date().toISOString(),
};

GuestPreferencesService.saveGuest(guestData);
```

### Subscribing to Real-Time Updates

```javascript
const unsubscribe = GuestPreferencesService.subscribe((alert) => {
  console.log("New alert:", alert);
  // Update UI with new alert
});

// Later, unsubscribe if needed
unsubscribe();
```

### Exporting Guest Data

```javascript
const csv = GuestPreferencesService.exportGuestsAsCSV();
// Download as CSV file
const element = document.createElement("a");
element.setAttribute(
  "href",
  "data:text/csv;charset=utf-8," + encodeURIComponent(csv),
);
element.setAttribute("download", "guests.csv");
element.click();
```

## Styling

All components use a consistent dark theme with gradient backgrounds. The styling includes:

- Glass-morphism effects
- Smooth transitions and animations
- Responsive design for mobile and desktop
- Accessibility-focused color contrasts
- Alert highlights for special needs

### Customizing Colors

Edit the CSS files to change:

- Primary gradient: `#667eea` to `#764ba2`
- Alert colors for special needs: `#ef4444`
- Success/dietary colors: `#34d399`

## Privacy & Security

### What Data is Collected

✅ Guest preferences (not sensitive)
✅ Dietary requirements
✅ Special needs and accessibility requirements
✅ Room preferences
✅ General contact info (email, phone)

### What Data is NOT Collected

❌ Social security numbers
❌ Credit card information
❌ Passport numbers
❌ Health records
❌ Sensitive medical information

Note: Keep health conditions as general categories (e.g., "Mobility Assistance" rather than specific diagnoses)

## Production Deployment

### Using Backend API

1. Replace `GuestPreferencesService` with `GuestPreferencesAPI`
2. Connect to a database (PostgreSQL, MongoDB, etc.)
3. Implement proper authentication
4. Add HTTPS and CORS security
5. Set up database backups

### Database Schema Example (SQL)

```sql
CREATE TABLE guests (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  room_preference VARCHAR(50),
  dietary_requirements JSONB,
  special_needs JSONB,
  mobility_assistance BOOLEAN,
  wheelchair_accessible BOOLEAN,
  quiet_room BOOLEAN,
  high_floor BOOLEAN,
  ground_floor BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id BIGINT PRIMARY KEY,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  guest_name VARCHAR(255),
  guest_id BIGINT REFERENCES guests(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Test Adding a Guest

1. Click "Add New Guest"
2. Fill in all fields
3. Click "Save Guest Profile"
4. Verify guest appears in list
5. Check alerts for confirmation

### Test Search and Filter

1. Add multiple guests with different needs
2. Search by name
3. Filter by special needs
4. Verify correct guests appear

### Test Export

1. Add at least one guest
2. Click "Export CSV"
3. Open downloaded file
4. Verify all data is included

## Troubleshooting

### Guests Not Appearing

- Check browser localStorage: Open DevTools → Application → LocalStorage
- Clear localStorage if corrupted: `localStorage.clear()`
- Refresh page: `Ctrl+R` or `Cmd+R`

### Alerts Not Showing

- Check if alerts have been manually cleared
- Verify subscription is active
- Check browser console for errors

### API Connection Issues

- Verify backend server is running on port 5001
- Check CORS settings on backend
- Verify `REACT_APP_API_URL` environment variable

## Future Enhancements

- [ ] WebSocket support for real-time multi-user updates
- [ ] Email notifications for planners
- [ ] SMS alerts for urgent updates
- [ ] Integration with hotel booking system
- [ ] Photo uploads for dietary restrictions
- [ ] Allergy severity levels
- [ ] Medical proxy information
- [ ] Group preference aggregation
- [ ] Meal planning assistance
- [ ] Room assignment automation

## Support

For issues or feature requests, please contact the development team.
