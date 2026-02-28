# Event-Specific Inventory Management - Quick Start Guide

## 5-Minute Setup

### Step 1: Access Inventory Management

1. Go to any event page (e.g., `/event/wedding-2024`)
2. Click **"📦 Manage Inventory"** tab at the top
3. System auto-initializes with sample data on first visit

### Step 2: Add Your Resources

#### Add Rooms

```
1. Click "Add Room" button
2. Fill in:
   - Name: "Room 101"
   - Type: "Standard" | "Deluxe" | "Accessible"
   - Capacity: 2-4 people
   - Add special features (wheelchair, quiet, floor preference)
3. Click "Save"
```

#### Add Transport

```
1. Click "Add Transport" button
2. Fill in:
   - Name: "Coach Bus A"
   - Type: "Bus" | "Car" | "Coach"
   - Capacity: 20-60 people
3. Click "Save"
```

#### Add Dining Operations

```
1. Click "Add Dining" button
2. Fill in:
   - Name: "Breakfast Service"
   - Meal Type: "Breakfast" | "Lunch" | "Dinner"
   - Capacity: 50-500 people
   - Check dietary options to offer
3. Click "Save"
```

#### Add Activities

```
1. Click "Add Activity" button
2. Fill in:
   - Name: "Sightseeing Tour"
   - Capacity: 10-100 people
   - Location & timing info
3. Click "Save"
```

### Step 3: Monitor Availability

**Color-Coded Status:**

- 🟢 **Green** (0-69%): Plenty available
- 🟠 **Orange** (70-89%): Running low
- 🔴 **Red** (90-100%): Critical - almost full

**Actions:**

- Use **+** button to increase bookings
- Use **-** button to decrease bookings
- System prevents overbooking automatically

### Step 4: Get Smart Recommendations

**Prerequisites:**

- Must have guests added in `/guests` page first
- Guest profiles should include preferences

**Process:**

1. Click "Get Recommendations" button
2. Review AI-powered allocation suggestions
3. Allocations consider:
   - Wheelchair accessibility needs
   - Room type preferences
   - Dietary requirements
   - Activity capacity
4. Click "Apply Recommendations" to save

### Step 5: Track Alerts

**Available Capacity Alerts:**

- Display in "Real-Time Availability" section at top
- Shows critical (≥90%) and warning (≥70%) items
- Click on alert to scroll to resource

### Step 6: Export & Share

```
1. Click "Export as CSV"
2. File downloads automatically
3. Open in Excel/CSV reader
4. Share with team
```

## Common Tasks

### Quick Occupancy Check

1. Check **"Occupancy Rates"** cards
2. Visual bars show utilization percentage
3. Green = Available, Orange = Warning, Red = Critical

### Update Guest Assignments

1. Find resource in list
2. Click **+** to book, **-** to cancel
3. Changes reflect immediately in summary

### Delete Resource

1. Click **🗑️ (trash icon)** on resource card
2. Confirm deletion
3. Occupancy rates update automatically

### Add Dietary Options

- When adding dining: select vegetarian, vegan, gluten-free, etc.
- System matches against guest dietary requirements

### Assign Accessibility Rooms

1. Add rooms with wheelchair toggle enabled
2. Use recommendations to auto-assign
3. System prioritizes accessible rooms for guests with needs

## Tips & Tricks

✅ **Do This:**

- Add all resources before guest assignments
- Check occupancy daily for large events
- Use recommendations for faster allocation
- Export data periodically as backup
- Monitor alerts for capacity constraints

❌ **Avoid This:**

- Don't manually exceed capacity (system prevents it)
- Don't rely only on memory—export CSV for records
- Don't skip accessibility considerations
- Don't add resources after main assignments

## Sample Workflow

```
Day 1: Event Creation
├─ Initialize inventory
├─ Add 10 rooms (mix of types)
├─ Add 3 transport vehicles
├─ Add 4 meal services
└─ Add 6 activities

Day 2: Guest Registration
├─ Add guests with preferences
├─ Get recommendations
└─ Apply allocations

Day 3: Day-of Management
├─ Monitor real-time availability
├─ Handle last-minute changes
└─ Manage activity registrations

Day 4: Post-Event
├─ Export final occupancy report
└─ Archive CSV for records
```

## Data Persistence

✅ **Automatically Saved:**

- All room/transport/dining/activity changes
- All allocations and assignments
- Occupancy rates and utilization

⚠️ **Note:**

- Data stored in browser localStorage
- Will persist across page reloads
- Clear browser data will reset inventory
- Multiple browsers = separate data (not synced)

## Integration with Guest Profiles

1. **Guest Preferences** are used for smart recommendations
2. **Dietary Requirements** matched to dining options
3. **Accessibility Needs** prioritized in room assignment
4. **Room Preferences** considered in allocation suggestion

Ensure guests are profiled in `/guests` page for best results!

## FAQ

**Q: Can I edit a resource after creation?**
A: Currently supports quantity changes via +/- buttons. For full edits, delete and recreate.

**Q: What happens if I refresh the page?**
A: All data persists in localStorage—nothing is lost.

**Q: How many guests/resources can I add?**
A: Thousands! Limited only by browser storage (~5-10MB per site).

**Q: Can I undo changes?**
A: Not directly. Export CSV before major changes as backup.

**Q: Do recommendations update automatically?**
A: No. Click "Get Recommendations" to refresh suggestions.

**Q: Can I manage multiple events?**
A: Currently single event mode. Each event has separate inventory.

## Next Steps

1. ✅ Add all event resources
2. ✅ Add guest profiles with preferences
3. ✅ Run resource allocation recommendations
4. ✅ Monitor capacity and alerts
5. ✅ Export final report for team

## Support

For issues or suggestions:

- Check EVENT_INVENTORY_README.md for detailed documentation
- Review service code in EventInventoryService.js
- Check allocation logic in ResourceAllocationEngine.js

**Happy Planning! 🎉**
