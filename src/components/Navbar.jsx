import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../services/AuthService";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(AuthService.getUser());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = AuthService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(10, 14, 39, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 40px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <h2
          onClick={() => navigate(isAdmin ? "/admin-dashboard" : "/")}
          style={{
            background: "linear-gradient(135deg, #38bdf8, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: "800",
            transition: "transform 0.3s ease",
            userSelect: "none"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ✈️ GroupTravel
        </h2>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {isAdmin ? (
            // Admin Navigation
            <>
              <NavBtn label="Guests" onClick={() => navigate("/guests")} />
              <NavBtn label="Event" onClick={() => navigate("/admin/events")} />
              <NavBtn label="Reports" onClick={() => navigate("/reports")} />
              <NavBtn label="Resources" onClick={() => navigate("/resource-allocation")} />
              <NavBtn label="AI Insights" onClick={() => navigate("/ai-insights")} />
            </>
          ) : (
            // Client Navigation
            <>
              <NavBtn label="Search Hotels" onClick={() => navigate("/results")} />
              <NavBtn label="Secure Access" onClick={() => navigate("/secure")} />
              <NavBtn label="AI Insights" onClick={() => navigate("/ai-insights")} />
              <button
                onClick={() => navigate("/gamification")}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "white",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.4)";
                }}
              >
                <span>🏆</span> Leaderboards
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate("/results")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg,#38bdf8,#2563eb)",
                  color: "white",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Create Group
              </button>
            </>
          )}

          {/* User Menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
              }}
            >
              👤 {user?.username}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  background: "rgba(2, 6, 23, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  minWidth: "180px",
                  overflow: "hidden",
                  zIndex: 1000,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
                    {user?.username}
                  </p>
                  <p style={{ margin: 0 }}>
                    Role: <strong>{user?.role || "User"}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate(isAdmin ? "/admin-dashboard" : "/");
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  📊 {isAdmin ? "Admin Dashboard" : "Home"}
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

/* Reusable Nav Button */
const NavBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      color: "white",
      border: "1px solid rgba(255,255,255,0.3)",
      padding: "8px 12px",
      borderRadius: "8px",
      background: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "rgba(255,255,255,0.1)";
      e.target.style.borderColor = "rgba(255,255,255,0.5)";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "transparent";
      e.target.style.borderColor = "rgba(255,255,255,0.3)";
    }}
  >
    {label}
  </button>
);

export default Navbar;
