import { useState, useEffect } from "react";
import GuestProfileForm from "./GuestProfileForm";
import GuestProfileCard from "./GuestProfileCard";
import GuestAlerts from "./GuestAlerts";
import GuestStats from "./GuestStats";
import GuestPreferencesAPI from "./GuestPreferencesAPI";
import "./Guests.css";

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialNeeds, setFilterSpecialNeeds] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  // Check if using behavioral demo data
  const isDemoMode = false; // Always allow guest management

  // Load guests on component mount
  useEffect(() => {
    loadGuests();
    loadAlerts();

    // Subscribe to alert updates
    const unsubscribe = GuestPreferencesAPI.subscribe(() => {
      loadAlerts();
    });

    return unsubscribe;
  }, []);

  const loadGuests = async () => {
    const savedGuests = await GuestPreferencesAPI.getAllGuests();
    setGuests(savedGuests);
  };

  const loadAlerts = async () => {
    const savedAlerts = await GuestPreferencesAPI.getAllAlerts();
    console.log(
      "Alert IDs from API:",
      savedAlerts.map(a => a.id)
    );

    // Deduplicate by ID in case corrupted data exists
    const unique = Array.from(
      new Map(savedAlerts.map(a => [a.id, a])).values()
    );

    setAlerts(unique.slice(0, 10)); // Show last 10 alerts
  };

  const handleAddGuest = () => {
    console.log('🔍 Add Guest button clicked!');
    console.log('🔍 Current isDemoMode:', isDemoMode);
    setEditingGuest(null);
    setShowForm(true);
    console.log('🔍 showForm set to true');
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleDeleteGuest = async (guestId) => {
    if (window.confirm("Are you sure you want to remove this guest?")) {
      await GuestPreferencesAPI.deleteGuest(guestId);
      loadGuests();
    }
  };

  const handleSaveGuest = async (guestData) => {
    try {
      console.log('🔍 Saving guest data:', guestData);
      await GuestPreferencesAPI.saveGuest(guestData);
      console.log('✅ Guest saved successfully');
      loadGuests();
      loadAlerts();
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving guest:', error);
      alert('Failed to save guest: ' + error.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGuest(null);
  };

  const handleDismissAlert = async (alertId) => {
    await GuestPreferencesAPI.dismissAlert(alertId);
    loadAlerts();
  };

  const handleExportCSV = () => {
    const csv = GuestPreferencesAPI.exportGuestsAsCSV(guests);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute(
      "download",
      `guest-list-${new Date().toISOString().split("T")[0]}.csv`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGenerateReport = async () => {
    const report = await GuestPreferencesAPI.generateGuestReport();
    console.log("Guest Report:", report);
    alert(
      `Report Generated:\n\nTotal Guests: ${report.totalGuests}\n\nView console for full details.`
    );
  };

  const handleClearAlerts = async () => {
    if (window.confirm("Clear all alerts?")) {
      await GuestPreferencesAPI.clearAllAlerts();
      loadAlerts();
    }
  };

  // Filter guests
  let filteredGuests = guests;

  if (searchTerm) {
    filteredGuests = filteredGuests.filter(
      g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterSpecialNeeds) {
    filteredGuests = filteredGuests.filter(
      g => g.specialNeeds.length > 0 || g.wheelchairAccessible || g.mobilityAssistance
    );
  }

  // Sort guests
  if (sortBy === "name") {
    filteredGuests.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "recent") {
    filteredGuests.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } else if (sortBy === "specialNeeds") {
    filteredGuests.sort(
      (a, b) => (b.specialNeeds.length + (b.mobilityAssistance ? 1 : 0)) -
        (a.specialNeeds.length + (a.mobilityAssistance ? 1 : 0))
    );
  }

  return (
    <div className="guests-container fade-in">
      <div className="guests-header">
        <div className="header-content">
          <h1>👥 Guest Profiles & Preferences</h1>
          <p>Manage guest information, dietary requirements, and special needs</p>
        </div>
      </div>

      {/* Real-Time Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h2>🔔 Real-Time Updates & Alerts</h2>
            {alerts.length > 0 && (
              <button className="btn-clear-alerts" onClick={handleClearAlerts}>
                Clear All
              </button>
            )}
          </div>
          <GuestAlerts alerts={alerts} onDismiss={handleDismissAlert} />
        </div>
      )}

      {/* Stats Section */}
      {guests.length > 0 && <GuestStats guests={guests} />}

      {/* Controls Section */}
      <div className="guests-controls">
        {isDemoMode ? (
          <div className="demo-notice">
            <span className="demo-badge">🎯 BEHAVIORAL DEMO MODE</span>
            <span className="demo-text">Viewing 12 engineered guest profiles with AI insights</span>
          </div>
        ) : (
          <button className="btn-primary btn-add" onClick={handleAddGuest}>
            ➕ Add New Guest
          </button>
        )}

        <div className="controls-group">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">📌 Sort by Name</option>
            <option value="recent">🕐 Sort by Recent</option>
            <option value="specialNeeds">♿ Sort by Special Needs</option>
          </select>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filterSpecialNeeds}
              onChange={(e) => setFilterSpecialNeeds(e.target.checked)}
            />
            🔍 Show only Special Needs
          </label>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
          <button className="btn-secondary" onClick={handleGenerateReport}>
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Guest List */}
      <div className="guests-list">
        {filteredGuests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No guests yet</p>
            <p className="empty-subtitle">
              {guests.length === 0
                ? "Start by adding your first guest profile"
                : "No guests match your search criteria"}
            </p>
            {guests.length === 0 && (
              <button
                className="btn-primary btn-empty"
                onClick={handleAddGuest}
              >
                Add First Guest
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="guests-count">
              Showing {filteredGuests.length} of {guests.length} guests
            </p>
            <div className="guests-grid">
              {filteredGuests.map(guest => (
                <GuestProfileCard
                  key={guest._id || guest.id}
                  guest={guest}
                  onEdit={handleEditGuest}
                  onDelete={handleDeleteGuest}
                  isDemoMode={isDemoMode}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Guest Profile Form Modal */}
      {showForm && (
        <GuestProfileForm
          guest={editingGuest}
          onSave={handleSaveGuest}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Guests;
