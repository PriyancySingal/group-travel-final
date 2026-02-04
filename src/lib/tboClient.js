// TBO API Client for Hotel Inventory Management

const TBO_API_URL = 'http://api.tbotechnology.in/TBOHolidays_HotelAPI';
const TBO_USERNAME = 'hackathontest';
const TBO_PASSWORD = 'Hac@98147521';

// Mock data for development when API is not available
const mockHotelData = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    city: "Mumbai",
    rating: 4.5,
    roomTypes: [
      {
        id: 101,
        name: "Deluxe Room",
        maxOccupancy: 2,
        totalRooms: 50,
        available: 35,
        held: 10,
        booked: 5,
        rate: 8000,
        amenities: ["AC", "WiFi", "Mini Bar", "Safe"]
      },
      {
        id: 102,
        name: "Suite",
        maxOccupancy: 4,
        totalRooms: 20,
        available: 8,
        held: 8,
        booked: 4,
        rate: 15000,
        amenities: ["AC", "WiFi", "Living Room", "Kitchen", "Safe"]
      }
    ]
  },
  {
    id: 2,
    name: "City Inn",
    city: "Delhi",
    rating: 4.0,
    roomTypes: [
      {
        id: 201,
        name: "Standard Room",
        maxOccupancy: 2,
        totalRooms: 100,
        available: 60,
        held: 25,
        booked: 15,
        rate: 5000,
        amenities: ["AC", "WiFi", "TV"]
      },
      {
        id: 202,
        name: "Executive Room",
        maxOccupancy: 3,
        totalRooms: 30,
        available: 15,
        held: 10,
        booked: 5,
        rate: 7500,
        amenities: ["AC", "WiFi", "Mini Bar", "Work Desk"]
      }
    ]
  },
  {
    id: 3,
    name: "Luxury Suites International",
    city: "Bangalore",
    rating: 5.0,
    roomTypes: [
      {
        id: 301,
        name: "Presidential Suite",
        maxOccupancy: 6,
        totalRooms: 5,
        available: 1,
        held: 2,
        booked: 2,
        rate: 35000,
        amenities: ["AC", "WiFi", "Butler Service", "Private Pool", "Kitchen", "Living Room"]
      }
    ]
  },
  {
    id: 4,
    name: "Beach Resort Goa",
    city: "Goa",
    rating: 4.2,
    roomTypes: [
      {
        id: 401,
        name: "Beach Villa",
        maxOccupancy: 4,
        totalRooms: 25,
        available: 18,
        held: 5,
        booked: 2,
        rate: 12000,
        amenities: ["AC", "WiFi", "Beach Access", "Balcony", "Mini Kitchen"]
      }
    ]
  }
];

class TBOClient {
  constructor() {
    this.baseUrl = TBO_API_URL;
    this.username = TBO_USERNAME;
    this.password = TBO_PASSWORD;
  }

  // Authentication headers for TBO API
  getAuthHeaders() {
    const credentials = btoa(`${this.username}:${this.password}`);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    };
  }

  // Generic API request method
  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        headers: this.getAuthHeaders()
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`TBO API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TBO API request failed:', error);
      // Return mock data as fallback
      return mockHotelData;
    }
  }

  // Get hotel list
  async getHotels() {
    try {
      // For now, return mock data
      // In production, this would call: await this.makeRequest('/Hotels/HotelSearch');
      return mockHotelData;
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
      return mockHotelData;
    }
  }

  // Get hotel details by ID
  async getHotelById(hotelId) {
    try {
      const hotels = await this.getHotels();
      return hotels.find(hotel => hotel.id === hotelId) || null;
    } catch (error) {
      console.error('Failed to fetch hotel details:', error);
      return null;
    }
  }

  // Get room availability
  async getRoomAvailability(hotelId, roomTypeId) {
    try {
      const hotel = await this.getHotelById(hotelId);
      if (!hotel) return null;
      
      const roomType = hotel.roomTypes.find(room => room.id === roomTypeId);
      return roomType || null;
    } catch (error) {
      console.error('Failed to fetch room availability:', error);
      return null;
    }
  }

  // Update room allocation (hold/release)
  async updateRoomAllocation(hotelId, roomTypeId, allocation) {
    try {
      // In production, this would call the actual TBO API
      // For now, simulate the update
      console.log(`Updating allocation for hotel ${hotelId}, room ${roomTypeId}:`, allocation);
      
      // Return success response
      return {
        success: true,
        message: "Room allocation updated successfully",
        data: allocation
      };
    } catch (error) {
      console.error('Failed to update room allocation:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get booking rates
  async getRates(hotelId, roomTypeId, checkIn, checkOut) {
    try {
      const roomType = await this.getRoomAvailability(hotelId, roomTypeId);
      if (!roomType) return null;

      // In production, this would call TBO rate API
      return {
        baseRate: roomType.rate,
        totalRate: roomType.rate,
        currency: 'INR',
        taxes: 0.18 * roomType.rate, // 18% GST
        finalRate: roomType.rate * 1.18
      };
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      return null;
    }
  }

  // Create booking
  async createBooking(bookingData) {
    try {
      // In production, this would call TBO booking API
      console.log('Creating booking:', bookingData);
      
      return {
        success: true,
        bookingId: `BKG${Date.now()}`,
        confirmationNumber: `CONF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'confirmed'
      };
    } catch (error) {
      console.error('Failed to create booking:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// Create and export singleton instance
export const tboAPI = new TBOClient();
export { mockHotelData };
export default tboAPI;
