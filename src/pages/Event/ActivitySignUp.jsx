import { useState, useEffect } from 'react';
import PersonalizationService from '../../services/PersonalizationService';
import GuestEngagementService from '../../services/GuestEngagementService';

const ActivitySignUp = ({ guestId, eventData = {} }) => {
  const [activities, setActivities] = useState([]);
  const [mySignups, setMySignups] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [signupData, setSignupData] = useState({ groupSize: 1, notes: '' });

  useEffect(() => {
    loadActivities();
    loadMySignups();
  }, [guestId]);

  const loadActivities = () => {
    // Sample activities data
    const sampleActivities = [
      {
        id: 'act-1',
        name: 'Mountain Hiking',
        category: 'adventure',
        level: 'high',
        duration: '3 hours',
        maxParticipants: 20,
        currentParticipants: 12,
        description: 'Explore scenic mountain trails',
        tags: ['outdoor', 'adventure', 'fitness'],
      },
      {
        id: 'act-2',
        name: 'Culinary Workshop',
        category: 'experience',
        level: 'low',
        duration: '2 hours',
        maxParticipants: 15,
        currentParticipants: 8,
        description: 'Learn to cook local cuisine',
        tags: ['food', 'culture', 'learning'],
      },
      {
        id: 'act-3',
        name: 'Networking Mixer',
        category: 'social',
        level: 'low',
        duration: '1.5 hours',
        maxParticipants: 50,
        currentParticipants: 25,
        description: 'Connect with fellow guests in a relaxed setting',
        tags: ['networking', 'social', 'fun'],
      },
      {
        id: 'act-4',
        name: 'Water Sports',
        category: 'adventure',
        level: 'high',
        duration: '2 hours',
        maxParticipants: 12,
        currentParticipants: 10,
        description: 'Kayaking and paddleboarding',
        tags: ['water', 'adventure', 'fitness'],
      },
    ];
    setActivities(sampleActivities);
  };

  const loadMySignups = () => {
    const signups = PersonalizationService.getGuestSignups(guestId);
    setMySignups(signups);
  };

  const handleSignUp = (activity) => {
    PersonalizationService.signUpForActivity(guestId, activity.id, signupData);
    GuestEngagementService.updateEngagementMetrics(guestId, 'signed-up-activity');

    setMySignups([...mySignups]);
    setSelectedActivity(null);
    setSignupData({ groupSize: 1, notes: '' });
    
    // Send confirmation notification
    GuestEngagementService.sendNotification({
      guestId,
      type: 'activity',
      title: '✓ Signup Confirmed',
      message: `You've successfully signed up for ${activity.name}`,
      icon: '✅',
    });
  };

  const isSignedUp = (activityId) => {
    return mySignups.some(
      s => s.activityId === activityId && s.status !== 'cancelled'
    );
  };

  return (
    <div className="activity-signup">
      <div className="view-header">
        <h2>🎯 Activities & Sign-ups</h2>
        <p>Choose activities that match your interests</p>
      </div>

      {/* My Signups */}
      {mySignups.length > 0 && (
        <div className="my-signups">
          <h3>My Activities ({mySignups.length})</h3>
          <div className="signups-grid">
            {mySignups.map(signup => (
              <div key={signup.id} className="signup-card">
                <div className="signup-status">✓ Confirmed</div>
                <h4>Activity {signup.activityId}</h4>
                <div className="signup-info">
                  <span>👥 Group: {signup.groupSize}</span>
                  <span>📝 {signup.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Activities */}
      <div className="activities-list">
        <h3>Available Activities</h3>
        <div className="activities-grid">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <h4>{activity.name}</h4>
                {isSignedUp(activity.id) && (
                  <span className="signed-up-badge">✓ Signed Up</span>
                )}
              </div>

              <div className="activity-meta">
                <span className="category">{activity.category}</span>
                <span className="level">
                  {activity.level === 'high' ? '💪' : activity.level === 'medium' ? '💪💪' : '👤'}{' '}
                  {activity.level}
                </span>
              </div>

              <p className="activity-description">{activity.description}</p>

              <div className="activity-details">
                <div className="detail">
                  <span className="label">⏱️ Duration:</span>
                  <span className="value">{activity.duration}</span>
                </div>
                <div className="detail">
                  <span className="label">👥 Participants:</span>
                  <span className="value">
                    {activity.currentParticipants}/{activity.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="activity-tags">
                {activity.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              {!isSignedUp(activity.id) && (
                <button
                  className="btn-signup"
                  onClick={() => setSelectedActivity(activity)}
                >
                  Sign Up
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Signup Modal */}
      {selectedActivity && (
        <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Sign Up for {selectedActivity.name}</h3>

            <div className="form-group">
              <label>Group Size</label>
              <input
                type="number"
                min="1"
                max="5"
                value={signupData.groupSize}
                onChange={e =>
                  setSignupData({ ...signupData, groupSize: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Special Requests / Notes</label>
              <textarea
                value={signupData.notes}
                onChange={e => setSignupData({ ...signupData, notes: e.target.value })}
                placeholder="Any dietary restrictions or special needs?"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-confirm"
                onClick={() => handleSignUp(selectedActivity)}
              >
                Confirm Sign Up
              </button>
              <button
                className="btn-cancel"
                onClick={() => setSelectedActivity(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySignUp;
