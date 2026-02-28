import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import EventManagementPanel from "./Admin/EventManagementPanel";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(AuthService.getUser());
  const [stats, setStats] = useState({
    totalGuests: 248,
    activeEvents: 12,
    upcomingBookings: 34,
    inventoryUtilization: 87,
  });

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = AuthService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const adminMenuItems = [
    {
      icon: "👥",
      title: "Guest Management",
      description: "Manage guest profiles and preferences",
      action: () => navigate("/guests"),
      color: "#3b82f6",
    },
    {
      icon: "📦",
      title: "Event Inventory",
      description: "Manage rooms, transport, dining & activities",
      //action: () => navigate("/event/1"),
      action:() => navigate("/admin/events"),
      color: "#8b5cf6",
    },
    {
      icon: "📊",
      title: "Reports & Analytics",
      description: "View detailed analytics and reports",
      action: () => navigate("/reports"),
      color: "#ec4899",
    },
    {
      icon: "🎯",
      title: "Resource Allocation",
      description: "Plan and allocate resources efficiently",
      action: () => navigate("/resource-allocation"),
      color: "#f59e0b",
    },
    {
      icon: "💡",
      title: "AI Insights",
      description: "Get AI-powered recommendations",
      action: () => navigate("/ai-insights"),
      color: "#10b981",
    },
    {
      icon: "📈",
      title: "Group Dashboard",
      description: "Monitor group bookings & management",
      action: () => navigate("/group-dashboard"),
      color: "#06b6d4",
    },
  ];

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.username}! 👋</p>
          </div>
          <div className="header-right">
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-section">
        <h2>Quick Stats</h2>
        <div className="stats-grid">
          <StatCard
            label="Total Guests"
            value={stats.totalGuests}
            icon="👥"
            color="#3b82f6"
          />
          <StatCard
            label="Active Events"
            value={stats.activeEvents}
            icon="🎫"
            color="#8b5cf6"
          />
          <StatCard
            label="Upcoming Bookings"
            value={stats.upcomingBookings}
            icon="📅"
            color="#ec4899"
          />
          <StatCard
            label="Inventory Utilization"
            value={`${stats.inventoryUtilization}%`}
            icon="📦"
            color="#f59e0b"
          />
        </div>
      </section>

      {/* Admin Functions */}
      <section className="admin-functions">
        <h2>Admin Tools & Functions</h2>
        <div className="menu-grid">
          {adminMenuItems.map((item, index) => (
            <div
              key={index}
              className="menu-card"
              onClick={item.action}
              style={{ borderLeftColor: item.color }}
            >
              <div className="card-icon" style={{ backgroundColor: `${item.color}20` }}>
                <span>{item.icon}</span>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate("/guests")}>
            <span>➕</span> Add New Guest
          </button>
          <button className="action-btn" onClick={() => navigate("/admin/events")}>
            <span>🏢</span> View Event Details
          </button>
          <button className="action-btn" onClick={() => navigate("/reports")}>
            <span>📥</span> Generate Report
          </button>
          <button className="action-btn" onClick={() => navigate("/ai-insights")}>
            <span>✨</span> View Insights
          </button>
        </div>
      </section>

      {/* Event Management Panel */}
      <section className="event-management-section">
        <EventManagementPanel />
      </section>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color }) => (
  <div className="stat-card" style={{ borderColor: color }}>
    <div className="stat-icon" style={{ color }}>
      {icon}
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default AdminDashboard;
