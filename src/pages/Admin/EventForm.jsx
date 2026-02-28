import { useState, useEffect } from "react";
import "./EventForm.css";

const EventForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "wedding",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "planning",
    organizer: "",
    logo: "🎫",
    hotel: "",
    guestCount: 0,
    budget: ""
  });

  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (event) {
  //     setFormData(event);
  //   }
  // }, [event]);
useEffect(() => {
  if (event) {
    console.log("Event data passed to form:", event); // Add this log
    // Ensure startDate and endDate are formatted correctly for <input type="date">
    setFormData({
      name: event.name || "",
      type: event.type || "wedding",
      description: event.description || "",
      location: event.location || "",
      // startDate: event.startDate ? event.startDate.toISOString().split("T")[0] : "",  // Format date as YYYY-MM-DD
      // endDate: event.endDate ? event.endDate.toISOString().split("T")[0] : "",          // Format date as YYYY-MM-DD
      startDate: event.startDate
  ? new Date(event.startDate).toISOString().split("T")[0]
  : "",

endDate: event.endDate
  ? new Date(event.endDate).toISOString().split("T")[0]
  : "",
      status: event.status || "planning",
      organizer: event.organizer || "",
      logo: event.logo || "🎫",
      hotel: event.hotel || "",
      guestCount: event.guestCount || 0,
      budget: event.budget || ""
    });
  }
}, [event]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.organizer.trim()) newErrors.organizer = "Organizer name is required";
    if (!formData.guestCount || formData.guestCount <= 0) newErrors.guestCount = "Guest count must be greater than 0";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "guestCount" ? parseInt(value) || 0 : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataCopy = { ...formData };
console.log("Form Data before submit:", formDataCopy); // Add this log
    // Ensure dates are in the correct format (YYYY-MM-DD)
    formDataCopy.startDate = new Date(formDataCopy.startDate).toISOString().split("T")[0];  // Format date
    formDataCopy.endDate = new Date(formDataCopy.endDate).toISOString().split("T")[0];      // Format date
      // Call the onSubmit prop passed from EventManagementPanel
      try {
        await onSubmit(formDataCopy); // onSubmit is passed from EventManagementPanel
        alert('Event created successfully!');
      } catch (error) {
        alert('Error creating event');
      }
    }
};


  const eventTypes = [
    { value: "wedding", label: "💍 Wedding", description: "Destination wedding" },
    { value: "conference", label: "💻 Conference", description: "Professional conference" },
    { value: "mice", label: "🏢 Corporate/MICE", description: "Corporate event" }
  ];

  const logoOptions = ["🎫", "💍", "💻", "🏢", "🎉", "🎊", "🎈", "🌟"];

  return (
    <div className="event-form-container">
      <div className="form-header">
        <h3>{event ? "✏️ Edit Event" : "➕ Create New Event"}</h3>
        <button className="btn-close" onClick={onCancel} disabled={loading}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        {/* Basic Information */}
        <div className="form-section">
          <h4>📋 Basic Information</h4>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>Event Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sharma Wedding 2024"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Logo/Icon</label>
              <div className="logo-picker">
                {logoOptions.map(logo => (
                  <button
                    key={logo}
                    type="button"
                    className={`logo-option ${formData.logo === logo ? "selected" : ""}`}
                    onClick={() => setFormData(prev => ({ ...prev, logo }))}
                  >
                    {logo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description..."
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Location & Dates */}
        <div className="form-section">
          <h4>📍 Location & Dates</h4>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Gangtok, Sikkim"
                className={errors.location ? "input-error" : ""}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? "input-error" : ""}
              />
              {errors.startDate && <span className="error-text">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "input-error" : ""}
              />
              {errors.endDate && <span className="error-text">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Hotel/Venue</label>
              <input
                type="text"
                name="hotel"
                value={formData.hotel}
                onChange={handleChange}
                placeholder="e.g., Grand Himalayan Resort"
              />
            </div>
          </div>
        </div>

        {/* Organizer & Guests */}
        <div className="form-section">
          <h4>👥 Organizer & Guests</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Organizer Name *</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g., Priya Sharma"
                className={errors.organizer ? "input-error" : ""}
              />
              {errors.organizer && <span className="error-text">{errors.organizer}</span>}
            </div>

            <div className="form-group">
              <label>Number of Guests *</label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min="1"
                className={errors.guestCount ? "input-error" : ""}
              />
              {errors.guestCount && <span className="error-text">{errors.guestCount}</span>}
            </div>
          </div>
        </div>

        {/* Budget & Status */}
        <div className="form-section">
          <h4>💰 Budget & Status</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Budget *</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., ₹50,00,000"
                className={errors.budget ? "input-error" : ""}
              />
              {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="planning">🗂️ Planning</option>
                <option value="confirmed">✅ Confirmed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : event ? "💾 Update Event" : "✨ Create Event"}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
