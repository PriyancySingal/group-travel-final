import { useState, useEffect } from 'react';
import GuestEngagementService from '../../services/GuestEngagementService';
import GamificationService from '../../services/GamificationService';
import PersonalizationService from '../../services/PersonalizationService';
import './GuestEventApp.css';

// Import sub-components
import EventScheduleView from './EventScheduleView';
import GuestListView from './GuestListView';
import FeedbackPanel from './FeedbackPanel';
import NotificationCenter from './NotificationCenter';
import PollingWidget from './PollingWidget';
import QAPanel from './QAPanel';
import PersonalizedItinerary from './PersonalizedItinerary';
import ActivitySignUp from './ActivitySignUp';
import GamificationDashboard from './GamificationDashboard';
import SocialChallenges from './SocialChallenges';

const GuestEventApp = ({ eventData = {}, guestId = 'guest-1', guestName = 'Guest' }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize services on mount
  useEffect(() => {
    // Initialize gamification for guest
    GamificationService.initializeGuest(guestId, guestName);

    // Initialize personalization preferences
    PersonalizationService.initializePreferences(guestId, {
      interests: ['adventure', 'culture', 'networking'],
      activityLevel: 'high',
      socialPreference: 'mixed',
    });

    // Subscribe to engagement updates
    const unsubscribe = GuestEngagementService.subscribe(({ eventType, data }) => {
      if (eventType === 'notification:sent') {
        // Check if this notification is for this guest
        if (data.targetGuests.includes(guestId)) {
          setNotifications(prev => [data, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    // Load initial notifications
    const initialNotifs = GuestEngagementService.getNotifications(guestId, true);
    setNotifications(initialNotifs);
    setUnreadCount(initialNotifs.length);

    // Load engagement score
    const metrics = GamificationService.getGuestPoints(guestId);
    if (metrics) {
      setEngagementScore(metrics.totalPoints);
    }

    // Load achievements
    const badges = GamificationService.getGuestBadges(guestId);
    setAchievements(badges);

    return unsubscribe;
  }, [guestId, guestName]);

  /**
   * Handle notification read
   */
  const handleNotificationRead = (notificationId) => {
    GuestEngagementService.markNotificationRead(notificationId, guestId);
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  /**
   * Update engagement display
   */
  const refreshEngagementScore = () => {
    const metrics = GamificationService.getGuestPoints(guestId);
    if (metrics) {
      setEngagementScore(metrics.totalPoints);
    }
  };

  /**
   * Tab content renderer
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <EventScheduleView eventData={eventData} />;

      case 'guests':
        return <GuestListView guestId={guestId} />;

      case 'feedback':
        return <FeedbackPanel guestId={guestId} eventData={eventData} />;

      case 'polling':
        return <PollingWidget guestId={guestId} />;

      case 'qa':
        return <QAPanel guestId={guestId} guestName={guestName} />;

      case 'itinerary':
        return <PersonalizedItinerary guestId={guestId} eventData={eventData} />;

      case 'activities':
        return <ActivitySignUp guestId={guestId} eventData={eventData} />;

      case 'gamification':
        return (
          <GamificationDashboard
            guestId={guestId}
            onEngagementUpdate={refreshEngagementScore}
          />
        );

      case 'challenges':
        return <SocialChallenges guestId={guestId} eventData={eventData} />;

      default:
        return null;
    }
  };

  return (
    <div className="guest-event-app">
      {/* Header */}
      <header className="guest-app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>✨ Event Companion</h1>
            <p>{eventData.name || 'Event Management Platform'}</p>
          </div>

          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <div className="stat-label">Engagement</div>
                <div className="stat-value">{engagementScore}</div>
              </div>
            </div>

            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <div className="stat-info">
                <div className="stat-label">Achievements</div>
                <div className="stat-value">{achievements.length}</div>
              </div>
            </div>

            <div className="stat-item notification-stat">
              <button
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="notif-icon">🔔</span>
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          guestId={guestId}
          onRead={handleNotificationRead}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Navigation Tabs */}
      <nav className="guest-app-nav">
        <button
          className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button
          className={`nav-tab ${activeTab === 'guests' ? 'active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          👥 Guests
        </button>
        <button
          className={`nav-tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          🎯 Activities
        </button>
        <button
          className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          📝 My Itinerary
        </button>
        <button
          className={`nav-tab ${activeTab === 'polling' ? 'active' : ''}`}
          onClick={() => setActiveTab('polling')}
        >
          🗳️ Live Polls
        </button>
        <button
          className={`nav-tab ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          ❓ Q&A
        </button>
        <button
          className={`nav-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
        </button>
        <button
          className={`nav-tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          🎪 Challenges
        </button>
        <button
          className={`nav-tab ${activeTab === 'gamification' ? 'active' : ''}`}
          onClick={() => setActiveTab('gamification')}
        >
          🏅 Leaderboard
        </button>
      </nav>

      {/* Main Content */}
      <main className="guest-app-content">
        {renderTabContent()}
      </main>

      {/* Quick Stats Footer */}
      <footer className="guest-app-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="stat-icon">💪</span>
            <span>Stay Engaged - Complete challenges and earn achievements!</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestEventApp;
