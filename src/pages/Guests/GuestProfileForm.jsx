import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./GuestProfile.css";

const GuestProfileForm = ({ guest, onSave, onCancel }) => {
  // Get current event ID from localStorage
  const getCurrentEventId = () => {
    return localStorage.getItem('currentEventId') || '69a16584ef6c5d8dc73f14dd';
  };

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState(
    guest || {
      id: uuidv4(),
      name: "",
      email: "",
      phone: "",
      roomPreference: "standard",
      dietaryRequirements: [],
      specialNeeds: [],
      mobilityAssistance: false,
      wheelchairAccessible: false,
      highFloor: false,
      groundFloor: false,
      quietRoom: false,
      notes: "",
      eventId: getCurrentEventId(), // Add event ID
      updatedAt: new Date().toISOString()
    }
  );

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-Free" },
    { value: "halal", label: "Halal" },
    { value: "kosher", label: "Kosher" },
    { value: "dairy-free", label: "Dairy-Free" },
    { value: "nut-free", label: "Nut-Free" }
  ];

  const specialNeedsOptions = [
    "Wheelchair Accessibility",
    "Mobility Assistance",
    "Visual Impairment Support",
    "Hearing Impairment Support",
    "Service Animal Accommodation"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDietaryToggle = (diet) => {
    setFormData(prev => ({
      ...prev,
      dietaryRequirements: prev.dietaryRequirements.includes(diet)
        ? prev.dietaryRequirements.filter(d => d !== diet)
        : [...prev.dietaryRequirements, diet],
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSpecialNeedsToggle = (need) => {
    setFormData(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter(n => n !== need)
        : [...prev.specialNeeds, need],
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    console.log('🔍 Form data before validation:', formData);

    if (!formData.name.trim()) {
      alert("Please enter guest name");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    console.log('✅ Form validation passed, saving guest...');
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="guest-profile-form-overlay">
      <div className="guest-profile-form-container">
        <h2>
          <span>{guest ? "Edit Guest Profile" : "Add New Guest Profile"}</span>
          <button className="close-button" onClick={onCancel}>
            ×
          </button>
        </h2>

        <div className="step-indicator">
          Step {step} of {totalSteps}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-step">
            {step === 1 && (
              <>
                <h3>📋 Basic Information</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter guest name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="guest@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3>🏨 Room Preferences</h3>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    name="roomPreference"
                    value={formData.roomPreference}
                    onChange={handleInputChange}
                  >
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                    <option value="accessible">Accessible Room</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="quietRoom"
                      checked={formData.quietRoom}
                      onChange={handleCheckboxChange}
                    />
                    Prefer Quiet Room
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="highFloor"
                      checked={formData.highFloor}
                      onChange={handleCheckboxChange}
                    />
                    Prefer High Floor
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="groundFloor"
                      checked={formData.groundFloor}
                      onChange={handleCheckboxChange}
                    />
                    Prefer Ground Floor
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3>🍽️ Dietary Requirements</h3>
                <p className="section-help">Select all that apply</p>
                <div className="checkbox-grid">
                  {dietaryOptions.map(diet => (
                    <label key={diet.value}>
                      <input
                        type="checkbox"
                        checked={formData.dietaryRequirements.includes(diet.value)}
                        onChange={() => handleDietaryToggle(diet.value)}
                      />
                      {diet.label}
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h3>♿ Special Needs & Accessibility</h3>
                <p className="section-help">Select if applicable</p>

                <div className="checkbox-grid">
                  {specialNeedsOptions.map(need => (
                    <label key={need}>
                      <input
                        type="checkbox"
                        checked={formData.specialNeeds.includes(need)}
                        onChange={() => handleSpecialNeedsToggle(need)}
                      />
                      {need}
                    </label>
                  ))}
                </div>

                <div className="checkbox-group" style={{ marginTop: "16px" }}>
                  <label>
                    <input
                      type="checkbox"
                      name="mobilityAssistance"
                      checked={formData.mobilityAssistance}
                      onChange={handleCheckboxChange}
                    />
                    Requires Mobility Assistance
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="wheelchairAccessible"
                      checked={formData.wheelchairAccessible}
                      onChange={handleCheckboxChange}
                    />
                    Requires Wheelchair Accessible Room
                  </label>
                </div>

                <div className="form-group">
                  <h3>📝 Additional Notes</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any other preferences or special requirements..."
                    rows="4"
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-navigation">
            {step > 1 && (
              <button type="button" className="btn-back" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}

            {step < totalSteps && (
              <button type="button" className="btn-next" onClick={() => setStep(step + 1)}>
                Next →
              </button>
            )}

            {step === totalSteps && (
              <button type="submit" className="btn-submit">
                Save Guest Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestProfileForm;
