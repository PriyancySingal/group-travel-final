import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

// Protected Route Component
// Redirects to login if not authenticated
// Can optionally check for specific role

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = AuthService.getUser();

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check if required
  if (requiredRole && user.role !== requiredRole) {
    // User is authenticated but doesn't have required role
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
