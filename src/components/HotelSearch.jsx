import { useState, useRef, useEffect } from "react";
import axios from "axios";

const HotelSearch = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    city: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 1,
    children: 0,
    eventType: "MICE"
  });

  const [cityDropdown, setCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [nights, setNights] = useState(0);
  const [errors, setErrors] = useState({});
  const cityInputRef = useRef(null);

  // Simulated city data with IDs (in real app, fetch from API)
  const cities = [
    { id: "del", name: "Delhi", country: "India", airport: "DEL" },
    { id: "mum", name: "Mumbai", country: "India", airport: "BOM" },
    { id: "bang", name: "Bangalore", country: "India", airport: "BLR" },
    { id: "hyd", name: "Hyderabad", country: "India", airport: "HYD" },
    { id: "che", name: "Chennai", country: "India", airport: "MAA" },
    { id: "kol", name: "Kolkata", country: "India", airport: "CCU" },
    { id: "pune", name: "Pune", country: "India", airport: "PNQ" },
    { id: "jaipur", name: "Jaipur", country: "India", airport: "JAI" },
    { id: "kochi", name: "Kochi", country: "India", airport: "COK" },
    { id: "goa", name: "Goa", country: "India", airport: "GOI" },
    { id: "lnd", name: "London", country: "UK", airport: "LHR" },
    { id: "par", name: "Paris", country: "France", airport: "CDG" },
    { id: "bng", name: "Bangkok", country: "Thailand", airport: "BKK" },
    { id: "sg", name: "Singapore", country: "Singapore", airport: "SIN" },
    { id: "dubai", name: "Dubai", country: "UAE", airport: "DXB" }
  ];

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

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

  const handleCitySelect = (city) => {
    setFormData({ ...formData, city: city.name, cityId: city.id });
    setCityDropdown(false);
    setCitySearch("");
  };

  const handleDateChange = (type, value) => {
    const newFormData = { ...formData, [type]: value };

    // Validation
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

    if (!formData.city) newErrors.city = "Select a city";
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
      onSearch(formData);
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
      maxWidth: "1200px",
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
          Real-time availability across 500+ cities
        </p>
      </div>

      {/* Main Search Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "25px",
        alignItems: "flex-start"
      }}>
        {/* City Selector */}
        <div style={{ position: "relative" }}>
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
          <div style={{ position: "relative" }}>
            <input
              ref={cityInputRef}
              type="text"
              placeholder="Search city..."
              value={citySearch || formData.city}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setCityDropdown(true);
              }}
              onFocus={(e) => {
                setCityDropdown(true);
                e.target.style.background = "rgba(255, 255, 255, 0.12)";
                e.target.style.borderColor = "#38bdf8";
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `2px solid ${errors.city ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
                background: "rgba(255, 255, 255, 0.08)",
                color: "white",
                fontSize: "14px",
                transition: "all 0.3s ease",
                fontFamily: "Poppins, sans-serif",
                cursor: "text"
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                setTimeout(() => setCityDropdown(false), 200);
              }}
            />

            {/* City Dropdown */}
            {cityDropdown && filteredCities.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "8px",
                background: "rgba(15, 23, 41, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "14px",
                maxHeight: "280px",
                overflowY: "auto",
                zIndex: 100,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)"
              }}>
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    style={{
                      padding: "14px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "all 0.2s ease",
                      background: formData.city === city.name ? "rgba(56, 189, 248, 0.2)" : "transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = formData.city === city.name ? "rgba(56, 189, 248, 0.2)" : "transparent";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                          {city.name}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                          {city.country} • {city.airport}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.city && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.city}</p>}
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
              onHover={(e) => e.target.style.color = "#8b5cf6"}
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
              onHover={(e) => e.target.style.color = "#8b5cf6"}
            >
              +
            </button>
          </div>
        </div>

        {/* Guests */}
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
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Adults</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "4px"
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
                <span style={{ color: "white", fontWeight: "600" }}>{formData.adults}</span>
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
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Children</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "4px"
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
                <span style={{ color: "white", fontWeight: "600" }}>{formData.children}</span>
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

        {/* Event Type */}
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
            🎯 Event Type
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "2px solid rgba(255, 255, 255, 0.15)",
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
          >
            <option value="MICE">MICE (Corporate)</option>
            <option value="WEDDING">Wedding</option>
            <option value="CONFERENCE">Conference</option>
          </select>
        </div>
      </div>

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
    </div>
  );
};

export default HotelSearch;
