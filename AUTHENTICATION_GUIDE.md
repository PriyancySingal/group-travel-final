# Authentication & Role-Based Access Control System

## Overview

This document outlines the professional login and authentication system implemented for GroupTravel, separating admin and client functionalities.

---

## System Architecture

```
Login Page
    ↓
AuthService (validates credentials)
    ↓
Role Assignment (Admin/Client)
    ↓
ProtectedRoute
    ↓
Appropriate Dashboard
    ├─ Admin → Admin Dashboard → Management Tools
    └─ Client → Home → Booking Features
```

---

## Key Components

### 1. **AuthService.js** (`src/services/AuthService.js`)

Central authentication service managing user state, role assignment, and login validation.

**Methods:**

- `login(username, password)` - Authenticate user with API
- `logout()` - Clear user session
- `getUser()` - Get current user object
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Check if user has admin role
- `isClient()` - Check if user has client role
- `getToken()` - Get auth token for API calls
- `subscribe(callback)` - Listen to auth state changes
- `validateTestCredentials(username, password)` - Validate test login

**Features:**

- LocalStorage persistence
- Automatic role detection
- Session management
- Auth state observers for UI updates

### 2. **Login.jsx** (`src/pages/Login.jsx`)

Professional login page with multi-option access methods.

**Features:**

- Credential-based login (username/password)
- Demo login buttons (Admin/Client)
- Test credentials display
- Loading states
- Error messaging
- Password visibility toggle
- Responsive design
- Eye-catching branding

**Test Credentials:**

```
Username: hackathontest
Password: Hackathon@12345
Role: Admin
```

### 3. **ProtectedRoute.jsx** (`src/components/ProtectedRoute.jsx`)

Route protection component ensuring only authenticated users can access certain pages.

**Features:**

- Checks authentication status
- Optional role-based access control
- Redirects to login if not authenticated
- Redirects to home if insufficient permissions

**Usage:**

```jsx
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 4. **AdminDashboard.jsx** (`src/pages/AdminDashboard.jsx`)

Central hub for admin users with quick stats and tool navigation.

**Features:**

- Quick statistics display
- Admin tool menu
- Quick action buttons
- User logout
- Real-time user info

---

## Functionality Separation

### 🔐 ADMIN Functionalities

Admin users can access and manage:

1. **Guest Profiles Management** (`/guests`)
   - Add/edit guest profiles
   - Manage preferences (dietary, accessibility, room)
   - Track guest information
   - Export guest data

2. **Event Inventory Management** (`/event/:id`)
   - Rooms management (add, edit, delete)
   - Transport management
   - Dining options management
   - Activities management
   - Real-time availability tracking
   - Occupancy rate monitoring
   - AI-powered resource allocation suggestions

3. **Reports & Analytics** (`/reports`)
   - View detailed reports
   - Analytics and insights
   - Booking summaries
   - Resource utilization reports

4. **Resource Allocation** (`/resource-allocation`)
   - Plan resource allocations
   - View allocation suggestions
   - Apply AI recommendations
   - Conflict resolution

5. **Group Dashboard** (`/group-dashboard`)
   - Manage group bookings
   - Track group members
   - Organize bookings
   - Cost breakdowns

---

### 👤 CLIENT Functionalities

Client users can access:

1. **Home Page** (`/`)
   - View dashboard
   - Access booking options
   - Personal greeting

2. **Search & Browse Hotels** (`/results`)
   - Search hotels by location/date
   - Filter by amenities
   - Compare prices
   - View availability

3. **Hotel Details** (`/hotel/:id`)
   - View detailed hotel information
   - Check room types and prices
   - See amenities
   - Make reservations

4. **AI Insights** (`/ai-insights`)
   - Get personalized recommendations
   - View smart suggestions
   - Get trip insights

5. **Secure Landing** (`/secure`)
   - Access secure features
   - Manage bookings
   - View reservations

---

## Authentication Flow

### Login Flow

```
1. User visits /login
   ↓
2. Enters credentials (username/password)
   ↓
3. AuthService validates credentials
   ├─ Path 1: Test credentials (hackathontest)
   │   ↓
   │   Role detected as ADMIN
   │   ↓
   │   Redirect to /admin-dashboard
   │
   └─ Path 2: API validation
       ↓
       Check response role
       ↓
       Assign role (admin/client)
       ↓
       Redirect accordingly
```

### Session Persistence

```
User Login
   ↓
Save to localStorage
   ├─ username
   ├─ role
   ├─ token
   ├─ loginTime
   └─ id
   ↓
On page reload:
   ↓
AuthService loads from localStorage
   ↓
User remains logged in (session persists)
```

### Logout Flow

```
User clicks Sign Out
   ↓
AuthService.logout()
   ├─ Clear user object
   ├─ Remove localStorage data
   └─ Notify all listeners
   ↓
Navigate to /login
   ↓
Session ended
```

---

## API Integration

### Test API Details

**API URL:** https://api.tbotechnology.in/  
**Test Username:** hackathontest  
**Test Password:** Hackathon@12345

### Login Endpoint

```
POST /auth/login
{
  "username": "hackathontest",
  "password": "Hackathon@12345"
}

Response:
{
  "token": "jwt_token_here",
  "userId": "user_123",
  "role": "admin"
}
```

**Note:** Current implementation includes fallback to test credentials for demo purposes. In production, replace with actual API integration.

---

## File Structure

```
src/
├── services/
│   └── AuthService.js          # Authentication service
├── components/
│   ├── ProtectedRoute.jsx      # Route protection
│   └── Navbar.jsx              # Updated navbar with user menu
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Login.css               # Login styling
│   ├── AdminDashboard.jsx      # Admin hub
│   ├── AdminDashboard.css      # Admin styling
│   └── ... (other pages)
└── App.jsx                     # Updated with auth routes
```

---

## Usage Examples

### Checking Authentication Status

```javascript
import AuthService from "./services/AuthService";

// Check if user is logged in
const isLoggedIn = AuthService.isAuthenticated();

// Get current user
const user = AuthService.getUser();
console.log(user.username, user.role);

// Check role
if (AuthService.isAdmin()) {
  // Show admin features
}
```

### Using Protected Routes

```jsx
<Route
  path="/admin-only"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminComponent />
    </ProtectedRoute>
  }
/>
```

### Listening to Auth Changes

```javascript
const unsubscribe = AuthService.subscribe((user) => {
  if (user) {
    console.log("User logged in:", user.username);
  } else {
    console.log("User logged out");
  }
});

// Clean up
unsubscribe();
```

### Manual Login

```javascript
const result = await AuthService.login("hackathontest", "Hackathon@12345");

if (result.success) {
  console.log("Login successful!");
  navigate("/admin-dashboard");
} else {
  console.error("Login failed:", result.error);
}
```

---

## Security Features

### ✅ Implemented Security Measures

1. **Password Security**
   - Hidden password input field
   - Password visibility toggle
   - Test credentials shown in collapsible section only

2. **Session Management**
   - LocalStorage for persistent sessions
   - Token-based authentication ready
   - Automatic logout on sign out

3. **Route Protection**
   - Protected routes redirect to login
   - Role-based access control
   - Unauthorized access prevention

4. **Input Validation**
   - Required fields validation
   - Credential format checking
   - Error message display

5. **API Security**
   - HTTPS ready
   - Token support included
   - Secure credential handling

### 🔐 Recommendations for Production

1. **HTTPS Only**
   - Deploy on HTTPS
   - Remove test credentials
   - Use secure API endpoints

2. **Token Management**
   - Implement JWT tokens
   - Add token refresh logic
   - Secure token storage

3. **API Integration**
   - Replace demo credentials with real API
   - Implement proper error handling
   - Add rate limiting

4. **Logging & Monitoring**
   - Track login attempts
   - Monitor failed authentications
   - Log suspicious activities

---

## Troubleshooting

| Issue                       | Solution                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| Login page always shows     | User not authenticated. Try logging in with test credentials (hackathontest/Hackathon@12345) |
| "Invalid credentials" error | Ensure exact match: username=hackathontest, password=Hackathon@12345                         |
| Navbar not showing          | Only visible when authenticated. Must login first.                                           |
| Can't access admin pages    | Check user role. Only "admin" role can access /admin-dashboard and /guests                   |
| Can't access client pages   | Must be authenticated. Login to access home and hotel search pages                           |
| Session lost on refresh     | LocalStorage may be disabled. Check browser settings.                                        |

---

## Testing Scenarios

### Scenario 1: Admin Login

```
1. Go to /login
2. Enter: hackathontest / Hackathon@12345
3. Click "Sign In"
4. Redirected to /admin-dashboard
5. Can access: Guests, Event, Reports, Resources
6. Client pages accessible but not primary flow
```

### Scenario 2: Client Demo Login

```
1. Go to /login
2. Click "Client Demo" button
3. Redirected to home page
4. Can access: Hotel search, booking, insights
5. Cannot access: Guest management, inventory
6. Navbar shows client navigation
```

### Scenario 3: Logout

```
1. Logged in as any user
2. Click username in navbar
3. Click "Sign Out"
4. Redirected to /login
5. Session cleared
6. All protected routes require login
```

---

## Migration Checklist

- [x] Create AuthService for authentication
- [x] Create professional Login page
- [x] Create ProtectedRoute component
- [x] Create AdminDashboard
- [x] Update App.jsx with routes and protection
- [x] Update Navbar with role-aware navigation
- [x] Implement logout functionality
- [x] Add test credentials support
- [x] Create documentation
- [ ] For production: Connect real API endpoint
- [ ] For production: Remove test credentials
- [ ] For production: Implement JWT tokens
- [ ] For production: Add HTTPS requirement

---

## Quick Start

### For Testing:

1. **Navigate to login**: `/login`
2. **Use test credentials**:
   - Username: `hackathontest`
   - Password: `Hackathon@12345`
3. **You're logged in as Admin**
4. **Access admin tools** via navbar or Admin Dashboard

### For Client Testing:

1. **Navigate to login**: `/login`
2. **Click "Client Demo"** button
3. **You're logged in as Client**
4. **Browse hotels and create groups**

---

## API Endpoint Reference

### Ready for Implementation

When connecting to production API:

```javascript
POST /auth/login
- Body: { username, password }
- Response: { token, userId, role }

POST /auth/logout
- Body: { token }
- Response: { success }

GET /auth/profile
- Headers: { Authorization: Bearer token }
- Response: { user details }
```

---

## Support & Next Steps

1. **Test the system**: Use provided test credentials
2. **Review separation**: Check admin vs client functionalities
3. **Customize**: Modify admin/client routes as needed
4. **Deploy**: Replace test credentials with real API
5. **Document**: Update team on role-based access

---

**Version:** 1.0.0  
**Status:** Ready for Testing  
**Last Updated:** February 2026
