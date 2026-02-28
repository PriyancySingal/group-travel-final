import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("hackathontest");
  const [password, setPassword] = useState("Hackathon@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getUser();
      navigate(user.role === "admin" ? "/admin-dashboard" : "/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate test credentials first (for demo)
      const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const result = await AuthService.login(username, password);

    if (result.success) {
      const { token, user } = result;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      navigate(user.role === "admin" ? "/admin-dashboard" : "/");
    } else {
      setError(result.error || "Login failed");
    }
  } catch (err) {
    setError("Login failed");
  } finally {
    setLoading(false);
  }
};


      // Try API login
      const result = await AuthService.login(username, password);

      if (result.success) {
        const user = result.user;
        navigate(user.role === "admin" ? "/admin-dashboard" : "/");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    // Demo login without actual API call
    AuthService.currentUser = {
      username: role === "admin" ? "admin_demo" : "client_demo",
      role: role,
      token: `token_${Date.now()}`,
      loginTime: new Date().toISOString(),
      id: `user_${Date.now()}`,
    };
    AuthService.saveToStorage();
    AuthService.notifyListeners();

    navigate(role === "admin" ? "/admin-dashboard" : "/");
  };

  return (
    <div className="login-container">
      {/* Left side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <h1 className="branding-title">GroupTravel</h1>
          <p className="branding-subtitle">Professional Group Travel Management</p>

          <div className="branding-features">
            <div className="feature-item">
              <span className="feature-icon">🏨</span>
              <span>Smart Hotel Group Bookings</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Manage Guests & Preferences</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <span>Track Resource Allocation</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Real-time Analytics & Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="demo-login-section">
            <p className="demo-text">Or try demo accounts:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn admin-demo"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
              >
                <span>🔐</span> Admin Demo
              </button>
              <button
                type="button"
                className="demo-btn client-demo"
                onClick={() => handleDemoLogin("client")}
                disabled={loading}
              >
                <span>👤</span> Client Demo
              </button>
            </div>
          </div>

          {/* Test Credentials Info */}
          <div className="test-credentials">
            <details>
              <summary>ℹ️ Test Credentials</summary>
              <div className="credentials-content">
                <p>
                  <strong>Username:</strong> hackathontest
                </p>
                <p>
                  <strong>Password:</strong> Hackathon@12345
                </p>
                <p className="note">
                  This account has admin privileges for testing the management
                  dashboard.
                </p>
              </div>
            </details>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>🔒 Your data is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
