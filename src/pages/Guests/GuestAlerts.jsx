import { useState, useEffect } from "react";
import "./GuestAlerts.css";

const GuestAlerts = ({ alerts, onDismiss }) => {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  useEffect(() => {
    setVisibleAlerts(alerts);
  }, [alerts]);

  const handleDismiss = (alertId) => {
    setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
    onDismiss?.(alertId);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "preference_update":
        return "✏️";
      case "new_guest":
        return "👤";
      case "special_needs":
        return "⚠️";
      case "dietary":
        return "🍽️";
      case "booking_change":
        return "📅";
      default:
        return "ℹ️";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "special_needs":
        return "#ff6b6b";
      case "preference_update":
        return "#4ecdc4";
      case "new_guest":
        return "#45b7d1";
      default:
        return "#95a5a6";
    }
  };

  return (
    <div className="alerts-container">
      {visibleAlerts.length === 0 ? (
        <p className="no-alerts">No new alerts</p>
      ) : (
        visibleAlerts.map(alert => (
          <div
            key={alert.id}
            className="alert-item"
            style={{ borderLeftColor: getAlertColor(alert.type) }}
          >
            <div className="alert-header">
              <span className="alert-icon">{getAlertIcon(alert.type)}</span>
              <span className="alert-title">{alert.title}</span>
              <button
                className="alert-close"
                onClick={() => handleDismiss(alert.id)}
              >
                ✕
              </button>
            </div>
            <p className="alert-message">{alert.message}</p>
            {alert.guestName && (
              <p className="alert-guest">🧑 {alert.guestName}</p>
            )}
            <span className="alert-time">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GuestAlerts;
