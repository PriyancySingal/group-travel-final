import React, { useState, useEffect } from "react";
import "./EventUpdatesPanel.css";

const EventUpdatesPanel = ({ eventId, updates = [], onUpdateRead }) => {
  const [localUpdates, setLocalUpdates] = useState(updates);
  const [unreadCount, setUnreadCount] = useState(updates.filter(u => !u.read).length);

  useEffect(() => {
    setLocalUpdates(updates);
    setUnreadCount(updates.filter(u => !u.read).length);
  }, [updates]);

  const handleMarkAsRead = (updateId) => {
    setLocalUpdates(prev =>
      prev.map(u => (u.id === updateId ? { ...u, read: true } : u))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    onUpdateRead?.(updateId);
  };

  const handleMarkAllAsRead = () => {
    setLocalUpdates(prev => prev.map(u => ({ ...u, read: true })));
    setUnreadCount(0);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return "#4caf50";
      case "warning":
        return "#ff9800";
      case "error":
        return "#f44336";
      case "info":
      default:
        return "#2196f3";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="event-updates-panel">
      <div className="updates-header">
        <h2>⚡ Real-Time Updates</h2>
        {unreadCount > 0 && (
          <div className="unread-badge">
            <span className="badge-number">{unreadCount}</span>
          </div>
        )}
      </div>

      {localUpdates.length === 0 ? (
        <div className="no-updates">
          <p>No updates yet</p>
          <p className="subtitle">You'll see event updates here as they happen</p>
        </div>
      ) : (
        <>
          {unreadCount > 0 && (
            <button className="mark-all-button" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}

          <div className="updates-list">
            {localUpdates.map((update) => (
              <div
                key={update.id}
                className={`update-item ${update.read ? "read" : "unread"}`}
              >
                <div
                  className="update-icon"
                  style={{ color: getSeverityColor(update.severity) }}
                >
                  {getSeverityIcon(update.severity)}
                </div>

                <div className="update-content">
                  <div className="update-header">
                    <span className="update-type">{update.type}</span>
                    <span className="update-time">{formatTime(update.timestamp)}</span>
                  </div>
                  <p className="update-message">{update.message}</p>
                </div>

                {!update.read && (
                  <button
                    className="read-button"
                    onClick={() => handleMarkAsRead(update.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventUpdatesPanel;
