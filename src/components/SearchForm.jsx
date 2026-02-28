import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 1,
    children: 0
  });

  const [nights, setNights] = useState(0);
  const [errors, setErrors] = useState({});

  // Popular cities
  const cities = [
    { name: "Delhi" },
    { name: "Mumbai" },
    { name: "Bangalore" },
    { name: "Hyderabad" },
    { name: "Chennai" },
    { name: "Kolkata" },
    { name: "Pune" },
    { name: "Goa" },
    { name: "Jaipur" },
    { name: "Kochi" }
  ];

  // Calculate nights
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleDateChange = (type, value) => {
    const newFormData = { ...formData, [type]: value };
    const newErrors = { ...errors };

    if (type === "checkInDate") {
      if (value < getTodayDate()) {
        newErrors.checkInDate = "Cannot select past date";
      } else {
        delete newErrors.checkInDate;
      }
    }

    if (type === "checkOutDate") {
      if (newFormData.checkInDate && value <= newFormData.checkInDate) {
        newErrors.checkOutDate = "Check-out must be after check-in";
      } else {
        delete newErrors.checkOutDate;
      }
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  const handleRoomChange = (type, action) => {
    const current = formData[type];
    const newValue = action === "inc" ? current + 1 : Math.max(1, current - 1);
    setFormData({ ...formData, [type]: newValue });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destination) newErrors.destination = "Select a city";
    if (!formData.checkInDate) newErrors.checkInDate = "Select check-in date";
    if (!formData.checkOutDate) newErrors.checkOutDate = "Select check-out date";
    if (formData.checkInDate && formData.checkInDate < getTodayDate()) {
      newErrors.checkInDate = "Cannot select past date";
    }
    if (formData.checkInDate && formData.checkOutDate && formData.checkOutDate <= formData.checkInDate) {
      newErrors.checkOutDate = "Check-out must be after check-in";
    }
    if (nights === 0) newErrors.dates = "Minimum stay is 1 night";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      navigate("/results", {
        state: {
          destination: formData.destination,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          rooms: formData.rooms,
          guests: formData.adults + formData.children,
          adults: formData.adults,
          children: formData.children,
          nights: nights
        }
      });
    }
  };

  const totalGuests = formData.adults + formData.children;
  const todayDate = getTodayDate();

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))",
      backdropFilter: "blur(40px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "28px",
      padding: "40px",
      maxWidth: "1100px",
      margin: "0 auto",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "35px", textAlign: "center" }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "10px",
          background: "linear-gradient(135deg, #38bdf8, #8b5cf6, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🔍 Find Your Perfect Hotel
        </h2>
        <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
          Real-time availability with TBO API integration
        </p>
      </div>

      {/* Main Search Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        marginBottom: "25px",
        alignItems: "flex-start"
      }}>
        {/* Destination */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "10px",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            📍 Destination
          </label>
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: `2px solid ${errors.destination ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              fontSize: "14px",
              transition: "all 0.3s ease",
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer",
              colorScheme: "dark"
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.12)";
              e.target.style.borderColor = "#38bdf8";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <option value="">Select city...</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name} style={{
                background: "#0a0e27",
                color: "white"
              }}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.destination && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.destination}</p>}
        </div>

        {/* Check-in Date */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "10px",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            📅 Check-in
          </label>
          <input
            type="date"
            value={formData.checkInDate}
            min={todayDate}
            onChange={(e) => handleDateChange("checkInDate", e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: `2px solid ${errors.checkInDate ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              fontSize: "14px",
              transition: "all 0.3s ease",
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer"
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.12)";
              e.target.style.borderColor = "#38bdf8";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          />
          {errors.checkInDate && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.checkInDate}</p>}
        </div>

        {/* Check-out Date */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "10px",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            📅 Check-out
          </label>
          <input
            type="date"
            value={formData.checkOutDate}
            min={formData.checkInDate || todayDate}
            onChange={(e) => handleDateChange("checkOutDate", e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: `2px solid ${errors.checkOutDate ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              fontSize: "14px",
              transition: "all 0.3s ease",
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer"
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.12)";
              e.target.style.borderColor = "#38bdf8";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          />
          {errors.checkOutDate && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.checkOutDate}</p>}
          {nights > 0 && <p style={{ color: "#38bdf8", fontSize: "12px", marginTop: "6px", fontWeight: "600" }}>{nights} night{nights > 1 ? "s" : ""}</p>}
        </div>

        {/* Rooms */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "10px",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            🛏️ Rooms
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.08)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "14px",
            padding: "4px 8px"
          }}>
            <button
              onClick={() => handleRoomChange("rooms", "dec")}
              style={{
                background: "transparent",
                border: "none",
                color: "#38bdf8",
                fontSize: "18px",
                cursor: "pointer",
                padding: "8px 12px",
                transition: "all 0.2s ease"
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "16px"
            }}>
              {formData.rooms}
            </div>
            <button
              onClick={() => handleRoomChange("rooms", "inc")}
              style={{
                background: "transparent",
                border: "none",
                color: "#38bdf8",
                fontSize: "18px",
                cursor: "pointer",
                padding: "8px 12px",
                transition: "all 0.2s ease"
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Adults & Children */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "10px",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            👥 Guests
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "14px",
            padding: "8px 12px"
          }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Adults</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}>
                <button
                  onClick={() => handleRoomChange("adults", "dec")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#38bdf8",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "2px 6px"
                  }}
                >
                  −
                </button>
                <span style={{ color: "white", fontWeight: "600", minWidth: "20px" }}>
                  {formData.adults}
                </span>
                <button
                  onClick={() => handleRoomChange("adults", "inc")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#38bdf8",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "2px 6px"
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ width: "1px", height: "30px", background: "rgba(255, 255, 255, 0.1)" }}></div>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Children</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}>
                <button
                  onClick={() => handleRoomChange("children", "dec")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#38bdf8",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "2px 6px"
                  }}
                >
                  −
                </button>
                <span style={{ color: "white", fontWeight: "600", minWidth: "20px" }}>
                  {formData.children}
                </span>
                <button
                  onClick={() => handleRoomChange("children", "inc")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#38bdf8",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "2px 6px"
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errors.dates && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#fca5a5",
          padding: "12px 16px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontSize: "13px",
          fontWeight: "600"
        }}>
          ⚠️ {errors.dates}
        </div>
      )}

      {/* Search Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleSearch}
          style={{
            background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
            color: "white",
            border: "none",
            padding: "16px 60px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(56, 189, 248, 0.3)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 15px 40px rgba(56, 189, 248, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 10px 30px rgba(56, 189, 248, 0.3)";
          }}
        >
          🔍 Search Hotels
        </button>
      </div>

      {/* Info Text */}
      <p style={{
        marginTop: "20px",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "12px"
      }}>
        ⚡ Real-time TBO API powered • 100+ hotels • Instant availability
      </p>
    </div>
  );
};

export default SearchForm;