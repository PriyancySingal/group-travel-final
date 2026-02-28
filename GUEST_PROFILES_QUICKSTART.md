# Guest Profiles Management - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: No Setup Required!

The Guest Profiles feature works out of the box using **LocalStorage**. No database setup needed for development.

### Step 2: Access the Feature

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/guests` in your browser
3. You should see the Guest Profiles & Preferences page

### Step 3: Add Your First Guest

1. Click "➕ Add New Guest"
2. Fill in the form:
   - **Name** (required): e.g., "John Doe"
   - **Email**: john@example.com
   - **Phone**: +1234567890
   - **Room Preference**: Select desired room type
   - **Dietary Requirements**: Check all that apply
   - **Special Needs**: Check accessibility requirements
   - **Additional Notes**: Any special instructions
3. Click "Save Guest Profile"

### Step 4: See Real-Time Alerts

- New alerts appear in the "Real-Time Updates & Alerts" section
- Each alert shows what changed and when
- Click ✕ to dismiss individual alerts
- Click "Clear All" to dismiss all alerts

## 📊 Features You Can Try

### Search Guests

Type in the search box to find guests by name or email.

### Filter by Special Needs

Check "Show only Special Needs" to see guests with accessibility requirements.

### Sort Guests

Choose sorting order:

- By Name (A-Z)
- By Recent (newest first)
- By Special Needs (priority order)

### View Statistics

See at a glance:

- Total guests
- Dietary requirements breakdown
- Accessibility needs summary

### Export Data

Click "📥 Export CSV" to download guest list for sharing with hotel.

### Generate Report

Click "📊 Generate Report" to create comprehensive summary (check browser console).

## 🔌 Connecting to Backend (Optional)

### For Production Use

#### Step 1: Update Backend

The backend endpoints are already implemented. Make sure:

1. Backend server is running on `http://localhost:5001`
2. All API endpoints are working:
   ```bash
   curl http://localhost:5001/api/guests
   ```

#### Step 2: Switch to API Service (Optional)

Edit `src/pages/Guests/Guests.jsx`:

**Find this line:**

```javascript
import GuestPreferencesService from "./GuestPreferencesService";
```

**Replace with:**

```javascript
import GuestPreferencesAPI as GuestPreferencesService from "./GuestPreferencesAPI";
```

#### Step 3: Set Environment Variable

Create/update `.env` file in root:

```
REACT_APP_API_URL=http://localhost:5001
```

#### Step 4: Restart Development Server

```bash
npm run dev
```

The app will now use backend API instead of localStorage!

## 📋 Guest Data Privacy Checklist

✅ **Safe to Collect:**

- Name
- Email
- Phone number
- Room preferences (type, floor, quiet, etc.)
- Dietary requirements
- Accessibility needs (general categories)
- General notes

❌ **DO NOT Collect:**

- Social Security Number
- Medical records or specific diagnoses
- Passport number or ID
- Credit card information
- Health insurance details
- Specific allergy severities (keep general: "Nut-Free")

## 🎨 Customizing the Look

### Change Theme Colors

Edit `src/pages/Guests/Guests.css`, line 13-14:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Replace with your colors:

- Blue to Purple: `#667eea` to `#764ba2`
- Green to Blue: `#10b981` to `#3b82f6`
- Orange to Red: `#f59e0b` to `#ef4444`

### Change Alert Colors

Edit `src/pages/Guests/GuestAlerts.jsx`, search for `getAlertColor()`:

```javascript
case "special_needs":
  return "#ff6b6b"; // Change this color
```

## 🐛 Troubleshooting

### Issue: Guests not saving

**Solution:** Check browser console for errors. Make sure you entered a guest name (required field).

### Issue: Alerts disappear after refresh

**Solution:** This is normal with localStorage. Use backend API for persistent alerts.

### Issue: Forms not submitting

**Solution:**

1. Check all required fields are filled
2. Clear browser cache: Ctrl+Shift+Delete
3. Hard refresh: Ctrl+Shift+R

### Issue: Can't find guests page

**Solution:** Make sure you're on `/guests` route. Check that route is defined in `App.jsx`.

## 📱 Mobile Testing

The feature is fully responsive:

- Click "Add New Guest" button on mobile
- Form adapts to smaller screens
- Guest cards show one per column on mobile
- All controls are touch-friendly

## Example Guest Data

Here's a sample guest profile to test with:

```javascript
{
  id: 1704067200000,
  name: "Sarah Johnson",
  email: "sarah.j@email.com",
  phone: "+1-555-0123",
  roomPreference: "accessible",
  dietaryRequirements: ["Vegetarian", "Gluten-Free"],
  specialNeeds: ["Wheelchair Accessibility", "Visual Impairment Support"],
  mobilityAssistance: true,
  wheelchairAccessible: true,
  quietRoom: true,
  highFloor: false,
  groundFloor: true,
  notes: "Needs accessible bathroom with grab bars. Prefers room near entrance.",
  updatedAt: "2024-01-02T10:00:00.000Z"
}
```

## 🚢 Deployment Steps

### For Development (LocalStorage)

```bash
npm run build
npm run preview
```

### For Production (Backend API)

1. Deploy backend to your server
2. Update `REACT_APP_API_URL` to production URL
3. Set up database backups
4. Enable HTTPS
5. Configure CORS properly
6. Deploy frontend:
   ```bash
   npm run build
   # Deploy dist/ folder to hosting
   ```

## 📚 API Documentation

See `GUEST_PROFILES_README.md` for complete API documentation and data structures.

## 💡 Tips & Tricks

### Multiple Guests at Once?

You can add guests one by one, or prepare a CSV file and manually create them in bulk.

### Reset Everything?

Open browser DevTools → Application → LocalStorage → Clear Site Data

### Backup Guests?

Use "📥 Export CSV" to backup all guest data.

### Database Integration?

Replace localStorage with your database (PostgreSQL, MongoDB, Firebase, etc.) by modifying `GuestPreferencesService.js` methods.

## ❓ FAQ

**Q: Can guests update their own preferences?**
A: Currently designed for planners to manage. Can add guest portal in future.

**Q: Does it work offline?**
A: Yes! LocalStorage works completely offline. Backend API version requires connection.

**Q: How many guests can I add?**
A: Unlimited with backend. With localStorage, browser storage limit (~5-10MB) allows thousands of guest records.

**Q: Can I integrate with my hotel booking system?**
A: Yes! Modify the backend API to integrate with your hotel system.

**Q: Do alerts stay after page refresh?**
A: With LocalStorage: No (by design). With Backend API: Yes.

## 🎯 Next Steps

1. ✅ Try adding a guest
2. ✅ Test search and filter functionality
3. ✅ Export guest list as CSV
4. ✅ Connect to backend (optional)
5. ✅ Deploy to production

## 📞 Need Help?

Check the comprehensive guide: `GUEST_PROFILES_README.md`

---

**Happy planning! 🎉**
