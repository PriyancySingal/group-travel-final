import { useState } from 'react';
import GuestEngagementService from '../../services/GuestEngagementService';

const NotificationCenter = ({ notifications = [], guestId, onRead, onClose }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const handleNotificationClick = (notificationId) => {
    onRead(notificationId);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      event: '📅',
      activity: '🎯',
      poll: '🗳️',
      message: '💬',
      achievement: '🏆',
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      normal: '#3b82f6',
      low: '#6b7280',
    };
    return colors[priority] || '#3b82f6';
  };

  return (
    <div className="notification-center">
      <div className="notif-overlay" onClick={onClose} />
      
      <div className="notif-panel">
        <div className="notif-header">
          <h2>🔔 Notifications</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="notif-filters">
          {['all', 'event', 'activity', 'poll', 'achievement'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notif">
              <p>No notifications yet</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`notif-item ${notif.isRead.get(guestId) ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notif.id)}
                style={{ borderLeftColor: getPriorityColor(notif.priority) }}
              >
                <div className="notif-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notif-time">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
