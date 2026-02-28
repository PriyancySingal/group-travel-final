import { useState } from 'react';

const EventScheduleView = ({ eventData = {} }) => {
  const [expandedEvent, setExpandedEvent] = useState(null);

  // Sample event schedule
  const eventSchedule = eventData.schedule || [
    {
      id: 'e-1',
      time: '08:00 AM',
      title: 'Welcome & Breakfast',
      location: 'Main Hall',
      duration: '1.5 hours',
      description: 'Coffee, pastries, and meet everyone!',
      type: 'meal',
      attendees: 150,
    },
    {
      id: 'e-2',
      time: '09:30 AM',
      title: 'Opening Ceremony',
      location: 'Grand Ballroom',
      duration: '1 hour',
      description: 'Welcome speech and event objectives',
      type: 'event',
      attendees: 200,
    },
    {
      id: 'e-3',
      time: '10:45 AM',
      title: 'Networking Session',
      location: 'Courtyard',
      duration: '1 hour',
      description: 'Get to know fellow guests in a casual setting',
      type: 'activity',
      attendees: 180,
    },
    {
      id: 'e-4',
      time: '12:00 PM',
      title: 'Lunch',
      location: 'Dining Areas',
      duration: '1.5 hours',
      description: 'Multi-cuisine lunch with beverage options',
      type: 'meal',
      attendees: 200,
    },
    {
      id: 'e-5',
      time: '02:00 PM',
      title: 'Adventure Activities',
      location: 'Activity Zones',
      duration: '2 hours',
      description: 'Choose from hiking, water sports, or team games',
      type: 'activity',
      attendees: 150,
    },
  ];

  const getEventIcon = (type) => {
    const icons = {
      meal: '🍽️',
      event: '🎤',
      activity: '🎯',
    };
    return icons[type] || '📌';
  };

  const getEventColor = (type) => {
    const colors = {
      meal: '#f59e0b',
      event: '#8b5cf6',
      activity: '#3b82f6',
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="schedule-view">
      <div className="view-header">
        <h2>📅 Event Schedule</h2>
        <p>Check out all the exciting activities planned for you</p>
      </div>

      <div className="schedule-timeline">
        {eventSchedule.map((event, idx) => (
          <div key={event.id} className="timeline-item">
            <div
              className="timeline-dot"
              style={{ backgroundColor: getEventColor(event.type) }}
            />
            <div className="timeline-content">
              <div className="event-header">
                <div className="event-info">
                  <div className="event-time">{event.time}</div>
                  <h3 className="event-title">
                    {getEventIcon(event.type)} {event.title}
                  </h3>
                </div>
                <button
                  className="expand-btn"
                  onClick={() =>
                    setExpandedEvent(expandedEvent === event.id ? null : event.id)
                  }
                >
                  {expandedEvent === event.id ? '−' : '+'}
                </button>
              </div>

              {expandedEvent === event.id && (
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{event.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">⏱️ Duration:</span>
                    <span className="detail-value">{event.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">👥 Attendees:</span>
                    <span className="detail-value">{event.attendees} expected</span>
                  </div>
                  <div className="detail-description">{event.description}</div>
                  <button className="btn-add-to-itinerary">
                    ➕ Add to My Itinerary
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="schedule-footer">
        <p>💡 Tip: Click on any event to get more details and add it to your itinerary!</p>
      </div>
    </div>
  );
};

export default EventScheduleView;
