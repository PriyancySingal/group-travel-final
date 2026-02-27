import { useState } from "react";
import HotelSearch from "../components/HotelSearch";
import HotelResults from "../components/HotelResults";

const HotelSearchPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Calculate nights
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      const searchPayload = {
        cityId: formData.cityId,
        city: formData.city,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        rooms: formData.rooms,
        adults: formData.adults,
        children: formData.children,
        eventType: formData.eventType,
        nights: nights
      };

      // Simulate API call (replace with actual backend call)
      await new Promise(resolve => setTimeout(resolve, 800));

      // For now, we'll use mock data from HotelResults
      // In production: const response = await axios.post('/api/hotels/search', searchPayload);
      
      setSearchData(searchPayload);
      setResults([]); // Empty array tells HotelResults to use mockHotels
      setLoading(false);
    } catch (err) {
      setError("Failed to search hotels. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f1729 100%)",
      paddingTop: "20px",
      paddingBottom: "60px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Fixed Search Form at Top */}
        <div style={{ marginBottom: searchData ? "60px" : "0", animation: "slideDown 0.5s ease" }}>
          <HotelSearch onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        {searchData && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <HotelResults
              searchData={searchData}
              results={results}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            div {
              padding-left: 10px;
              padding-right: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HotelSearchPage;
