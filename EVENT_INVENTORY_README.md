# Event-Specific Inventory Management System

## Overview

The Event-Specific Inventory Management system provides comprehensive resource management for group travel events. It tracks and manages rooms, transportation, dining options, and activities with real-time availability tracking and automated intelligent resource allocation based on guest preferences.

## Key Features

### 1. **Group-Specific Inventory**

- **Room Management**: Track hotel rooms by type, capacity, and accessibility features
- **Transport Management**: Manage vehicles, seat capacity, and availability
- **Dining Options**: Organize meal services with capacity tracking and dietary accommodations
- **Activity Management**: Manage event activities with participant capacity limits

### 2. **Real-Time Availability Tracking**

- Live occupancy rate calculations
- Visual availability indicators with color-coded status
- Automatic alerts when resources reach 70% (warning) or 90% (critical) capacity
- Prevention of overbooking through capacity validation

### 3. **Automated Resource Allocation**

- AI-driven suggestions using guest preference data
- Smart room assignment prioritizing accessibility needs
- Dietary requirement matching for dining options
- Activity recommendations based on capacity and guest interests
- Transport requirement calculations

### 4. **Advanced Analytics**

- Occupancy rate visualization
- Availability summaries across all resource types
- Resource utilization reports
- CSV export for spreadsheet analysis

## Architecture

### Service Layer

#### **EventInventoryService.js**

Central service for all inventory operations, handling CRUD operations and real-time availability management.

**Key Methods:**

```javascript
// Initialization
initializeEventInventory(eventId); // Setup new event inventory
getEventInventory(eventId); // Retrieve all inventory data
saveInventory(eventId, inventory); // Persist inventory changes

// Room Management
addRoom(eventId, room); // Create new room
getAvailableRooms(eventId); // Get rooms with availability
updateRoomAvailability(eventId, roomId, booked); // Update occupancy
deleteRoom(eventId, roomId); // Remove room

// Transport Management
addTransport(eventId, transport); // Create new vehicle
getAvailableTransport(eventId); // Get available transport
updateTransportAvailability(eventId, transportId, booked);
deleteTransport(eventId, transportId); // Remove transport

// Dining Management
addDiningOption(eventId, dining); // Create meal service
getAvailableDining(eventId); // Get available dining
updateDiningAvailability(eventId, diningId, booked);
deleteDiningOption(eventId, diningId); // Remove dining

// Activity Management
addActivity(eventId, activity); // Create activity
getAvailableActivities(eventId); // Get available activities
updateActivityAvailability(eventId, activityId, registered);
deleteActivity(eventId, activityId); // Remove activity

// Analytics
getInventorySummary(eventId); // All resource counts
getOccupancyRates(eventId); // Utilization percentages
getAvailabilityAlerts(eventId); // Critical/warning alerts
exportInventoryAsCSV(eventId); // CSV export
```

#### **ResourceAllocationEngine.js**

Intelligent allocation engine that provides smart resource suggestions based on guest preferences.

**Key Methods:**

```javascript
// Room Assignment
suggestRoomAssignments(eventId, guests); // Get all room suggestions
findBestRoom(guest, availableRooms); // Algorithm for single guest

// Dining Suggestions
suggestDiningOptions(eventId, guests); // Match dietary requirements

// Activity Recommendations
suggestActivities(eventId); // Available activities with capacity

// Transport Planning
suggestTransportOptions(eventId, guests); // Calculate transport needs

// Report Generation
getAllocationRecommendations(eventId); // Complete summary
generateAllocationReport(eventId); // Detailed report with analytics
applyAllocation(eventId, allocations); // Save allocation decisions
```

### Component Layer

#### **EventInventory.jsx**

Main management interface with tabbed navigation for different resource types.

**Features:**

- Tab-based interface (Rooms, Transport, Dining, Activities)
- Real-time availability alerts display
- Summary cards showing aggregate statistics
- Occupancy rate visualizations
- Automated recommendations panel
- Add/edit item modal forms
- CSV export functionality

#### **InventoryCard.jsx**

Reusable component for displaying individual inventory items.

**Features:**

- Availability bar with visual utilization
- +/- increment/decrement buttons
- Delete functionality
- Dietary/accessibility badges
- Automatic alert generation

### UI/UX

#### **Styling**

- Dark theme with gradient backgrounds
- Glass-morphism effect for cards
- Responsive grid layouts
- Color-coded alerts (red for critical, orange for warning, green for available)
- Mobile-optimized interface

## Data Structure

### Room Object

```javascript
{
  id: Number (timestamp),
  name: String,
  type: String ("Standard", "Deluxe", "Accessible"),
  capacity: Number,
  booked: Number,
  description: String,
  wheelchair: Boolean,
  roomPreference: String ("High Floor", "Ground Floor", "Any"),
  isDietaryRestricted: Boolean
}
```

### Transport Object

```javascript
{
  id: Number (timestamp),
  name: String,
  type: String ("Bus", "Car", "Coach"),
  capacity: Number,
  booked: Number,
  description: String
}
```

### Dining Object

```javascript
{
  id: Number (timestamp),
  name: String,
  type: String ("Breakfast", "Lunch", "Dinner"),
  capacity: Number,
  booked: Number,
  description: String,
  dietaryOptions: [String], // ["Vegetarian", "Vegan", etc.]
  mealType: String
}
```

### Activity Object

```javascript
{
  id: Number (timestamp),
  name: String,
  capacity: Number,
  registered: Number,
  description: String,
  timing: String,
  location: String
}
```

## Integration with Guest Profiles

The system integrates seamlessly with the **Guest Profiles and Preferences Management** system:

1. **Room Assignment**: Considers guest accessibility needs, room type preferences, and floor preferences
2. **Dining Suggestions**: Matches dietary requirements from guest profiles
3. **Activity Recommendations**: Filters based on registered participants
4. **Transport Planning**: Calculates vehicle needs based on guest count

This ensures that resource allocation respects and accommodates individual guest preferences collected during the guest profile setup phase.

## Usage Guide

### Adding Resources

1. Click "📦 Manage Inventory" tab in event page
2. Select resource type (Rooms, Transport, Dining, Activities)
3. Click "Add [Resource]" button
4. Fill in resource details
5. Click "Save" to create

### Managing Availability

1. View resource in inventory list
2. Click +/- buttons to adjust booked/registered count
3. System prevents exceeding capacity
4. Real-time updates reflected in summary cards

### Viewing Alerts

- Critical alerts (≥90% capacity) shown in red
- Warning alerts (≥70% capacity) shown in orange
- Click on alerts to see affected resources

### Getting Recommendations

1. Ensure guest profiles are populated with preferences
2. Click "Get Recommendations" in recommendations panel
3. Review suggested allocations
4. Click "Apply Recommendations" to save

### Exporting Data

1. Click "Export as CSV" button
2. File downloads with complete inventory snapshot
3. Use for spreadsheet analysis or sharing

## Occupancy Calculations

### Occupancy Rate Formula

```
Occupancy Rate = (Booked / Capacity) × 100%
```

### Alert Thresholds

- **Green**: 0-69% (Available)
- **Orange**: 70-89% (Warning)
- **Red**: 90-100% (Critical - Limited Availability)

## LocalStorage Structure

Inventory data stored under key: `event_inventory`

```javascript
{
  "wedding-2024": {
    rooms: [...],
    transport: [...],
    dining: [...],
    activities: [...],
    allocations: {...},
    lastUpdated: Timestamp
  }
}
```

## Best Practices

1. **Plan Ahead**: Add all resources before guest assignments
2. **Monitor Capacity**: Check alerts regularly for resource constraints
3. **Use Recommendations**: Leverage AI suggestions for optimal allocation
4. **Export Reports**: Generate CSVs for team sharing and analysis
5. **Update Real-Time**: Keep availability counts current as assignments change
6. **Accessibility First**: Ensure enough accessible rooms for guests with needs
7. **Backup**: Export data before major modifications

## Limitations & Future Enhancements

### Current Limitations

- LocalStorage-based (no cloud sync)
- Single event per session
- No multi-user conflict detection

### Planned Features

- Backend API integration for persistence
- Multi-user real-time collaboration
- Advanced analytics dashboard
- Waitlist management
- Resource overbooking prevention with alerts
- Dynamic pricing based on availability
- Automated allocation notifications

## Troubleshooting

| Issue                  | Solution                                 |
| ---------------------- | ---------------------------------------- |
| Allocations not saving | Check browser localStorage quota         |
| Recommendations empty  | Ensure guests are added with preferences |
| Capacity exceeded      | Use +/- buttons to adjust counts         |
| Data lost on refresh   | Allocations auto-save to localStorage    |

## File Structure

```
src/pages/Event/
├── EventInventory.jsx           # Main management interface
├── EventInventory.css           # Main page styling
├── EventInventoryService.js     # Data & CRUD operations
├── ResourceAllocationEngine.js  # Allocation suggestions
├── InventoryCard.jsx            # Inventory item component
├── InventoryCard.css            # Card styling
└── EventMicrosite.jsx           # Event page (integrated)
```

## Version History

- **v1.0.0** (Current)
  - Event-specific inventory management
  - Real-time availability tracking
  - Automated resource allocation
  - CSV export
  - Guest preference integration
