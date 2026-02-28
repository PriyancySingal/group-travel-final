import React, { useState } from "react";
import "./GuestPersonalization.css";

const GuestPersonalization = ({ guestInfo }) => {
  const [expandedSection, setExpandedSection] = useState("accommodation");

  if (!guestInfo) {
    return (
      <div className="guest-personalization">
        <h2>🎯 Your Personalized Information</h2>
        <p>No personalized information available</p>
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="guest-personalization">
      <h2>🎯 Your Personalized Information</h2>

      {/* Accommodation Section */}
      <div className="info-section">
        <button
          className={`section-header ${expandedSection === "accommodation" ? "expanded" : ""}`}
          onClick={() => toggleSection("accommodation")}
        >
          <div className="section-icon">🏨</div>
          <div className="section-title">Hotel Assignment</div>
          <div className="section-toggle">{expandedSection === "accommodation" ? "▼" : "▶"}</div>
        </button>
        {/* {expandedSection === "accommodation" && guestInfo.hotelAssignment && (
          <div className="section-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Hotel</label>
                <p>{guestInfo.hotelAssignment.hotel}</p>
              </div>
              <div className="info-item">
                <label>Room Number</label>
                <p>{guestInfo.hotelAssignment.roomNumber}</p>
              </div>
              <div className="info-item">
                <label>Room Type</label>
                <p>{guestInfo.hotelAssignment.roomType}</p>
              </div>
              <div className="info-item">
                <label>Floor</label>
                <p>Floor {guestInfo.hotelAssignment.floor}</p>
              </div>
              <div className="info-item">
                <label>Check-in</label>
                <p>{new Date(guestInfo.hotelAssignment.checkIn).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Check-out</label>
                <p>{new Date(guestInfo.hotelAssignment.checkOut).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )} */}
        {expandedSection === "accommodation" && (
  <div className="section-content">
    <div className="info-grid">
      <div className="info-item">
        <label>Hotel</label>
        <p>{guestInfo.hotelAssignment?.hotel || "No assignment"}</p>
      </div>
      <div className="info-item">
        <label>Room Number</label>
        <p>{guestInfo.hotelAssignment?.roomNumber || "N/A"}</p>
      </div>
      <div className="info-item">
        <label>Room Type</label>
        <p>{guestInfo.hotelAssignment?.roomType || "N/A"}</p>
      </div>
      <div className="info-item">
        <label>Floor</label>
        <p>{guestInfo.hotelAssignment?.floor ? `Floor ${guestInfo.hotelAssignment.floor}` : "N/A"}</p>
      </div>
      <div className="info-item">
        <label>Check-in</label>
        <p>{guestInfo.hotelAssignment?.checkIn ? new Date(guestInfo.hotelAssignment.checkIn).toLocaleString() : "N/A"}</p>
      </div>
      <div className="info-item">
        <label>Check-out</label>
        <p>{guestInfo.hotelAssignment?.checkOut ? new Date(guestInfo.hotelAssignment.checkOut).toLocaleString() : "N/A"}</p>
      </div>
    </div>
  </div>
)}
      </div>

      {/* Dining Preferences Section */}
      <div className="info-section">
        <button
          className={`section-header ${expandedSection === "dining" ? "expanded" : ""}`}
          onClick={() => toggleSection("dining")}
        >
          <div className="section-icon">🍽️</div>
          <div className="section-title">Dining Preferences</div>
          <div className="section-toggle">{expandedSection === "dining" ? "▼" : "▶"}</div>
        </button>
        {/* {expandedSection === "dining" && (
          <div className="section-content">
            <div className="preferences-list">
              <div className="pref-category">
                <h4>Dietary Restrictions</h4>
                <div className="pref-tags">
                  {guestInfo.dietaryRestrictions && guestInfo.dietaryRestrictions.length > 0 ? (
                    guestInfo.dietaryRestrictions.map((diet, idx) => (
                      <span key={idx} className="pref-tag dietary">
                        {diet}
                      </span>
                    ))
                  ) : (
                    <span className="pref-tag">No restrictions</span>
                  )}
                </div>
              </div>

              <div className="pref-category">
                <h4>Dining Preferences</h4>
                <div className="pref-tags">
                  {guestInfo.diningPreferences && guestInfo.diningPreferences.length > 0 ? (
                    guestInfo.diningPreferences.map((pref, idx) => (
                      <span key={idx} className="pref-tag preference">
                        {pref}
                      </span>
                    ))
                  ) : (
                    <span className="pref-tag">No specific preferences</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}
        {expandedSection === "dining" && (
  <div className="section-content">
    <div className="preferences-list">
      <div className="pref-category">
        <h4>Dietary Restrictions</h4>
        <div className="pref-tags">
          {guestInfo.dietaryRestrictions?.length > 0
            ? guestInfo.dietaryRestrictions.map((diet, idx) => (
                <span key={idx} className="pref-tag dietary">{diet}</span>
              ))
            : <span className="pref-tag">No restrictions</span>
          }
        </div>
      </div>

      <div className="pref-category">
        <h4>Dining Preferences</h4>
        <div className="pref-tags">
          {guestInfo.diningPreferences?.length > 0
            ? guestInfo.diningPreferences.map((pref, idx) => (
                <span key={idx} className="pref-tag preference">{pref}</span>
              ))
            : <span className="pref-tag">No specific preferences</span>
          }
        </div>
      </div>
    </div>
  </div>
)}
      </div>

      {/* Special Requests Section */}
      <div className="info-section">
        <button
          className={`section-header ${expandedSection === "special" ? "expanded" : ""}`}
          onClick={() => toggleSection("special")}
        >
          <div className="section-icon">⭐</div>
          <div className="section-title">Special Requests & Accessibility</div>
          <div className="section-toggle">{expandedSection === "special" ? "▼" : "▶"}</div>
        </button>
        {expandedSection === "special" && (
          <div className="section-content">
            <div className="special-requests">
              {/* {guestInfo.specialRequests && (
                <div className="request-item">
                  <h4>Special Requests</h4>
                  <p>{guestInfo.specialRequests}</p>
                </div>
              )}

              {guestInfo.accessibility && (
                <div className="request-item">
                  <h4>Accessibility Needs</h4>
                  <p>{guestInfo.accessibility}</p>
                </div>
              )}

              {guestInfo.transportationNeeds && (
                <div className="request-item">
                  <h4>Transportation</h4>
                  <p>{guestInfo.transportationNeeds}</p>
                </div>
              )} */}

              {/* {!guestInfo.specialRequests && !guestInfo.accessibility && !guestInfo.transportationNeeds && (
                <p className="no-special">No special requests or accessibility needs recorded</p>
              )} */}
              {guestInfo.specialRequests && Object.keys(guestInfo.specialRequests).map((key) => {
  const value = guestInfo.specialRequests[key];
  // Only render if value exists
  if (Array.isArray(value) && value.length > 0) {
    return (
      <div key={key} className="request-item">
        <h4>
          {key === "requests" ? "Special Requests" :
           key === "accessibility" ? "Accessibility Needs" :
           key === "transportation" ? "Transportation" :
           key.charAt(0).toUpperCase() + key.slice(1)} {/* fallback for extra keys */}
        </h4>
        <p>{value.join(", ")}</p>
      </div>
    );
  }
  return null;
})}

{(!guestInfo.specialRequests ||
  Object.values(guestInfo.specialRequests).every(
    v => !v || (Array.isArray(v) && v.length === 0)
  )) && (
  <p className="no-special">No special requests or accessibility needs recorded</p>
)}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact Section */}
      <div className="info-section">
        <button
          className={`section-header ${expandedSection === "emergency" ? "expanded" : ""}`}
          onClick={() => toggleSection("emergency")}
        >
          <div className="section-icon">📞</div>
          <div className="section-title">Emergency Contact</div>
          <div className="section-toggle">{expandedSection === "emergency" ? "▼" : "▶"}</div>
        </button>
        {expandedSection === "emergency" && (
          <div className="section-content">
            <div className="emergency-info">
              {/* <div className="info-item full-width">
                <label>Emergency Contact Number</label>
                <p>{guestInfo.emergencyContact}</p>
              </div>
              <p className="info-note">⚠️ This information is kept strictly confidential and will only be used in case of emergency.</p> */}
              {guestInfo.emergencyContact && Object.keys(guestInfo.emergencyContact).map((key) => {
  const value = guestInfo.emergencyContact[key];
  if (value) {
    return (
      <div key={key} className="info-item full-width">
        <label>
          {key === "primary" ? "Primary Contact" :
           key === "secondary" ? "Secondary Contact" :
           key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <p>{value}</p>
      </div>
    );
  }
  return null;
})}

{(!guestInfo.emergencyContact ||
  Object.values(guestInfo.emergencyContact).every(v => !v)) && (
  <p className="info-note">⚠️ No emergency contact recorded.</p>
)}

<p className="info-note">⚠️ This information is kept strictly confidential and will only be used in case of emergency.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestPersonalization;
