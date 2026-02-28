/**
 * Guest Preferences API Service
 * Optional service to connect frontend to backend API
 * Can be used in production to replace localStorage-based GuestPreferencesService
 * 
 * To enable: Import this service instead of GuestPreferencesService in Guests.jsx
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001";

// Get stored event ID from localStorage or use the seeded event ID
const getEventId = () => {
  return localStorage.getItem('currentEventId') || '69a16584ef6c5d8dc73f14dd';
};

class GuestPreferencesAPI {
  /**
   * Get authorization header for demo mode
   */
  static getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo_admin_token"
    };
  }

  /**
   * Get all guests from backend by event ID
   */
  static async getAllGuests() {
    try {
      const eventId = getEventId();
      const url = `${API_BASE_URL}/api/guests/demo/${eventId}`;
      console.log('🔍 Fetching guests for event:', eventId);
      console.log('🌐 Full URL:', url);

      // Use public demo endpoint for hackathon (no auth required)
      const response = await fetch(url);
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        console.warn('Demo API failed, falling back to localStorage');
        return this.getLocalGuests();
      }

      const result = await response.json();
      console.log('📊 API Result:', result);
      const guests = result.data || [];
      console.log('👥 Guests from API:', guests.length);

      // If API has guests, use them (sync to localStorage for backup)
      if (guests.length > 0) {
        localStorage.setItem('group_travel_guests', JSON.stringify(guests));
        console.log('✅ Using API guests, synced to localStorage');
        return guests;
      }

      // If no API guests, try localStorage
      console.log('⚠️ No API guests, falling back to localStorage');
      return this.getLocalGuests();
    } catch (error) {
      console.error("❌ Error fetching guests from API:", error);
      console.error("❌ Error details:", error.message);
      console.error("❌ Error stack:", error.stack);
      return this.getLocalGuests();
    }
  }

  /**
   * Fallback to localStorage guests
   */
  static getLocalGuests() {
    const STORAGE_KEY = "group_travel_guests";
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get a single guest by ID
   */
  static async getGuestById(guestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error("Guest not found");
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching guest:", error);
      return null;
    }
  }

  /**
   * Save or update a guest profile
   */
  static async saveGuest(guestData) {
    try {
      console.log('🔍 API: Saving guest with data:', guestData);
      const response = await fetch(`${API_BASE_URL}/api/guests`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(guestData)
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Failed to save guest: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API Save result:', result);

      // Notify subscribers of the alert
      if (result.alert) {
        this.notifySubscribers(result.alert);
      }

      return result.data;
    } catch (error) {
      console.error("❌ Error saving guest:", error);
      throw error;
    }
  }

  /**
   * Delete a guest
   */
  static async deleteGuest(guestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Failed to delete guest: ${response.status} ${errorText}`);
      }
      const result = await response.json();

      // Notify subscribers of the alert
      if (result.alert) {
        this.notifySubscribers(result.alert);
      }

      return true;
    } catch (error) {
      console.error("Error deleting guest:", error);
      throw error;
    }
  }

  /**
   * Get guests by dietary requirement
   */
  static async getGuestsByDietary(dietaryType) {
    const guests = await this.getAllGuests();
    return guests.filter(g => g.dietaryRequirements.includes(dietaryType));
  }

  /**
   * Get guests with special needs
   */
  static async getGuestsWithSpecialNeeds() {
    const guests = await this.getAllGuests();
    return guests.filter(
      g => g.specialNeeds.length > 0 || g.wheelchairAccessible || g.mobilityAssistance
    );
  }

  /**
   * Get dietary requirements summary
   */
  static async getDietarySummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/analytics/dietary`);
      if (!response.ok) throw new Error("Failed to fetch dietary summary");
      const result = await response.json();
      return result.data || {};
    } catch (error) {
      console.error("Error fetching dietary summary:", error);
      return {};
    }
  }

  /**
   * Get special needs summary
   */
  static async getSpecialNeedsSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/analytics/special-needs`);
      if (!response.ok) throw new Error("Failed to fetch special needs summary");
      const result = await response.json();
      return result.data || {};
    } catch (error) {
      console.error("Error fetching special needs summary:", error);
      return {};
    }
  }

  /**
   * Get all alerts
   */
  static async getAllAlerts(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts?limit=${limit}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  }

  /**
   * Dismiss an alert
   */
  static async dismissAlert(alertId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to dismiss alert");
      return true;
    } catch (error) {
      console.error("Error dismissing alert:", error);
      return false;
    }
  }

  /**
   * Clear all alerts
   */
  static async clearAllAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to clear alerts");
      return true;
    } catch (error) {
      console.error("Error clearing alerts:", error);
      return false;
    }
  }

  /**
   * Generate guest report
   */
  static async generateGuestReport() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/report/summary`);
      if (!response.ok) throw new Error("Failed to generate report");
      const result = await response.json();
      return result.data || {};
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }

  /**
   * Export guests as CSV
   */
  static exportGuestsAsCSV(guests) {
    if (guests.length === 0) {
      return "";
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Room Preference",
      "Dietary Requirements",
      "Special Needs",
      "Mobility Assistance",
      "Wheelchair Accessible",
      "Quiet Room",
      "High Floor",
      "Ground Floor",
      "Notes"
    ];

    const rows = guests.map(guest => [
      guest.name,
      guest.email,
      guest.phone,
      guest.roomPreference,
      guest.dietaryRequirements.join(";"),
      guest.specialNeeds.join(";"),
      guest.mobilityAssistance ? "Yes" : "No",
      guest.wheelchairAccessible ? "Yes" : "No",
      guest.quietRoom ? "Yes" : "No",
      guest.highFloor ? "Yes" : "No",
      guest.groundFloor ? "Yes" : "No",
      guest.notes
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    return csv;
  }

  // Subscribers for real-time updates
  static subscribers = [];

  /**
   * Subscribe to guest updates
   */
  static subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of changes
   */
  static notifySubscribers(alert) {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error("Error notifying subscriber:", error);
      }
    });
  }

  /**
   * Setup WebSocket connection for real-time updates (optional)
   * Can be implemented for true real-time updates
   */
  static setupWebSocket() {
    // Example for future WebSocket implementation
    // const ws = new WebSocket(API_BASE_URL.replace('http', 'ws') + '/ws/alerts');
    // ws.onmessage = (event) => {
    //   const alert = JSON.parse(event.data);
    //   this.notifySubscribers(alert);
    // };
  }
}

export default GuestPreferencesAPI;
