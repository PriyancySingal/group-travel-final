/**
 * Guest Preferences Service
 * Handles storage and retrieval of guest profile and preference data
 * Implements real-time update notifications
 */

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "group_travel_guests";
const ALERTS_KEY = "group_travel_alerts";

class GuestPreferencesService {
  /**
   * Get all guests
   */
  static getAllGuests() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving guests:", error);
      return [];
    }
  }

  /**
   * Get a single guest by ID
   */
  static getGuestById(guestId) {
    const guests = this.getAllGuests();
    return guests.find(g => g.id === guestId);
  }

  /**
   * Save or update a guest profile
   * Triggers alert if preference has been updated
   */
  static saveGuest(guestData) {
    try {
      const guests = this.getAllGuests();
      const existingIndex = guests.findIndex(g => g.id === guestData.id);

      let isUpdate = false;
      if (existingIndex >= 0) {
        const oldGuest = guests[existingIndex];
        isUpdate = JSON.stringify(oldGuest) !== JSON.stringify(guestData);
        guests[existingIndex] = guestData;
      } else {
        guests.push(guestData);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));

      // Create alert for preference update
      if (isUpdate) {
        this.createAlert({
          type: "preference_update",
          title: "Guest Preference Updated",
          message: `${guestData.name}'s preferences have been updated`,
          guestName: guestData.name
        });
      } else {
        this.createAlert({
          type: "new_guest",
          title: "New Guest Added",
          message: `${guestData.name} has been added to the guest list`,
          guestName: guestData.name
        });
      }

      // Check for special needs alerts
      if (guestData.specialNeeds.length > 0 || guestData.dietaryRequirements.length > 0) {
        this.createAlert({
          type: "special_needs",
          title: "Special Requirements Noted",
          message: `${guestData.name} has special needs or dietary requirements`,
          guestName: guestData.name
        });
      }

      return guestData;
    } catch (error) {
      console.error("Error saving guest:", error);
      throw error;
    }
  }

  /**
   * Delete a guest
   */
  static deleteGuest(guestId) {
    try {
      const guests = this.getAllGuests();
      const guest = guests.find(g => g.id === guestId);
      const filteredGuests = guests.filter(g => g.id !== guestId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredGuests));

      if (guest) {
        this.createAlert({
          type: "guest_removed",
          title: "Guest Removed",
          message: `${guest.name} has been removed from the guest list`,
          guestName: guest.name
        });
      }

      return true;
    } catch (error) {
      console.error("Error deleting guest:", error);
      return false;
    }
  }

  /**
   * Get guests with specific dietary requirements
   */
  static getGuestsByDietary(dietaryType) {
    const guests = this.getAllGuests();
    return guests.filter(g => g.dietaryRequirements.includes(dietaryType));
  }

  /**
   * Get guests with special needs
   */
  static getGuestsWithSpecialNeeds() {
    const guests = this.getAllGuests();
    return guests.filter(
      g => g.specialNeeds.length > 0 || g.wheelchairAccessible || g.mobilityAssistance
    );
  }

  /**
   * Get dietary requirements summary
   */
  static getDietarySummary() {
    const guests = this.getAllGuests();
    const summary = {};

    guests.forEach(guest => {
      guest.dietaryRequirements.forEach(diet => {
        summary[diet] = (summary[diet] || 0) + 1;
      });
    });

    return summary;
  }

  /**
   * Get special needs summary
   */
  static getSpecialNeedsSummary() {
    const guests = this.getAllGuests();
    return {
      wheelchairAccessible: guests.filter(g => g.wheelchairAccessible).length,
      mobilityAssistance: guests.filter(g => g.mobilityAssistance).length,
      totalGuests: guests.length
    };
  }

  /**
   * Create an alert for planners
   */
  static createAlert(alertData) {
    try {
      const alerts = this.getAllAlerts();
      const alert = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...alertData
      };

      alerts.unshift(alert); // Add to beginning for newest first

      // Keep only last 50 alerts
      if (alerts.length > 50) {
        alerts.pop();
      }

      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

      // Notify subscribers
      this.notifySubscribers(alert);

      return alert;
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  }

  /**
   * Get all alerts
   */
  static getAllAlerts() {
    try {
      const data = localStorage.getItem(ALERTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving alerts:", error);
      return [];
    }
  }

  /**
   * Dismiss an alert
   */
  static dismissAlert(alertId) {
    try {
      const alerts = this.getAllAlerts();
      const filtered = alerts.filter(a => a.id !== alertId);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Error dismissing alert:", error);
      return false;
    }
  }

  /**
   * Clear all alerts
   */
  static clearAllAlerts() {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error("Error clearing alerts:", error);
      return false;
    }
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
   * Export guest data (CSV format)
   */
  static exportGuestsAsCSV() {
    const guests = this.getAllGuests();
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

  /**
   * Generate guest report
   */
  static generateGuestReport() {
    const guests = this.getAllGuests();
    const dietarySummary = this.getDietarySummary();
    const specialNeedsSummary = this.getSpecialNeedsSummary();

    return {
      totalGuests: guests.length,
      dietarySummary,
      specialNeedsSummary,
      guestsList: guests,
      generatedAt: new Date().toISOString()
    };
  }
}

export default GuestPreferencesService;
