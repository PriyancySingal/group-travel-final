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

      // Try to call real API
      try {
        const response = await fetch('/api/hotels/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchPayload)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hotels && data.hotels.length > 0) {
            setSearchData(searchPayload);
            setResults(data.hotels);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using fallback hotel data');
      }

      // If API fails or returns empty, use fallback mock data
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSearchData(searchPayload);
      setResults([]); // Empty array tells HotelResults to use mockHotels (fallback)
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      // Still show results with fallback data even on error
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      setSearchData({
        ...formData,
        nights: nights
      });
      setResults([]); // Use fallback mock data
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
