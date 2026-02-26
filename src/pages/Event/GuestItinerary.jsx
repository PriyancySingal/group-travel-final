// import React from "react";
import "./GuestItinerary.css";

const GuestItinerary = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="guest-itinerary">
        <h2>👤 Your Personal Itinerary</h2>
        <p>No personalized itinerary available</p>
      </div>
    );
  }

  return (
    <div className="guest-itinerary">
      <h2>👤 Your Personal Itinerary</h2>
      <div className="itinerary-timeline">
        {itinerary.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              {index < itinerary.length - 1 && (
                <div className="marker-line"></div>
              )}
            </div>
            <div className="timeline-content">
              <h4 className="timeline-title">
                <span className="day-label">Day {item.day}</span>
              </h4>
              <p className="timeline-activity">{item.title}</p>
              {item.note && <p className="timeline-notes">📝 {item.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Print Option */}
      <button
        className="print-button"
        onClick={() => window.print()}
        title="Print your itinerary"
      >
        🖨️ Print Itinerary
      </button>
    </div>
  );
};

export default GuestItinerary;