import { useEffect, useState } from "react";
import GuestProfileForm from "./GuestProfileForm";
import GuestProfileCard from "./GuestProfileCard";
import GuestAlerts from "./GuestAlerts";
import GuestStats from "./GuestStats";
import { createGuest, deleteGuest, getGuests, getInsights, updateGuest } from "../../services/guestApi";
import "./Guests.css";

const createAlert = (type, title, message, guestName = "") => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  timestamp: new Date().toISOString(),
  type,
  title,
  message,
  guestName
});

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(false);
  const [insightsSyncedAt, setInsightsSyncedAt] = useState(null);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setIsLoading(true);
    try {
      const data = await getGuests();
      setGuests(data);
    } catch (error) {
      console.error("Failed to load guests:", error);
      setAlerts((prev) => [
        createAlert("booking_change", "Load Failed", "Could not fetch guests from backend."),
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const syncInsights = async () => {
    try {
      await getInsights();
      setInsightsSyncedAt(new Date().toISOString());
    } catch (error) {
      console.error("Insights sync failed:", error);
    }
  };

  const handleAddGuest = () => {
    setEditingGuest(null);
    setShowForm(true);
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm("Are you sure you want to remove this guest?")) return;

    try {
      await deleteGuest(guestId);
      await loadGuests();
      await syncInsights();
      setAlerts((prev) => [
        createAlert("preference_update", "Guest Deleted", "Guest was removed successfully."),
        ...prev
      ]);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSaveGuest = async (guestData) => {
    const payload = {
      name: guestData.name,
      age: guestData.age,
      city: guestData.city,
      interests: guestData.interests || [],
      budget: guestData.budget,
      isFirstTime: Boolean(guestData.isFirstTime),
      preferredInteraction: guestData.preferredInteraction || null,
      availability: guestData.availability || null,
      energyLevel: guestData.energyLevel || null,
      feedback: guestData.feedback || ""
    };

    try {
      if (editingGuest?._id) {
        await updateGuest(editingGuest._id, payload);
        setAlerts((prev) => [
          createAlert("preference_update", "Guest Updated", `${guestData.name} was updated`, guestData.name),
          ...prev
        ]);
      } else {
        await createGuest(payload);
        setAlerts((prev) => [
          createAlert("new_guest", "Guest Added", `${guestData.name} was added`, guestData.name),
          ...prev
        ]);
      }
      await loadGuests();
      await syncInsights();
      setShowForm(false);
      setEditingGuest(null);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleExportCSV = () => {
    if (!guests.length) return;
    const headers = [
      "name",
      "age",
      "city",
      "interests",
      "budget",
      "isFirstTime",
      "preferredInteraction",
      "availability",
      "energyLevel",
      "feedback"
    ];
    const rows = guests.map((guest) =>
      [
        guest.name || "",
        guest.age ?? "",
        guest.city || "",
        (guest.interests || []).join(";"),
        guest.budget ?? "",
        guest.isFirstTime ? "Yes" : "No",
        guest.preferredInteraction || "",
        guest.availability || "",
        guest.energyLevel || "",
        guest.feedback || ""
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    anchor.setAttribute("download", `guest-list-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleGenerateReport = () => {
    const report = {
      totalGuests: guests.length,
      firstTimeGuests: guests.filter((guest) => guest.isFirstTime).length,
      cities: [...new Set(guests.map((guest) => guest.city).filter(Boolean))].length,
      withFeedback: guests.filter((guest) => guest.feedback?.trim()).length
    };
    alert(
      `Report Generated:\n\nTotal Guests: ${report.totalGuests}\nFirst-Time Guests: ${report.firstTimeGuests}\nCities: ${report.cities}\nWith Feedback: ${report.withFeedback}`
    );
  };

  let filteredGuests = [...guests];

  if (searchTerm) {
    filteredGuests = filteredGuests.filter((guest) =>
      `${guest.name || ""} ${guest.city || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  if (sortBy === "name") {
    filteredGuests.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortBy === "recent") {
    filteredGuests.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } else if (sortBy === "firstTime") {
    filteredGuests.sort((a, b) => Number(b.isFirstTime) - Number(a.isFirstTime));
  }

  return (
    <div className="guests-container fade-in">
      <div className="guests-header">
        <div className="header-content">
          <h1>👥 Guest Profiles & Preferences</h1>
          <p>MongoDB-backed guest management for live AI insights</p>
          {insightsSyncedAt && (
            <p style={{ marginTop: 8, opacity: 0.8 }}>
              Last insight sync: {new Date(insightsSyncedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h2>🔔 Updates</h2>
            <button className="btn-clear-alerts" onClick={handleClearAlerts}>
              Clear All
            </button>
          </div>
          <GuestAlerts alerts={alerts} onDismiss={handleDismissAlert} />
        </div>
      )}

      {guests.length > 0 && <GuestStats guests={guests} />}

      <div className="guests-controls">
        <button className="btn-primary btn-add" onClick={handleAddGuest}>
          ➕ Add New Guest
        </button>

        <div className="controls-group">
          <input
            type="text"
            placeholder="🔍 Search by name or city..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="sort-select"
          >
            <option value="name">📌 Sort by Name</option>
            <option value="recent">🕐 Sort by Recent</option>
            <option value="firstTime">🆕 Sort by First-Time</option>
          </select>
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

      <div className="guests-list">
        {isLoading ? (
          <div className="empty-state">
            <p className="empty-title">Loading guests...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No guests yet</p>
            <p className="empty-subtitle">Start by adding your first guest profile</p>
            <button className="btn-primary btn-empty" onClick={handleAddGuest}>
              Add First Guest
            </button>
          </div>
        ) : (
          <>
            <p className="guests-count">
              Showing {filteredGuests.length} of {guests.length} guests
            </p>
            <div className="guests-grid">
              {filteredGuests.map((guest) => (
                <GuestProfileCard
                  key={guest._id}
                  guest={guest}
                  onEdit={handleEditGuest}
                  onDelete={handleDeleteGuest}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <GuestProfileForm
          guest={editingGuest}
          onSave={handleSaveGuest}
          onCancel={() => {
            setShowForm(false);
            setEditingGuest(null);
          }}
        />
      )}
    </div>
  );
};

export default Guests;
