import React, { useState } from "react";
import "./EventSchedule.css";

const EventSchedule = ({ eventId, schedule }) => {
  const [expandedDay, setExpandedDay] = useState(0);

  if (!schedule || schedule.length === 0) {
    return (
      <div className="event-schedule">
        <h2>📅 Event Schedule</h2>
        <p>No schedule data available</p>
      </div>
    );
  }

  return (
    <div className="event-schedule">
      <h2>📅 Event Schedule</h2>
      <div className="schedule-container">
        {schedule.map((day, index) => (
          //<div key={day.id} className="schedule-day">
          <div key={`${eventId}-${day.day}`} className="schedule-day">
            <button
              className={`day-header ${expandedDay === index ? "expanded" : ""}`}
              onClick={() => setExpandedDay(expandedDay === index ? -1 : index)}
            >
              <div className="day-info">
                <span className="day-number">Day {day.day}</span>
                <span className="day-title">{day.title}</span>
                <span className="day-date">📅 {day.date}</span>
              </div>
              <span className="toggle-icon">{expandedDay === index ? "▼" : "▶"}</span>
            </button>

            {expandedDay === index && (
              <div className="day-activities">
                {day.activities.map((activity, actIndex) => (
                  //<div key={actIndex} className="activity-item">
                  <div key={`${activity.time}-${activity.name}`} className="activity-item">
                    <div className="activity-time">
                      <span className="time-badge">🕐 {activity.time}</span>
                    </div>
                    <div className="activity-details">
                      <h4>{activity.name}</h4>
                      <p>📍 {activity.location}</p>
                      {activity.dietary && (
                        <span className="tag dietary-tag">🍽️ Dietary Preferences Apply</span>
                      )}
                      {activity.formal && (
                        <span className="tag formal-tag">👔 Formal Attire</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="schedule-legend">
        <div className="legend-item">
          <span className="tag dietary-tag">🍽️ Dietary Preferences Apply</span>
        </div>
        <div className="legend-item">
          <span className="tag formal-tag">👔 Formal Attire Required</span>
        </div>
      </div>
    </div>
  );
};

export default EventSchedule;
