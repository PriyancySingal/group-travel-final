/**
 * Guest Preferences Service - Examples & Demo
 * 
 * This file demonstrates how to use the GuestPreferencesService
 * Copy these examples into your components as needed
 */

import GuestPreferencesService from "./GuestPreferencesService";

// ============================================
// EXAMPLE 1: Adding a New Guest
// ============================================
export const addGuestExample = () => {
  const newGuest = {
    id: Date.now(),
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    roomPreference: "deluxe",
    dietaryRequirements: ["Vegetarian", "Gluten-Free"],
    specialNeeds: ["Wheelchair Accessibility"],
    mobilityAssistance: true,
    wheelchairAccessible: true,
    quietRoom: true,
    highFloor: false,
    groundFloor: false,
    notes: "Prefers accessible room near entrance",
    updatedAt: new Date().toISOString()
  };

  const savedGuest = GuestPreferencesService.saveGuest(newGuest);
  console.log("Guest saved:", savedGuest);
};

// ============================================
// EXAMPLE 2: Getting All Guests
// ============================================
export const getAllGuestsExample = () => {
  const guests = GuestPreferencesService.getAllGuests();
  console.log("All guests:", guests);

  // With filter
  const vegetarianGuests = guests.filter(g =>
    g.dietaryRequirements.includes("Vegetarian")
  );
  console.log("Vegetarian guests:", vegetarianGuests);
};

// ============================================
// EXAMPLE 3: Getting Guests with Special Needs
// ============================================
export const getSpecialNeedsGuestsExample = () => {
  const specialNeedsGuests = GuestPreferencesService.getGuestsWithSpecialNeeds();
  console.log("Guests with special needs:", specialNeedsGuests);

  // Group by need type
  const wheelchairAccessible = specialNeedsGuests.filter(g => g.wheelchairAccessible);
  const mobilityAssistance = specialNeedsGuests.filter(g => g.mobilityAssistance);

  console.log("Wheelchair accessible rooms needed:", wheelchairAccessible.length);
  console.log("Mobility assistance needed:", mobilityAssistance.length);
};

// ============================================
// EXAMPLE 4: Getting Dietary Summary
// ============================================
export const getDietarySummaryExample = () => {
  const summary = GuestPreferencesService.getDietarySummary();
  console.log("Dietary requirements summary:", summary);

  // Output:
  // {
  //   "Vegetarian": 5,
  //   "Vegan": 2,
  //   "Gluten-Free": 3,
  //   "Halal": 1
  // }

  // Alert hotel about dietary needs
  Object.entries(summary).forEach(([diet, count]) => {
    console.log(`Need to prepare ${count} ${diet} meals`);
  });
};

// ============================================
// EXAMPLE 5: Subscribing to Real-Time Updates
// ============================================
export const subscribeToUpdatesExample = () => {
  // Subscribe to changes
  const unsubscribe = GuestPreferencesService.subscribe((alert) => {
    console.log("Alert received:", alert);

    // You can now update your UI here
    // Example: Show notification toast
    // showNotification(alert.title, alert.message);

    // Or update UI component
    // setAlerts(prev => [alert, ...prev]);
  });

  // Later, when component unmounts, unsubscribe
  // unsubscribe();
};

// ============================================
// EXAMPLE 6: Creating Custom Alerts
// ============================================
export const createCustomAlertExample = () => {
  GuestPreferencesService.createAlert({
    type: "booking_change",
    title: "Booking Status Updated",
    message: "All guests have confirmed their booking",
    guestName: "Group",
  });

  // Alert will be created with:
  // {
  //   id: 1704067200000,
  //   timestamp: "2024-01-01T10:00:00.000Z",
  //   type: "booking_change",
  //   title: "Booking Status Updated",
  //   message: "All guests have confirmed their booking",
  //   guestName: "Group"
  // }
};

// ============================================
// EXAMPLE 7: Exporting Guest Data
// ============================================
export const exportGuestDataExample = () => {
  const csv = GuestPreferencesService.exportGuestsAsCSV();

  // Download the CSV file
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
  );
  element.setAttribute(
    "download",
    `guests-${new Date().toISOString().split("T")[0]}.csv`
  );
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  console.log("CSV exported successfully");
};

// ============================================
// EXAMPLE 8: Generating Reports
// ============================================
export const generateReportExample = () => {
  const report = GuestPreferencesService.generateGuestReport();

  console.log("Guest Report Generated:");
  console.log("Total Guests:", report.totalGuests);
  console.log("Dietary Summary:", report.dietarySummary);
  console.log("Special Needs Summary:", report.specialNeedsSummary);

  // Send to server
  // fetch('/api/reports', {
  //   method: 'POST',
  //   body: JSON.stringify(report)
  // });
};

// ============================================
// EXAMPLE 9: Handling Dietary Requirements for Hotel
// ============================================
export const hotelMealPlanningExample = () => {
  const guests = GuestPreferencesService.getAllGuests();
  const dietarySummary = GuestPreferencesService.getDietarySummary();

  // Create meal plan message for hotel
  const mealPlanMessage = {
    checkInDate: "2024-02-15",
    totalGuests: guests.length,
    mealRequirements: ditarySummary,
    specialInstructions: guests
      .filter(g => g.notes)
      .map(g => ({ name: g.name, notes: g.notes }))
  };

  console.log("Meal Plan for Hotel:", mealPlanMessage);

  // Send to hotel
  // coordinator.sendToHotel(mealPlanMessage);
};

// ============================================
// EXAMPLE 10: Room Assignment Based on Preferences
// ============================================
export const roomAssignmentExample = () => {
  const guests = GuestPreferencesService.getAllGuests();

  // Group by accessibility needs
  const accessibleRooms = guests.filter(g => g.wheelchairAccessible);
  const quietRooms = guests.filter(g => g.quietRoom && !g.wheelchairAccessible);
  const standardRooms = guests.filter(
    g => !g.wheelchairAccessible && !g.quietRoom
  );

  console.log("Room Assignment Plan:");
  console.log(`Accessible rooms needed: ${accessibleRooms.length}`);
  console.log(`Quiet rooms needed: ${quietRooms.length}`);
  console.log(`Standard rooms needed: ${standardRooms.length}`);

  // Assign rooms based on preferences
  const roomAssignments = {
    accessible: accessibleRooms.map(g => ({
      guestName: g.name,
      roomType: "Accessible",
      floorPreference: g.groundFloor ? "Ground" : "Any"
    })),
    quiet: quietRooms.map(g => ({
      guestName: g.name,
      roomType: "Quiet",
      floorPreference: g.highFloor ? "High" : g.groundFloor ? "Ground" : "Any"
    }))
  };

  console.log("Room Assignments:", roomAssignments);
};

// ============================================
// EXAMPLE 11: Usage in React Component
// ============================================
export const ReactComponentExample = () => {
  // This is how you'd use it in a React component:

  /*
  import { useState, useEffect } from 'react';
  import GuestPreferencesService from './GuestPreferencesService';

  function MyComponent() {
    const [guests, setGuests] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
      // Load initial data
      setGuests(GuestPreferencesService.getAllGuests());
      setAlerts(GuestPreferencesService.getAllAlerts());

      // Subscribe to updates
      const unsubscribe = GuestPreferencesService.subscribe((alert) => {
        setAlerts(prev => [alert, ...prev]);
      });

      return unsubscribe; // Cleanup on unmount
    }, []);

    const handleAddGuest = (guestData) => {
      GuestPreferencesService.saveGuest(guestData);
      setGuests(GuestPreferencesService.getAllGuests());
    };

    const handleDeleteGuest = (guestId) => {
      GuestPreferencesService.deleteGuest(guestId);
      setGuests(GuestPreferencesService.getAllGuests());
    };

    return (
      <div>
        <h1>Guests ({guests.length})</h1>
        {guests.map(guest => (
          <div key={guest.id}>
            <h2>{guest.name}</h2>
            <p>Dietary: {guest.dietaryRequirements.join(", ")}</p>
            {guest.specialNeeds.length > 0 && (
              <p>Special Needs: {guest.specialNeeds.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
  */
};

// ============================================
// EXAMPLE 12: Mass Import Guests
// ============================================
export const massImportExample = () => {
  const guestsToImport = [
    {
      id: 1,
      name: "Guest 1",
      email: "guest1@example.com",
      phone: "+1-555-0001",
      roomPreference: "standard",
      dietaryRequirements: [],
      specialNeeds: [],
      mobilityAssistance: false,
      wheelchairAccessible: false,
      quietRoom: false,
      highFloor: false,
      groundFloor: false,
      notes: "",
      updatedAt: new Date().toISOString()
    },
    // ... more guests
  ];

  // Save all guests
  guestsToImport.forEach(guest => {
    GuestPreferencesService.saveGuest(guest);
  });

  console.log(`Imported ${guestsToImport.length} guests`);
};

// ============================================
// EXAMPLE 13: Filtering & Sorting Guests
// ============================================
export const filterAndSortExample = () => {
  const guests = GuestPreferencesService.getAllGuests();

  // Filter by special needs
  const needsAccessibility = guests.filter(g => g.wheelchairAccessible);

  // Filter by dietary requirement
  const vegetarian = guests.filter(g =>
    g.dietaryRequirements.includes("Vegetarian")
  );

  // Sort by name
  const sortedByName = [...guests].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Sort by most special needs
  const sortedByNeeds = [...guests].sort(
    (a, b) => b.specialNeeds.length - a.specialNeeds.length
  );

  console.log("Filtered & Sorted Results:");
  console.log("Needs accessibility:", needsAccessibility.length);
  console.log("Vegetarian guests:", vegetarian.length);
  console.log("Sorted by name:", sortedByName.map(g => g.name));
};

// ============================================
// EXAMPLE 14: Alert Management
// ============================================
export const alertManagementExample = () => {
  // Get all alerts
  const allAlerts = GuestPreferencesService.getAllAlerts();
  console.log("Total alerts:", allAlerts.length);

  // Filter by type
  const preferenceUpdates = allAlerts.filter(a => a.type === "preference_update");
  console.log("Preference updates:", preferenceUpdates.length);

  // Dismiss specific alert
  if (allAlerts.length > 0) {
    GuestPreferencesService.dismissAlert(allAlerts[0].id);
    console.log("Alert dismissed");
  }

  // Clear all alerts
  // GuestPreferencesService.clearAllAlerts();
};

// ============================================
// EXAMPLE 15: Data Validation
// ============================================
export const dataValidationExample = () => {
  const guests = GuestPreferencesService.getAllGuests();

  // Validate email format
  const validEmails = guests.filter(g =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email)
  );

  // Validate phone format
  const validPhones = guests.filter(g => /^\+?[\d\s\-()]{10,}$/.test(g.phone));

  // Check for required fields
  const complete = guests.filter(g => g.name && g.email);

  console.log("Data Quality Report:");
  console.log(`Total guests: ${guests.length}`);
  console.log(`Valid emails: ${validEmails.length}`);
  console.log(`Valid phones: ${validPhones.length}`);
  console.log(`Complete profiles: ${complete.length}`);
};

// ============================================
// Run Examples
// ============================================

// Uncomment to run examples:
// addGuestExample();
// getAllGuestsExample();
// getSpecialNeedsGuestsExample();
// getDietarySummaryExample();
// subscribeToUpdatesExample();
// createCustomAlertExample();
// exportGuestDataExample();
// generateReportExample();
// hotelMealPlanningExample();
// roomAssignmentExample();
// filterAndSortExample();
// alertManagementExample();
// dataValidationExample();

export default {
  addGuestExample,
  getAllGuestsExample,
  getSpecialNeedsGuestsExample,
  getDietarySummaryExample,
  subscribeToUpdatesExample,
  createCustomAlertExample,
  exportGuestDataExample,
  generateReportExample,
  hotelMealPlanningExample,
  roomAssignmentExample,
  filterAndSortExample,
  alertManagementExample,
  dataValidationExample
};
