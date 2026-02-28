import { useState, useEffect } from "react";

const HotelResults = ({ searchData, results, loading, error }) => {
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    refundable: false,
    stars: [],
    amenities: []
  });
  const [filteredResults, setFilteredResults] = useState(results);

  // Mock hotel data (in production, comes from backend)
  const mockHotels = [
    {
      hotelId: "h1",
      name: "The Oberoi Grand Palace",
      city: "Delhi",
      starRating: 5,
      address: "24 Iconic Park, New Delhi",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop",
      pricePerNight: 5500,
      total: searchData.nights ? 5500 * searchData.nights : 5500,
      currency: "INR",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
      cancellation: "Free",
      suitabilityScore: 95,
      availability: 8,
      refundable: true
    },
    {
      hotelId: "h2",
      name: "ITC Maurya Sheraton",
      city: "Delhi",
      starRating: 4,
      address: "1 Diplomatic Enclave, New Delhi",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=300&fit=crop",
      pricePerNight: 4200,
      total: searchData.nights ? 4200 * searchData.nights : 4200,
      currency: "INR",
      amenities: ["WiFi", "Conference Hall", "Business Center"],
      cancellation: "Free",
      suitabilityScore: 98,
      availability: 15,
      refundable: true
    },
    {
      hotelId: "h3",
      name: "Taj Hotel New Delhi",
      city: "Delhi",
      starRating: 5,
      address: "1 Mansingh Road, New Delhi",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop",
      pricePerNight: 6800,
      total: searchData.nights ? 6800 * searchData.nights : 6800,
      currency: "INR",
      amenities: ["WiFi", "Pool", "Free Breakfast", "Spa"],
      cancellation: "Paid",
      suitabilityScore: 92,
      availability: 5,
      refundable: false
    },
    {
      hotelId: "h4",
      name: "Radisson Blu Marina Bay",
      city: "Mumbai",
      starRating: 4,
      address: "Marina Bay South, Mumbai",
      image: "https://images.unsplash.com/photo-1595521624871-d3dca842a4a4?w=500&h=300&fit=crop",
      pricePerNight: 3800,
      total: searchData.nights ? 3800 * searchData.nights : 3800,
      currency: "INR",
      amenities: ["WiFi", "Restaurant", "Free Breakfast"],
      cancellation: "Free",
      suitabilityScore: 85,
      availability: 12,
      refundable: true
    },
    {
      hotelId: "h5",
      name: "Hilton Bangalore",
      city: "Bangalore",
      starRating: 4,
      address: "Golden Jubilee Road, Bangalore",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba36d4d?w=500&h=300&fit=crop",
      pricePerNight: 3200,
      total: searchData.nights ? 3200 * searchData.nights : 3200,
      currency: "INR",
      amenities: ["WiFi", "Conference Rooms", "Business Center"],
      cancellation: "Free",
      suitabilityScore: 88,
      availability: 20,
      refundable: true
    },
    {
      hotelId: "h6",
      name: "Hyatt Regency Mumbai",
      city: "Mumbai",
      starRating: 5,
      address: "17 West High Street, Mumbai",
      image: "https://images.unsplash.com/photo-1611632039476-46f88fb63ae2?w=500&h=300&fit=crop",
      pricePerNight: 5900,
      total: searchData.nights ? 5900 * searchData.nights : 5900,
      currency: "INR",
      amenities: ["WiFi", "Pool", "Banquet Hall", "Free Breakfast"],
      cancellation: "Free",
      suitabilityScore: 96,
      availability: 3,
      refundable: true
    }
  ];

  // Determine data source: use API results if available, otherwise fallback to mock data
  const getDataSource = () => {
    // If results exist and have data, use them
    if (results && results.length > 0) {
      return results;
    }
    // Otherwise, use mock data (when API fails or returns empty)
    return mockHotels;
  };

  // Apply filters and sorting
  useEffect(() => {
    const dataSource = getDataSource();
    let filtered = [...dataSource];

    // Apply star filters
    if (filters.stars.length > 0) {
      filtered = filtered.filter(h => filters.stars.includes(h.starRating));
    }

    // Apply refundable filter
    if (filters.refundable) {
      filtered = filtered.filter(h => h.refundable);
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(h =>
        filters.amenities.some(a => h.amenities.includes(a))
      );
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.starRating - a.starRating);
    } else if (sortBy === "suitability") {
      filtered.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    }

    setFilteredResults(filtered);
  }, [sortBy, filters, results]);

  const toggleStarFilter = (star) => {
    setFilters({
      ...filters,
      stars: filters.stars.includes(star)
        ? filters.stars.filter(s => s !== star)
        : [...filters.stars, star]
    });
  };

  const toggleAmenityFilter = (amenity) => {
    setFilters({
      ...filters,
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter(a => a !== amenity)
        : [...filters.amenities, amenity]
    });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
        <div style={{ textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <p>Searching for amazing hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "20px",
          color: "#fca5a5",
          textAlign: "center"
        }}>
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Results Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <h2 style={{ color: "white", marginBottom: "5px", fontSize: "24px" }}>
            🏨 Available Hotels
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Hotels {searchData.city && `in ${searchData.city}`}
            {searchData.nights && ` for ${searchData.nights} night${searchData.nights > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              background: "rgba(56, 189, 248, 0.1)",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif"
            }}
          >
            <option value="rating">⭐ Highest Rated</option>
            <option value="suitability">🎯 Best Suitability</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💰 Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filters Sidebar + Results */}
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "30px" }}>
        {/* Filters */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "20px",
          height: "fit-content",
          position: "sticky",
          top: "100px"
        }}>
          <h3 style={{ color: "white", marginBottom: "20px", fontSize: "16px", fontWeight: "700" }}>
            🎯 Filters
          </h3>

          {/* Star Rating Filter */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px",
              letterSpacing: "0.5px"
            }}>
              Star Rating
            </label>
            {[3, 4, 5].map(star => (
              <label key={star} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                color: "#cbd5e1",
                fontSize: "14px"
              }}>
                <input
                  type="checkbox"
                  checked={filters.stars.includes(star)}
                  onChange={() => toggleStarFilter(star)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                {"⭐".repeat(star)} {star}-Star
              </label>
            ))}
          </div>

          {/* Refundable Filter */}
          <div style={{ marginBottom: "25px", paddingBottom: "25px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              color: "#cbd5e1",
              fontSize: "14px"
            }}>
              <input
                type="checkbox"
                checked={filters.refundable}
                onChange={(e) => setFilters({ ...filters, refundable: e.target.checked })}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              Free Cancellation
            </label>
          </div>

          {/* Amenities Filter */}
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px",
              letterSpacing: "0.5px"
            }}>
              Amenities
            </label>
            {["WiFi", "Free Breakfast", "Pool", "Business Center"].map(amenity => (
              <label key={amenity} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                color: "#cbd5e1",
                fontSize: "14px"
              }}>
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => toggleAmenityFilter(amenity)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div>
          {filteredResults.length === 0 ? (
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "60px 20px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔍</div>
              <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "10px" }}>
                No hotels match your filters
              </p>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px"
            }}>
              {filteredResults.map(hotel => (
                <div
                  key={hotel.hotelId}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    transform: "translateY(0)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(56, 189, 248, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  {/* Image */}
                  <div style={{
                    position: "relative",
                    height: "200px",
                    overflow: "hidden",
                    background: "rgba(139, 92, 246, 0.1)"
                  }}>
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    />
                    {/* Availability Badge */}
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: hotel.availability > 5
                        ? "rgba(34, 197, 94, 0.8)"
                        : "rgba(239, 68, 68, 0.8)",
                      backdropFilter: "blur(10px)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {hotel.availability > 5 ? "✓" : "⚠️"} {hotel.availability} left
                    </div>

                    {/* Suitability Score Badge */}
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "rgba(139, 92, 246, 0.8)",
                      backdropFilter: "blur(10px)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      🎯 {hotel.suitabilityScore}%
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px" }}>
                    {/* Name & Rating */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <div>
                        <h4 style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "700",
                          marginBottom: "5px",
                          lineHeight: "1.3"
                        }}>
                          {hotel.name}
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                          📍 {hotel.address}
                        </p>
                      </div>
                      <div style={{ color: "#fbbf24", fontSize: "18px" }}>
                        {"⭐".repeat(hotel.starRating)}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "15px"
                    }}>
                      {hotel.amenities.slice(0, 3).map(amenity => (
                        <span
                          key={amenity}
                          style={{
                            background: "rgba(56, 189, 248, 0.15)",
                            color: "#38bdf8",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: "600"
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span style={{
                          background: "rgba(139, 92, 246, 0.15)",
                          color: "#c4b5fd",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "600"
                        }}>
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Cancellation */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "15px",
                      fontSize: "12px",
                      color: hotel.refundable ? "#22c55e" : "#f97316"
                    }}>
                      {hotel.refundable ? "✓ Free Cancellation" : "Paid Cancellation"}
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: "1px",
                      background: "rgba(255, 255, 255, 0.1)",
                      marginBottom: "15px"
                    }}></div>

                    {/* Price Section */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end"
                    }}>
                      <div>
                        <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>
                          Price per night
                        </p>
                        <p style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#38bdf8"
                        }}>
                          ₹{hotel.pricePerNight.toLocaleString()}
                        </p>
                        {searchData.nights > 1 && (
                          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                            Total: ₹{hotel.total.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        style={{
                          background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
                          color: "white",
                          border: "none",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 8px 20px rgba(56, 189, 248, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelResults;
