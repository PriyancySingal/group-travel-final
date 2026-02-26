import { useState } from "react";
import "./GuestProfile.css";

const INTEREST_OPTIONS = [
  "Music",
  "Tech",
  "Travel",
  "Networking",
  "Food",
  "Fitness",
  "Photography",
  "Art",
  "Gaming",
  "Other"
];

const AGE_OPTIONS = ["Under 18", "18-25", "26-35", "36-50", "50+"];

const AGE_MAP = {
  "Under 18": 17,
  "18-25": 22,
  "26-35": 30,
  "36-50": 43,
  "50+": 55
};

const BUDGET_OPTIONS = ["Budget-friendly", "Mid-range", "Premium"];

const BUDGET_MAP = {
  "Budget-friendly": 5000,
  "Mid-range": 15000,
  Premium: 30000
};

const INTERACTION_OPTIONS = [
  { label: "Prefer small groups", value: "introvert" },
  { label: "Comfortable with both", value: "balanced" },
  { label: "Love meeting new people", value: "extrovert" }
];

const ENERGY_OPTIONS = [
  { label: "🔋 Low energy", value: "low" },
  { label: "🔋🔋 Medium", value: "medium" },
  { label: "🔋🔋🔋 High", value: "high" }
];

const getAgeGroupFromNumber = (age) => {
  if (typeof age !== "number") return "";
  if (age < 18) return "Under 18";
  if (age <= 25) return "18-25";
  if (age <= 35) return "26-35";
  if (age <= 50) return "36-50";
  return "50+";
};

const getBudgetTierFromNumber = (budget) => {
  if (typeof budget !== "number") return "";
  if (budget <= 5000) return "Budget-friendly";
  if (budget <= 15000) return "Mid-range";
  return "Premium";
};

const buildInitialFormData = (guest) => {
  if (!guest) {
    return {
      name: "",
      city: "",
      interests: [],
      ageGroup: "",
      budgetTier: "",
      isFirstTime: false,
      preferredInteraction: "",
      availability: "",
      energyLevel: "",
      feedback: "",
      otherInterest: ""
    };
  }

  return {
    name: guest.name || "",
    city: guest.city || "",
    interests: guest.interests || [],
    ageGroup: getAgeGroupFromNumber(guest.age),
    budgetTier: getBudgetTierFromNumber(guest.budget),
    isFirstTime: Boolean(guest.isFirstTime),
    preferredInteraction: guest.preferredInteraction || "",
    availability: guest.availability || "",
    energyLevel: guest.energyLevel || "",
    feedback: guest.feedback || "",
    otherInterest: (guest.interests || []).find((interest) => !INTEREST_OPTIONS.includes(interest)) || ""
  };
};

const GuestProfileForm = ({ guest, onSave, onCancel }) => {
  const [formData, setFormData] = useState(buildInitialFormData(guest));
  const [showOptionalFields, setShowOptionalFields] = useState(Boolean(guest));
  const [showFeedback, setShowFeedback] = useState(Boolean(guest?.feedback));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter guest name");
      return;
    }

    if (!formData.city.trim()) {
      alert("Please enter city");
      return;
    }

    if (formData.interests.length === 0) {
      alert("Please select at least one interest");
      return;
    }

    const normalizedInterests = formData.interests
      .filter((interest) => interest !== "Other")
      .concat(
        formData.interests.includes("Other") && formData.otherInterest.trim()
          ? [formData.otherInterest.trim()]
          : []
      );

    onSave({
      name: formData.name.trim(),
      city: formData.city.trim(),
      interests: normalizedInterests,
      age: formData.ageGroup ? AGE_MAP[formData.ageGroup] : null,
      budget: formData.budgetTier ? BUDGET_MAP[formData.budgetTier] : null,
      isFirstTime: Boolean(formData.isFirstTime),
      preferredInteraction: formData.preferredInteraction,
      availability: formData.availability,
      energyLevel: formData.energyLevel,
      feedback: formData.feedback.trim()
    });
  };

  return (
    <div className="guest-profile-form-overlay">
      <div className="guest-profile-form-container">
        <h2>{guest ? "Edit Guest Profile" : "Add New Guest Profile"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Required</h3>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter guest name"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="form-group">
              <label>Interests *</label>
              <div className="chip-grid">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={`chip-btn ${formData.interests.includes(interest) ? "selected" : ""}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {formData.interests.includes("Other") && (
              <div className="form-group">
                <label>Other interest</label>
                <input
                  type="text"
                  name="otherInterest"
                  value={formData.otherInterest}
                  onChange={handleInputChange}
                  placeholder="Enter other interest"
                />
              </div>
            )}

            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowOptionalFields((prev) => !prev)}
            >
              {showOptionalFields ? "Hide Preferences" : "Add Preferences (Optional)"}
            </button>
          </div>

          {showOptionalFields && (
            <div className="form-section">
              <h3>Preferences (Optional)</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Age group</label>
                  <select name="ageGroup" value={formData.ageGroup} onChange={handleInputChange}>
                    <option value="">Select age group</option>
                    {AGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget</label>
                  <select name="budgetTier" value={formData.budgetTier} onChange={handleInputChange}>
                    <option value="">Select budget</option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFirstTime"
                    checked={formData.isFirstTime}
                    onChange={handleCheckboxChange}
                  />
                  First time attending an event like this?
                </label>
              </div>

                <div className="form-group">
                  <label>Preferred interaction</label>
                  <div className="radio-grid">
                    <label>
                      <input
                        type="radio"
                        name="preferredInteraction"
                        value=""
                        checked={formData.preferredInteraction === ""}
                        onChange={handleInputChange}
                      />
                      Not specified
                    </label>
                    {INTERACTION_OPTIONS.map((option) => (
                      <label key={option.value}>
                        <input
                        type="radio"
                        name="preferredInteraction"
                        value={option.value}
                        checked={formData.preferredInteraction === option.value}
                        onChange={handleInputChange}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Availability</label>
                  <select name="availability" value={formData.availability} onChange={handleInputChange}>
                    <option value="">Not specified</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Energy level</label>
                  <select name="energyLevel" value={formData.energyLevel} onChange={handleInputChange}>
                    <option value="">Not specified</option>
                    {ENERGY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowFeedback((prev) => !prev)}
              >
                {showFeedback ? "Hide Feedback" : "Add Feedback (Optional)"}
              </button>

              {showFeedback && (
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Any expectations or concerns? (optional)</label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Share expectations or concerns"
                    rows="4"
                  />
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Save Guest Profile
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestProfileForm;
