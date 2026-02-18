/**
 * Event Coordination Service
 * Manages event microsites, itineraries, schedules, and personalized guest information
 * Handles centralized coordination for group events (weddings, conferences, MICE)
 */

const API = import.meta.env.VITE_API_URL; // Render backend

class EventCoordinationService {
  static events = [
    {
      id: 1,
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
      budget: "₹50,00,000"
    },
    {
      id: 2,
      name: "TechConf 2024",
      type: "conference",
      description: "International Tech Conference with 500+ attendees",
      location: "Bangalore, India",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      status: "confirmed",
      organizer: "Tech India Inc.",
      logo: "💻",
      hotel: "Bangalore Convention Center",
      guestCount: 520,
      budget: "₹1,50,00,000"
    },
    {
      id: 3,
      name: "Annual MICE Retreat",
      type: "mice",
      description: "Corporate team building and networking event",
      location: "Goa, India",
      startDate: "2024-10-10",
      endDate: "2024-10-13",
      status: "planning",
      organizer: "Corporate Events Ltd.",
      logo: "🏢",
      hotel: "Taj Exotica Resort",
      guestCount: 150,
      budget: "₹25,00,000"
    }
  ];

  static schedules = [
    {
      id: 1,
      eventId: 1,
      day: 1,
      date: "2024-12-20",
      title: "Arrival & Welcome",
      activities: [
        { time: "14:00-16:00", name: "Guest Arrival & Check-in", location: "Grand Himalayan Resort" },
        { time: "17:00-18:00", name: "Welcome Tea", location: "Grand Ballroom" },
        { time: "19:00-21:00", name: "Welcome Dinner", location: "Grand Dining Hall", dietary: true }
      ]
    },
    {
      id: 2,
      eventId: 1,
      day: 2,
      date: "2024-12-21",
      title: "Wedding Day",
      activities: [
        { time: "08:00-09:00", name: "Breakfast", location: "Hotel Restaurant" },
        { time: "09:00-14:00", name: "Pre-Wedding Photography", location: "Hotel Gardens" },
        { time: "14:00-15:30", name: "Lunch", location: "Multi-Cuisine Restaurant", dietary: true },
        { time: "17:00-19:00", name: "Wedding Ceremony", location: "Grand Lawn", formal: true },
        { time: "19:00-22:00", name: "Wedding Reception", location: "Grand Ballroom", dietary: true }
      ]
    }
  ];

  static itineraries = {
    1: { guestId: 1, eventId: 1, personalItinerary: [
      { day: 1, activity: "Arrival at 14:30", notes: "Room 501, Deluxe Double" },
      { day: 2, activity: "Wedding Ceremony at 17:00", notes: "Formal attire required" },
      { day: 3, activity: "Checkout at 12:00", notes: "Hotel checkout time" }
    ]},
    2: { guestId: 2, eventId: 1, personalItinerary: [
      { day: 1, activity: "Arrival at 16:00", notes: "Room 502, Deluxe Double" },
      { day: 2, activity: "Wedding Ceremony at 17:00", notes: "Formal attire. Dietary: Vegetarian" }
    ]}
  };

  static guestPersonalization = {
    1: {
      guestId: 1,
      eventId: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      hotelAssignment: {
        hotel: "Grand Himalayan Resort",
        roomNumber: "501",
        roomType: "Deluxe Double",
        floor: 5,
        checkIn: "2024-12-20 14:00",
        checkOut: "2024-12-22 12:00"
      },
      diningPreferences: ["Vegetarian", "No Onion", "No Garlic"],
      specialRequests: "Ground floor preferred",
      transportationNeeds: "Airport pickup required",
      accessibility: "Wheelchair accessible room",
      emergencyContact: "+91-9876543210",
      dietaryRestrictions: ["Vegetarian"]
    },
    2: {
      guestId: 2,
      eventId: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      hotelAssignment: {
        hotel: "Grand Himalayan Resort",
        roomNumber: "502",
        roomType: "Deluxe Double",
        floor: 5,
        checkIn: "2024-12-20 13:30",
        checkOut: "2024-12-22 12:00"
      },
      diningPreferences: ["Vegan", "Gluten-Free"],
      specialRequests: "High floor preferred - city view",
      transportationNeeds: "Airport pickup required",
      accessibility: null,
      emergencyContact: "+91-9876543211",
      dietaryRestrictions: ["Vegan", "Gluten-Free"]
    }
  };

  static updates = [
    { id: 1, eventId: 1, timestamp: new Date("2024-12-15T10:30:00"), type: "schedule", message: "Dinner time updated from 8:00 PM to 8:30 PM", severity: "info", read: false },
    { id: 2, eventId: 1, timestamp: new Date("2024-12-14T14:20:00"), type: "accommodation", message: "Room upgrade available for guests in Block A", severity: "success", read: false },
    { id: 3, eventId: 1, timestamp: new Date("2024-12-13T09:15:00"), type: "activity", message: "Pre-wedding photo session rescheduled to 9:00 AM", severity: "warning", read: false },
    { id: 4, eventId: 1, timestamp: new Date("2024-12-12T16:45:00"), type: "transport", message: "Airport shuttle schedule confirmed", severity: "info", read: true }
  ];

  static getEventById(eventId) { return this.events.find(e => e.id === eventId); }
  static getEventSchedule(eventId) { return this.schedules.filter(s => s.eventId === eventId); }
  static getGuestItinerary(guestId) { return this.itineraries[guestId] || null; }
  static getGuestPersonalization(guestId) { return this.guestPersonalization[guestId] || null; }
  static getEventUpdates(eventId) { return this.updates.filter(u => u.eventId === eventId).sort((a,b)=>b.timestamp-a.timestamp); }

  static updateSubscribers = [];
  static subscribeToUpdates(cb){ this.updateSubscribers.push(cb); return ()=>this.updateSubscribers=this.updateSubscribers.filter(x=>x!==cb); }
  static notifyUpdateSubscribers(u){ this.updateSubscribers.forEach(cb=>cb(u)); }

  static getEventGuests(eventId){ return Object.values(this.guestPersonalization).filter(g=>g.eventId===eventId); }

  /* ===== BACKEND CRUD (SAFE) ===== */

  static async getAllEvents(filter = {}) {
    const q = new URLSearchParams(filter).toString();
    const res = await fetch(`${API}/api/events?${q}`);
    return res.json();
  }

  static async createEvent(eventData) {
    const res = await fetch(`${API}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    });
    return res.json();
  }

  static async updateEvent(eventId, eventData) {
    const res = await fetch(`${API}/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    });
    return res.json();
  }

  static async deleteEvent(eventId) {
    await fetch(`${API}/api/events/${eventId}`, { method: "DELETE" });
    return true;
  }
}

export default EventCoordinationService;
