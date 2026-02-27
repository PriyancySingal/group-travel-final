import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthService from "./services/AuthService";
import AdminEvents from "./pages/Admin/AdminEvents";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Results from "./pages/Results";
import HotelDetails from "./pages/HotelDetails";
import GroupDashboard from "./pages/GroupDashboard";
import Reports from "./pages/Reports";
import SecureLanding from "./pages/SecureLanding";
import EventMicrosite from "./pages/Event/EventMicrosite";
import GuestEventApp from "./pages/Event/GuestEventApp";
import AIInsights from "./pages/AIInsights/AIInsights.jsx";
import Guests from "./pages/Guests/Guests.jsx";
import ResourceAllocation from "./pages/ResourceAllocation/ResourceAllocation.jsx";
import HotelSearchPage from "./pages/HotelSearchPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isAuthenticated()
  );
  const [userRole, setUserRole] = useState(AuthService.getUser()?.role || null);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = AuthService.subscribe((user) => {
      setIsAuthenticated(user !== null);
      setUserRole(user?.role || null);
    });

    return unsubscribe;
  }, []);

  // Show navbar only when authenticated
  return (
    <>
      {isAuthenticated && <Navbar />}

      <div style={isAuthenticated ? { marginTop: "80px" } : {}}>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/admin/events"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminEvents />
    </ProtectedRoute>
  }
/>
          <Route
            path="/guests"
            element={
              <ProtectedRoute requiredRole="admin">
                <Guests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EventMicrosite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resource-allocation"
            element={
              <ProtectedRoute requiredRole="admin">
                <ResourceAllocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group-dashboard"
            element={
              <ProtectedRoute>
                <GroupDashboard />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel-search"
            element={
              <ProtectedRoute>
                <HotelSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamification"
            element={
              <ProtectedRoute>
                <GuestEventApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/:id"
            element={
              <ProtectedRoute>
                <HotelDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secure"
            element={
              <ProtectedRoute>
                <SecureLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-insights"
            element={
              <ProtectedRoute>
                <AIInsights />
              </ProtectedRoute>
            }
          />

          {/* Redirect to login if no route matches and not authenticated */}
          <Route
            path="*"
            element={
              isAuthenticated ? <Home /> : <Login />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
