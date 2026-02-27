// // // /**
// // //  * Event Coordination Service
// // //  * Manages event microsites, itineraries, schedules, and personalized guest information
// // //  * Handles centralized coordination for group events (weddings, conferences, MICE)
// // //  */
// // // const BASE_URL = "http://localhost:5001/api/events";

// // // class EventCoordinationService {
// // //   static events = [
// // //     {
// // //       id: 1,
// // //       name: "Sharma–Verma Wedding",
// // //       type: "wedding",
// // //       description: "Destination wedding with 200+ guests",
// // //       location: "Gangtok, Sikkim",
// // //       startDate: "2024-12-20",
// // //       endDate: "2024-12-22",
// // //       status: "confirmed",
// // //       organizer: "Priya Sharma",
// // //       logo: "💍",
// // //       hotel: "Grand Himalayan Resort",
// // //       guestCount: 230,
// // //       budget: "₹50,00,000"
// // //     },
// // //     {
// // //       id: 2,
// // //       name: "TechConf 2024",
// // //       type: "conference",
// // //       description: "International Tech Conference with 500+ attendees",
// // //       location: "Bangalore, India",
// // //       startDate: "2024-11-15",
// // //       endDate: "2024-11-17",
// // //       status: "confirmed",
// // //       organizer: "Tech India Inc.",
// // //       logo: "💻",
// // //       hotel: "Bangalore Convention Center",
// // //       guestCount: 520,
// // //       budget: "₹1,50,00,000"
// // //     },
// // //     {
// // //       id: 3,
// // //       name: "Annual MICE Retreat",
// // //       type: "mice",
// // //       description: "Corporate team building and networking event",
// // //       location: "Goa, India",
// // //       startDate: "2024-10-10",
// // //       endDate: "2024-10-13",
// // //       status: "planning",
// // //       organizer: "Corporate Events Ltd.",
// // //       logo: "🏢",
// // //       hotel: "Taj Exotica Resort",
// // //       guestCount: 150,
// // //       budget: "₹25,00,000"
// // //     }
// // //   ];

// // //   static schedules = [
// // //     {
// // //       id: 1,
// // //       eventId: 1,
// // //       day: 1,
// // //       date: "2024-12-20",
// // //       title: "Arrival & Welcome",
// // //       activities: [
// // //         { time: "14:00-16:00", name: "Guest Arrival & Check-in", location: "Grand Himalayan Resort" },
// // //         { time: "17:00-18:00", name: "Welcome Tea", location: "Grand Ballroom" },
// // //         { time: "19:00-21:00", name: "Welcome Dinner", location: "Grand Dining Hall", dietary: true }
// // //       ]
// // //     },
// // //     {
// // //       id: 2,
// // //       eventId: 1,
// // //       day: 2,
// // //       date: "2024-12-21",
// // //       title: "Wedding Day",
// // //       activities: [
// // //         { time: "08:00-09:00", name: "Breakfast", location: "Hotel Restaurant" },
// // //         { time: "09:00-14:00", name: "Pre-Wedding Photography", location: "Hotel Gardens" },
// // //         { time: "14:00-15:30", name: "Lunch", location: "Multi-Cuisine Restaurant", dietary: true },
// // //         { time: "17:00-19:00", name: "Wedding Ceremony", location: "Grand Lawn", formal: true },
// // //         { time: "19:00-22:00", name: "Wedding Reception", location: "Grand Ballroom", dietary: true }
// // //       ]
// // //     }
// // //   ];

// // //   static itineraries = {
// // //     1: { guestId: 1, eventId: 1, personalItinerary: [
// // //       { day: 1, activity: "Arrival at 14:30", notes: "Room 501, Deluxe Double" },
// // //       { day: 2, activity: "Wedding Ceremony at 17:00", notes: "Formal attire required" },
// // //       { day: 3, activity: "Checkout at 12:00", notes: "Hotel checkout time" }
// // //     ]},
// // //     2: { guestId: 2, eventId: 1, personalItinerary: [
// // //       { day: 1, activity: "Arrival at 16:00", notes: "Room 502, Deluxe Double" },
// // //       { day: 2, activity: "Wedding Ceremony at 17:00", notes: "Formal attire. Dietary: Vegetarian" }
// // //     ]}
// // //   };

// // //   static guestPersonalization = {
// // //     1: {
// // //       guestId: 1,
// // //       eventId: 1,
// // //       name: "Rajesh Kumar",
// // //       email: "rajesh@example.com",
// // //       hotelAssignment: {
// // //         hotel: "Grand Himalayan Resort",
// // //         roomNumber: "501",
// // //         roomType: "Deluxe Double",
// // //         floor: 5,
// // //         checkIn: "2024-12-20 14:00",
// // //         checkOut: "2024-12-22 12:00"
// // //       },
// // //       diningPreferences: ["Vegetarian", "No Onion", "No Garlic"],
// // //       specialRequests: "Ground floor preferred",
// // //       transportationNeeds: "Airport pickup required",
// // //       accessibility: "Wheelchair accessible room",
// // //       emergencyContact: "+91-9876543210",
// // //       dietaryRestrictions: ["Vegetarian"]
// // //     },
// // //     2: {
// // //       guestId: 2,
// // //       eventId: 1,
// // //       name: "Priya Sharma",
// // //       email: "priya@example.com",
// // //       hotelAssignment: {
// // //         hotel: "Grand Himalayan Resort",
// // //         roomNumber: "502",
// // //         roomType: "Deluxe Double",
// // //         floor: 5,
// // //         checkIn: "2024-12-20 13:30",
// // //         checkOut: "2024-12-22 12:00"
// // //       },
// // //       diningPreferences: ["Vegan", "Gluten-Free"],
// // //       specialRequests: "High floor preferred - city view",
// // //       transportationNeeds: "Airport pickup required",
// // //       accessibility: null,
// // //       emergencyContact: "+91-9876543211",
// // //       dietaryRestrictions: ["Vegan", "Gluten-Free"]
// // //     }
// // //   };

// // //   static updates = [
// // //     { id: 1, eventId: 1, timestamp: new Date("2024-12-15T10:30:00"), type: "schedule", message: "Dinner time updated from 8:00 PM to 8:30 PM", severity: "info", read: false },
// // //     { id: 2, eventId: 1, timestamp: new Date("2024-12-14T14:20:00"), type: "accommodation", message: "Room upgrade available for guests in Block A", severity: "success", read: false },
// // //     { id: 3, eventId: 1, timestamp: new Date("2024-12-13T09:15:00"), type: "activity", message: "Pre-wedding photo session rescheduled to 9:00 AM", severity: "warning", read: false },
// // //     { id: 4, eventId: 1, timestamp: new Date("2024-12-12T16:45:00"), type: "transport", message: "Airport shuttle schedule confirmed", severity: "info", read: true }
// // //   ];

// // //   /**
// // //    * Get event by ID
// // //    */
// // //   static getEventById(eventId) {
// // //     return this.events.find(e => e.id === eventId);
// // //   }

// // //   /**
// // //    * Get all events
// // //    */
// // //   static async getAllEvents() {
// // //   const token = localStorage.getItem("token");

// // //   const res = await fetch(BASE_URL, {
// // //     headers: {
// // //       Authorization: `Bearer ${token}`
// // //     }
// // //   });

// // //   if (!res.ok) throw new Error("Failed to fetch events");
// // //   return await res.json();
// // // }


// // //   /**
// // //    * Get event schedule
// // //    */
// // //   static getEventSchedule(eventId) {
// // //     return this.schedules.filter(s => s.eventId === eventId);
// // //   }

// // //   /**
// // //    * Get guest's personalized itinerary
// // //    */
// // //   static getGuestItinerary(guestId, eventId) {
// // //     return this.itineraries[guestId] || null;
// // //   }

// // //   /**
// // //    * Get guest personalization details
// // //    */
// // //   static getGuestPersonalization(guestId, eventId) {
// // //     return this.guestPersonalization[guestId] || null;
// // //   }

// // //   /**
// // //    * Get real-time updates for event
// // //    */
// // //   static getEventUpdates(eventId) {
// // //     return this.updates.filter(u => u.eventId === eventId).sort((a, b) => b.timestamp - a.timestamp);
// // //   }

// // //   /**
// // //    * Add new update to event (simulates real-time push)
// // //    */
// // //   static addEventUpdate(eventId, updateData) {
// // //     const newUpdate = {
// // //       id: Math.max(...this.updates.map(u => u.id), 0) + 1,
// // //       eventId,
// // //       timestamp: new Date(),
// // //       ...updateData
// // //     };
// // //     this.updates.unshift(newUpdate);
// // //     this.notifyUpdateSubscribers(newUpdate);
// // //     return newUpdate;
// // //   }

// // //   /**
// // //    * Mark update as read
// // //    */
// // //   static markUpdateAsRead(updateId) {
// // //     const update = this.updates.find(u => u.id === updateId);
// // //     if (update) {
// // //       update.read = true;
// // //     }
// // //   }

// // //   /**
// // //    * Get event statistics
// // //    */
// // //   static getEventStats(eventId) {
// // //     const event = this.getEventById(eventId);
// // //     const schedule = this.getEventSchedule(eventId);
// // //     const updates = this.getEventUpdates(eventId);

// // //     return {
// // //       eventName: event?.name,
// // //       totalGuests: event?.guestCount || 0,
// // //       totalActivities: schedule.reduce((sum, day) => sum + day.activities.length, 0),
// // //       totalDays: schedule.length,
// // //       unreadUpdates: updates.filter(u => !u.read).length,
// // //       lastUpdate: updates[0]?.timestamp || null
// // //     };
// // //   }

// // //   /**
// // //    * Get all guest information for event
// // //    */
// // //   static getEventGuests(eventId) {
// // //     return Object.values(this.guestPersonalization).filter(
// // //       g => g.eventId === eventId
// // //     );
// // //   }

// // //   /**
// // //    * Update guest preferences
// // //    */
// // //   static updateGuestPreferences(guestId, preferences) {
// // //     if (this.guestPersonalization[guestId]) {
// // //       this.guestPersonalization[guestId] = {
// // //         ...this.guestPersonalization[guestId],
// // //         ...preferences
// // //       };
// // //       return this.guestPersonalization[guestId];
// // //     }
// // //     return null;
// // //   }

// // //   /**
// // //    * Get dietary requirements summary
// // //    */
// // //   static getDietarySummary(eventId) {
// // //     const guests = this.getEventGuests(eventId);
// // //     const dietary = {};

// // //     guests.forEach(guest => {
// // //       guest.dietaryRestrictions.forEach(restriction => {
// // //         dietary[restriction] = (dietary[restriction] || 0) + 1;
// // //       });
// // //     });

// // //     return dietary;
// // //   }

// // //   /**
// // //    * Get accessibility requirements summary
// // //    */
// // //   static getAccessibilitySummary(eventId) {
// // //     const guests = this.getEventGuests(eventId);

// // //     return {
// // //       wheelchairAccessible: guests.filter(g => g.hotelAssignment?.wheelchairAccessible).length,
// // //       mobilityAssistance: guests.filter(g => g.accessibility && g.accessibility.includes("Mobility")).length,
// // //       groundFloor: guests.filter(g => g.hotelAssignment?.floor === 1).length,
// // //       specialRequests: guests.filter(g => g.specialRequests).length
// // //     };
// // //   }

// // //   // Subscribers for real-time updates
// // //   static updateSubscribers = [];

// // //   /**
// // //    * Subscribe to event updates
// // //    */
// // //   static subscribeToUpdates(callback) {
// // //     this.updateSubscribers.push(callback);
// // //     return () => {
// // //       this.updateSubscribers = this.updateSubscribers.filter(cb => cb !== callback);
// // //     };
// // //   }

// // //   /**
// // //    * Notify subscribers of new updates
// // //    */
// // //   static notifyUpdateSubscribers(update) {
// // //     this.updateSubscribers.forEach(callback => {
// // //       try {
// // //         callback(update);
// // //       } catch (error) {
// // //         console.error("Error notifying update subscriber:", error);
// // //       }
// // //     });
// // //   }

// // //   /**
// // //    * Export event data as JSON
// // //    */
// // //   static exportEventData(eventId) {
// // //     return {
// // //       event: this.getEventById(eventId),
// // //       schedule: this.getEventSchedule(eventId),
// // //       guests: this.getEventGuests(eventId),
// // //       updates: this.getEventUpdates(eventId),
// // //       dietary: this.getDietarySummary(eventId),
// // //       accessibility: this.getAccessibilitySummary(eventId)
// // //     };
// // //   }

// // //   /**
// // //    * Export event data as CSV
// // //    */
// // //   static exportEventAsCSV(eventId) {
// // //     const guests = this.getEventGuests(eventId);

// // //     if (guests.length === 0) return "";

// // //     const headers = [
// // //       "Guest Name",
// // //       "Email",
// // //       "Room Number",
// // //       "Room Type",
// // //       "Check-in",
// // //       "Dietary Requirements",
// // //       "Special Requests",
// // //       "Emergency Contact"
// // //     ];

// // //     const rows = guests.map(guest => [
// // //       guest.name,
// // //       guest.email,
// // //       guest.hotelAssignment?.roomNumber || "N/A",
// // //       guest.hotelAssignment?.roomType || "N/A",
// // //       guest.hotelAssignment?.checkIn || "N/A",
// // //       guest.dietaryRestrictions?.join(";") || "None",
// // //       guest.specialRequests || "None",
// // //       guest.emergencyContact
// // //     ]);

// // //     const csv = [
// // //       headers.join(","),
// // //       ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
// // //     ].join("\n");

// // //     return csv;
// // //   }

// // //   /**
// // //    * ADMIN METHODS - Event Management CRUD Operations
// // //    */

// // //   /**
// // //    * Get all events with optional filtering
// // //    */
// // //   static getAllEvents(filter = {}) {
// // //     return this.events.filter(event => {
// // //       if (filter.type && event.type !== filter.type) return false;
// // //       if (filter.status && event.status !== filter.status) return false;
// // //       if (filter.search) {
// // //         const search = filter.search.toLowerCase();
// // //         return event.name.toLowerCase().includes(search) || 
// // //                event.location.toLowerCase().includes(search);
// // //       }
// // //       return true;
// // //     });
// // //   }

// // //   /**
// // //    * Create a new event
// // //    */
// // //   static async createEvent(eventData) {
// // //   const token = localStorage.getItem("token");

// // //   const res = await fetch(BASE_URL, {
// // //     method: "POST",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //       Authorization: `Bearer ${token}`
// // //     },
// // //     body: JSON.stringify(eventData)
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to create event");
// // //   }

// // //   return await res.json();
// // // }


// // //   /**
// // //    * Update an existing event
// // //    */
// // //   static updateEvent(eventId, eventData) {
// // //     const index = this.events.findIndex(e => e.id === eventId);
// // //     if (index === -1) throw new Error("Event not found");

// // //     const updatedEvent = {
// // //       ...this.events[index],
// // //       ...eventData,
// // //       updatedAt: new Date().toISOString()
// // //     };
// // //     this.events[index] = updatedEvent;
// // //     this.notifyAdminSubscribers({ action: 'update', event: updatedEvent });
// // //     return updatedEvent;
// // //   }

// // //   /**
// // //    * Delete an event
// // //    */
// // //   static deleteEvent(eventId) {
// // //     const index = this.events.findIndex(e => e.id === eventId);
// // //     if (index === -1) throw new Error("Event not found");

// // //     const deletedEvent = this.events[index];
// // //     this.events.splice(index, 1);
// // //     this.notifyAdminSubscribers({ action: 'delete', eventId });
// // //     return deletedEvent;
// // //   }

// // //   /**
// // //    * Get event statistics
// // //    */
// // //   static getEventStats() {
// // //     return {
// // //       totalEvents: this.events.length,
// // //       confirmedEvents: this.events.filter(e => e.status === 'confirmed').length,
// // //       planningEvents: this.events.filter(e => e.status === 'planning').length,
// // //       totalGuests: this.events.reduce((sum, e) => sum + e.guestCount, 0),
// // //       totalBudget: this.calculateTotalBudget(),
// // //       eventsByType: this.groupEventsByType()
// // //     };
// // //   }

// // //   /**
// // //    * Calculate total budget
// // //    */
// // //   static calculateTotalBudget() {
// // //     return this.events.reduce((sum, event) => {
// // //       const amount = parseInt(event.budget?.replace(/[₹,]/g, '')) || 0;
// // //       return sum + amount;
// // //     }, 0);
// // //   }

// // //   /**
// // //    * Group events by type
// // //    */
// // //   static groupEventsByType() {
// // //     const types = {};
// // //     this.events.forEach(event => {
// // //       types[event.type] = (types[event.type] || 0) + 1;
// // //     });
// // //     return types;
// // //   }

// // //   /**
// // //    * Admin subscribers for real-time updates
// // //    */
// // //   static adminSubscribers = [];

// // //   static subscribeToAdminUpdates(callback) {
// // //     this.adminSubscribers.push(callback);
// // //     return () => {
// // //       const index = this.adminSubscribers.indexOf(callback);
// // //       if (index > -1) this.adminSubscribers.splice(index, 1);
// // //     };
// // //   }

// // //   static notifyAdminSubscribers(update) {
// // //     this.adminSubscribers.forEach(callback => {
// // //       try {
// // //         callback(update);
// // //       } catch (error) {
// // //         console.error("Error notifying admin subscriber:", error);
// // //       }
// // //     });
// // //   }
// // // }

// // // export default EventCoordinationService;

// /**
//  * Event Coordination Service
//  * HYBRID MODE:
//  * - Demo events (always visible)
//  * - Backend events (MongoDB)
//  */

// const BASE_URL = import.meta.env.VITE_API_URL;

// class EventCoordinationService {
//   /* =======================
//      DEMO EVENTS (FRONTEND)
//   ======================= */
//   static demoEvents = [
//     {
//       id: "demo-1",
//       name: "Sharma–Verma Wedding",
//       type: "wedding",
//       description: "Destination wedding with 200+ guests",
//       location: "Gangtok, Sikkim",
//       startDate: "2024-12-20",
//       endDate: "2024-12-22",
//       status: "confirmed",
//       organizer: "Priya Sharma",
//       logo: "💍",
//       hotel: "Grand Himalayan Resort",
//       guestCount: 230,
//       budget: "₹50,00,000"
//     },
//     {
//       id: "demo-2",
//       name: "TechConf 2024",
//       type: "conference",
//       description: "International Tech Conference",
//       location: "Bangalore, India",
//       startDate: "2024-11-15",
//       endDate: "2024-11-17",
//       status: "confirmed",
//       organizer: "Tech India Inc.",
//       logo: "💻",
//       guestCount: 520,
//       budget: "₹1,50,00,000"
//     },
//     {
//       id: "demo-3",
//       name: "Annual MICE Retreat",
//       type: "mice",
//       description: "Corporate team building event",
//       location: "Goa, India",
//       startDate: "2024-10-10",
//       endDate: "2024-10-13",
//       status: "planning",
//       organizer: "Corporate Events Ltd.",
//       logo: "🏢",
//       guestCount: 150,
//       budget: "₹25,00,000"
//     }
//   ];

//   /* =======================
//      BACKEND FETCH
//   ======================= */
//   static async fetchBackendEvents() {
//     const authUser = JSON.parse(localStorage.getItem("auth_user"));
//     const token = authUser?.token;

//     if (!token) {
//       throw new Error("No auth token found");
//     }

//     const res = await fetch(BASE_URL, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch backend events");
//     }

//     const data = await res.json();

//     return data.map(e => ({
//       ...e,
//       id: e._id
//     }));
//   }

//   /* =======================
//      PUBLIC: GET ALL EVENTS
//   ======================= */
//   static async getAllEvents() {
//     let backendEvents = [];

//     try {
//       backendEvents = await this.fetchBackendEvents();
//     } catch (err) {
//       console.warn("Backend unavailable, demo events only");
//     }

//     return [
//       ...this.demoEvents,
//       ...backendEvents
//     ];
//   }

//   /* =======================
//      CREATE EVENT (BACKEND)
//   ======================= */
//   static async createEvent(eventData) {
//     const authUser = JSON.parse(localStorage.getItem("auth_user"));
//     const token = authUser?.token;

//     if (!token) {
//       throw new Error("No auth token found");
//     }

//     const res = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(eventData)
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.error || "Failed to create event");
//     }

//     return await res.json();
//   }

//   /* =======================
//      STATS
//   ======================= */
//   static getEventStats(events = []) {
//     return {
//       totalEvents: events.length,
//       confirmedEvents: events.filter(e => e.status === "confirmed").length,
//       planningEvents: events.filter(e => e.status === "planning").length,
//       totalGuests: events.reduce((sum, e) => sum + e.guestCount, 0)
//     };
//   }
// }

// export default EventCoordinationService;
const BASE_URL = import.meta.env.VITE_API_URL;

class EventCoordinationService {
  /* =======================
     DEMO EVENTS (FRONTEND)
  ======================= */
  static demoEvents = [
    {
      id: "demo-1",
      name: "Sharma–Verma Wedding",
      type: "wedding",
      description: "Destination wedding with 200+ guests",
      location: "Gangtok, Sikkim",
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      status: "confirmed",
      organizer: "Priya Sharma",
      logo: "💍",
      hotel: "Grand Himalayan Resort",
      guestCount: 230,
      budget: "₹50,00,000",
      isDemo: true   // 👈 ADD THIS LINE
    },
    {
      id: "demo-2",
      name: "TechConf 2024",
      type: "conference",
      description: "International Tech Conference",
      location: "Bangalore, India",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      status: "confirmed",
      organizer: "Tech India Inc.",
      logo: "💻",
      guestCount: 520,
      budget: "₹1,50,00,000",
      isDemo: true   // 👈 ADD THIS LINE
    },
    {
      id: "demo-3",
      name: "Annual MICE Retreat",
      type: "mice",
      description: "Corporate team building event",
      location: "Goa, India",
      startDate: "2024-10-10",
      endDate: "2024-10-13",
      status: "planning",
      organizer: "Corporate Events Ltd.",
      logo: "🏢",
      guestCount: 150,
      budget: "₹25,00,000",
      isDemo: true   // 👈 ADD THIS LINE
    }
  ];/* =======================
   DEMO SCHEDULES
======================= */
  static demoSchedules = [

    /* ================= DEMO 1 ================= */
    {
      eventId: "demo-1",
      day: 1,
      date: "2024-12-20",
      title: "Arrival & Welcome",
      activities: [
        {
          time: "14:00-16:00",
          name: "Guest Arrival & Check-in",
          location: "Grand Himalayan Resort"
        },
        {
          time: "17:00-18:00",
          name: "Welcome Tea",
          location: "Grand Ballroom"
        },
        {
          time: "19:00-21:00",
          name: "Welcome Dinner",
          location: "Grand Dining Hall",
          note: "🍽️ Dietary Preferences Apply"
        }
      ]
    },
    {
      eventId: "demo-1",
      day: 2,
      date: "2024-12-21",
      title: "Wedding Day",
      activities: [
        {
          time: "08:00-09:00",
          name: "Breakfast",
          location: "Hotel Restaurant"
        },
        {
          time: "09:00-14:00",
          name: "Pre-Wedding Photography",
          location: "Hotel Gardens"
        },
        {
          time: "14:00-15:30",
          name: "Lunch",
          location: "Multi-Cuisine Restaurant",
          note: "🍽️ Dietary Preferences Apply"
        },
        {
          time: "17:00-19:00",
          name: "Wedding Ceremony",
          location: "Grand Lawn",
          note: "👔 Formal Attire"
        },
        {
          time: "19:00-22:00",
          name: "Wedding Reception",
          location: "Grand Ballroom",
          note: "🍽️ Dietary Preferences Apply"
        }
      ]
    },

    /* ================= DEMO 2 ================= */
    {
      eventId: "demo-2",
      day: 1,
      date: "2024-11-15",
      title: "Conference Opening",
      activities: [
        {
          time: "09:00-10:00",
          name: "Registration",
          location: "Bangalore International Convention Centre"
        },
        {
          time: "10:00-11:30",
          name: "Keynote Session",
          location: "Main Auditorium"
        },
        {
          time: "12:00-13:00",
          name: "Networking Lunch",
          location: "Expo Hall",
          note: "🍽️ Buffet Lunch"
        }
      ]
    },

    /* ================= DEMO 3 ================= */
    {
      eventId: "demo-3",
      day: 1,
      date: "2024-10-10",
      title: "Corporate Team Building",
      activities: [
        {
          time: "09:00-11:00",
          name: "Icebreaker Activities",
          location: "Goa Beach Lawn"
        },
        {
          time: "11:30-13:00",
          name: "Leadership Workshop",
          location: "Conference Hall A"
        },
        {
          time: "18:00-21:00",
          name: "Beachside Gala Dinner",
          location: "Beach Resort",
          note: "👔 Semi-Formal Attire"
        }
      ]
    }

  ];
  /* =======================
     DEMO UPDATES
  ======================= */
  static demoUpdates = [

    /* ================= DEMO 1 ================= */
    {
      id: 1,
      eventId: "demo-1",
      type: "schedule",
      icon: "ℹ️",
      severity: "info",
      date: "12/15/2024",
      message: "Dinner time updated from 8:00 PM to 8:30 PM",
      timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      read: false
    },
    {
      id: 2,
      eventId: "demo-1",
      type: "accommodation",
      icon: "✅",
      severity: "success",
      date: "12/14/2024",
      message: "Room upgrade available for guests in Block A",
      timestamp: Date.now() - 7200000, // 2 hours ago
      read: false
    },
    {
      id: 3,
      eventId: "demo-1",
      type: "activity",
      icon: "⚠️",
      severity: "warning",
      date: "12/13/2024",
      message: "Pre-wedding photo session rescheduled to 9:00 AM",
      timestamp: Date.now() - 45 * 60 * 1000, // 45 minutes ago
      read: false
    },
    {
      id: 4,
      eventId: "demo-1",
      type: "transport",
      icon: "ℹ️",
      severity: "info",
      date: "12/12/2024",
      message: "Airport shuttle schedule confirmed",
      timestamp: Date.now() - 6 * 60 * 60 * 1000,
      read: false
    },

    /* ================= DEMO 2 ================= */
    {
      id: 5,
      eventId: "demo-2",
      type: "conference",
      icon: "ℹ️",
      severity: "info",
      date: "11/14/2024",
      message: "Keynote speaker changed to CTO of Tech India",
      timestamp: Date.now() - 3600000,
      read: false
    },
    {
      id: 6,
      eventId: "demo-2",
      type: "logistics",
      icon: "⚠️",
      severity: "warning",
      date: "11/13/2024",
      message: "Registration desk moved to Gate 2",
      timestamp: Date.now() - 7200000,
      read: false
    },

    /* ================= DEMO 3 ================= */
    {
      id: 7,
      eventId: "demo-3",
      type: "activity",
      icon: "ℹ️",
      severity: "info",
      date: "10/09/2024",
      message: "Beach volleyball moved to 4:00 PM",
      timestamp: Date.now() - 3600000,
      read: false
    },
    {
      id: 8,
      eventId: "demo-3",
      type: "transport",
      icon: "✅",
      severity: "success",
      date: "10/08/2024",
      message: "Airport pickup timings confirmed",
      timestamp: Date.now() - 7200000,
      read: false
    }

  ];

  /* =======================
     DEMO ITINERARY
  ======================= */
  static demoItineraries = {

    /* ================= DEMO 1 ================= */
    "demo-1": [
      {
        day: 1,
        title: "Arrival at 14:30",
        note: "Room 501, Deluxe Double"
      },
      {
        day: 2,
        title: "Wedding Ceremony at 17:00",
        note: "Formal attire required"
      },
      {
        day: 3,
        title: "Checkout at 12:00",
        note: "Hotel checkout time"
      }
    ],

    /* ================= DEMO 2 ================= */
    "demo-2": [
      {
        day: 1,
        title: "Conference Registration at 09:00",
        note: "Collect badge at Gate 2"
      },
      {
        day: 2,
        title: "Keynote at 10:00",
        note: "Main Auditorium"
      },
      {
        day: 3,
        title: "Networking Lunch at 13:00",
        note: "Business Lounge"
      }
    ],

    /* ================= DEMO 3 ================= */
    "demo-3": [
      {
        day: 1,
        title: "Team Arrival & Beach Welcome",
        note: "Resort Check-in"
      },
      {
        day: 2,
        title: "Corporate Workshop",
        note: "Conference Hall A"
      },
      {
        day: 3,
        title: "Checkout & Airport Transfer",
        note: "Pickup at 11:00 AM"
      }
    ]

  };
  /* =======================
     DEMO GUEST INFO FOR 3 EVENTS
  ======================= */
  static demoGuestInfo = {
    "demo-1": { // 💍 Sharma–Verma Wedding
      hotelAssignment: {
        hotel: "Grand Himalayan Resort",
        roomNumber: "501",
        roomType: "Deluxe Double",
        floor: "Floor 5",
        checkIn: "12/20/2024, 2:00 PM",
        checkOut: "12/22/2024, 12:00 PM"
      },
      dietaryRestrictions: ["Vegetarian", "No Onion", "No Garlic"],
      diningPreferences: [],
      specialRequests: {
        requests: ["Ground floor preferred"],
        accessibility: ["Wheelchair accessible room"],
        transportation: ["Airport pickup required"]
      },
      emergencyContact: {
        number: "+91-9876543210"
      }
    },

    "demo-2": { // 💻 TechConf 2024
      hotelAssignment: {
        hotel: "Bangalore Grand Hotel",
        roomNumber: "312",
        roomType: "Executive Suite",
        floor: "Floor 3",
        checkIn: "11/15/2024, 10:00 AM",
        checkOut: "11/17/2024, 11:00 AM"
      },
      dietaryRestrictions: ["Vegetarian"],
      diningPreferences: [],
      specialRequests: {
        requests: ["High floor preferred", "Near conference hall"],
        accessibility: ["None"],
        transportation: ["Airport shuttle needed"]
      },
      emergencyContact: {
        number: "+91-9123456789"
      }
    },

    "demo-3": { // 🏢 Annual MICE Retreat
      hotelAssignment: {
        hotel: "Goa Beach Resort",
        roomNumber: "101",
        roomType: "Sea View Room",
        floor: "Floor 1",
        checkIn: "10/10/2024, 3:00 PM",
        checkOut: "10/13/2024, 12:00 PM"
      },
      dietaryRestrictions: ["Vegetarian", "Gluten Free"],
      diningPreferences: [],
      specialRequests: {
        requests: ["Near pool", "Quiet room preferred"],
        accessibility: ["Wheelchair accessible"],
        transportation: ["Airport pickup arranged"]
      },
      emergencyContact: {
        number: "+91-9988776655"
      }
    }
  };
  static demoInventory = {
    "demo-1": { // Sharma–Verma Wedding
      rooms: [
        { id: "r1", name: "Standard Room", booked: 4, total: 10, floor: "Ground Floor" },
        { id: "r2", name: "Deluxe Room", booked: 6, total: 8, floor: "High Floor" },
        { id: "r3", name: "Accessible Room", booked: 3, total: 4, floor: "Ground Floor" }
      ],
      transport: [
        { id: "t1", name: "Sedan", booked: 1, total: 4, location: "Main Gate" },
        { id: "t2", name: "SUV", booked: 2, total: 6, location: "Parking Lot A" },
        { id: "t3", name: "Bus (32-seater)", booked: 31, total: 32, location: "Bus Stand" }
      ],
      dining: [
        { id: "d1", name: "Breakfast", booked: 33, total: 80, time: "7:00 AM - 9:00 AM", options: ["Vegetarian", "Non-Veg", "Vegan"] },
        { id: "d2", name: "Lunch", booked: 36, total: 100, time: "12:30 PM - 2:00 PM", options: ["Vegetarian", "Non-Veg", "Gluten-Free"] },
        { id: "d3", name: "Dinner", booked: 29, total: 120, time: "7:00 PM - 9:00 PM", options: ["Vegetarian", "Non-Veg", "Halal"] }
      ],
      activities: [
        { id: "a1", name: "Yoga & Meditation", booked: 10, total: 30, time: "6:00 AM", duration: "1 Hour" },
        { id: "a2", name: "Sightseeing Tour", booked: 37, total: 40, time: "10:00 AM", duration: "3 Hours" },
        { id: "a3", name: "Adventure Sports", booked: 22, total: 25, time: "2:00 PM", duration: "4 Hours" },
        { id: "a4", name: "Cultural Evening", booked: 44, total: 100, time: "6:00 PM", duration: "2 Hours" }
      ]
    },

    "demo-2": { // Corporate Retreat
      rooms: [
        { id: "r1", name: "Executive Suite", booked: 5, total: 10, floor: "Top Floor" },
        { id: "r2", name: "Standard Room", booked: 8, total: 15, floor: "Ground Floor" }
      ],
      transport: [
        { id: "t1", name: "Minivan", booked: 3, total: 5, location: "Main Entrance" },
        { id: "t2", name: "Coach Bus (40-seater)", booked: 1, total: 2, location: "Parking Lot B" }
      ],
      dining: [
        { id: "d1", name: "Breakfast", booked: 20, total: 50, time: "7:30 AM - 9:00 AM", options: ["Vegetarian", "Non-Veg"] },
        { id: "d2", name: "Lunch", booked: 30, total: 60, time: "1:00 PM - 2:30 PM", options: ["Vegetarian", "Non-Veg", "Vegan"] },
        { id: "d3", name: "Dinner", booked: 25, total: 55, time: "7:00 PM - 9:00 PM", options: ["Vegetarian", "Non-Veg"] }
      ],
      activities: [
        { id: "a1", name: "Team Building", booked: 18, total: 20, time: "10:00 AM", duration: "2 Hours" },
        { id: "a2", name: "Leadership Workshop", booked: 10, total: 15, time: "3:00 PM", duration: "1.5 Hours" },
        { id: "a3", name: "Evening Networking", booked: 40, total: 50, time: "6:00 PM", duration: "2 Hours" }
      ]
    },

    "demo-3": { // Small Social Event
      rooms: [
        { id: "r1", name: "Garden View Room", booked: 2, total: 5, floor: "Ground Floor" }
      ],
      transport: [
        { id: "t1", name: "SUV", booked: 1, total: 2, location: "Parking Lot C" }
      ],
      dining: [
        { id: "d1", name: "Lunch", booked: 10, total: 20, time: "12:00 PM - 1:30 PM", options: ["Vegetarian", "Non-Veg"] },
        { id: "d2", name: "Dinner", booked: 8, total: 15, time: "7:00 PM - 8:30 PM", options: ["Vegetarian", "Non-Veg"] }
      ],
      activities: [
        { id: "a1", name: "Interactive Games", booked: 5, total: 10, time: "2:00 PM", duration: "1 Hour" },
        { id: "a2", name: "Music & Dance", booked: 12, total: 20, time: "6:00 PM", duration: "2 Hours" }
      ]
    }
  };
  /* =======================
     GET INVENTORY BY EVENT ID
  ======================= */
  static getInventoryByEventId(eventId) {
    // ✅ Demo events
    if (eventId.startsWith("demo-")) {
      return this.demoInventory[eventId] || {
        rooms: [],
        transport: [],
        dining: [],
        activities: []
      };
    }

    // TODO: For real events, fetch from backend API
    return {
      rooms: [],
      transport: [],
      dining: [],
      activities: []
    };
  }
  /* =======================
     BACKEND FETCH
  ======================= */
  static async fetchBackendEvents() {
    const authUser = JSON.parse(localStorage.getItem("auth_user"));
    const token = authUser?.token;

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await fetch(`${BASE_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch backend events");
    }

    const data = await res.json();
    return data.data.map(e => ({
      ...e,
      id: e._id,// Ensure we map MongoDB's _id to id for easier handling
      name: e.name,
      location: e.location,
      guestCount: e.guestCount,  // Ensure fields are correctly mapped
      startDate: new Date(e.startDate),  // Ensure valid Date object
      endDate: new Date(e.endDate),      // Ensure valid Date object
      status: e.status,
      isDemo: false   // 👈 ADD THIS
    }));
  }

  /* =======================
     PUBLIC: GET ALL EVENTS
  ======================= */
  static async getAllEvents() {
    let backendEvents = [];

    try {
      // ADD THIS LINE TO LOG THE URL BEING CALLED
      console.log("Fetching events from:", BASE_URL);
      backendEvents = await this.fetchBackendEvents();
    } catch (err) {
      console.warn("Backend unavailable, demo events only");
    }

    // Return demo events + fetched backend events
    return [
      ...this.demoEvents,
      ...backendEvents
    ];
  }

  /* =======================
     CREATE EVENT (BACKEND)
  ======================= */
  static async createEvent(eventData) {
    const authUser = JSON.parse(localStorage.getItem("auth_user"));
    const token = authUser?.token;

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create event");
    }

    return await res.json();
  }
  /* =======================
     UPDATE EVENT (BACKEND)
  ======================= */
  static async updateEvent(id, eventData) {
    const authUser = JSON.parse(localStorage.getItem("auth_user"));
    const token = authUser?.token;

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await fetch(`${BASE_URL}/api/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update event");
    }

    return await res.json();
  }

  /* =======================
     GET SINGLE EVENT
  ======================= */
  static async getEventById(id) {
    // ✅ If it's a demo event → return from frontend array
    if (id.startsWith("demo-")) {
      return this.demoEvents.find(event => event.id === id);
    }
    const authUser = JSON.parse(localStorage.getItem("auth_user"));
    const token = authUser?.token;

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await fetch(`${BASE_URL}/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch event");
    }

    const data = await res.json();

    return {
      ...data.data,
      id: data.data._id
    };
  }

  /* =======================
     GET SCHEDULE
  ======================= */
  static getScheduleByEventId(eventId) {
    return this.demoSchedules.filter(s => s.eventId === eventId);
  }

  /* =======================
     GET UPDATES
  ======================= */
  static getUpdatesByEventId(eventId) {
    return this.demoUpdates.filter(u => u.eventId === eventId);
  }

  /* =======================
     GET ITINERARY
  ======================= */
  static getItineraryByEventId(eventId) {
    return this.demoItineraries[eventId] || [];
  }
  /* =======================
     STATS
  ======================= */
  static getEventStats(events = []) {
    return {
      totalEvents: events.length,
      confirmedEvents: events.filter(e => e.status === "confirmed").length,
      planningEvents: events.filter(e => e.status === "planning").length,
      totalGuests: events.reduce((sum, e) => sum + (parseInt(e.guestCount) || 0), 0)  // Ensure guestCount is parsed correctly
    };
  }
}

export default EventCoordinationService;