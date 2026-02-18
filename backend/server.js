import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Event } from "./models/Event.js"; // Event model for dynamic events

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ============================================
   MONGODB CONNECTION
============================================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ============================================
   IN-MEMORY STORAGE (Guests & Alerts)
============================================ */
const guestStore = {
  guests: [],
  alerts: []
};

/* ============================================
   HEALTH CHECK
============================================ */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ============================================
   GUEST PROFILES & ALERTS API (unchanged)
============================================ */
// GET all guests
app.get("/api/guests", (req, res) => {
  try {
    res.json({ success: true, data: guestStore.guests, count: guestStore.guests.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

// GET single guest
app.get("/api/guests/:id", (req, res) => {
  try {
    const guest = guestStore.guests.find(g => g.id === parseInt(req.params.id));
    if (!guest) return res.status(404).json({ error: "Guest not found" });
    res.json({ success: true, data: guest });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch guest" });
  }
});

// CREATE or UPDATE guest
app.post("/api/guests", (req, res) => {
  try {
    const guestData = req.body;
    if (!guestData.name) return res.status(400).json({ error: "Guest name is required" });

    const existingIndex = guestStore.guests.findIndex(g => g.id === guestData.id);
    let isUpdate = false;
    if (existingIndex >= 0) {
      isUpdate = true;
      guestStore.guests[existingIndex] = guestData;
    } else {
      guestStore.guests.push(guestData);
    }

    const alertType = isUpdate ? "preference_update" : "new_guest";
    const alertMessage = isUpdate
      ? `${guestData.name}'s preferences have been updated`
      : `${guestData.name} has been added to the guest list`;

    const alert = {
      id: Date.now(),
      type: alertType,
      title: isUpdate ? "Guest Preference Updated" : "New Guest Added",
      message: alertMessage,
      guestName: guestData.name,
      timestamp: new Date().toISOString()
    };

    guestStore.alerts.unshift(alert);
    if (guestStore.alerts.length > 100) guestStore.alerts.pop();

    res.json({
      success: true,
      message: isUpdate ? "Guest updated successfully" : "Guest added successfully",
      data: guestData,
      alert
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to save guest" });
  }
});

// DELETE guest
app.delete("/api/guests/:id", (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    const guestIndex = guestStore.guests.findIndex(g => g.id === guestId);
    if (guestIndex === -1) return res.status(404).json({ error: "Guest not found" });

    const removedGuest = guestStore.guests.splice(guestIndex, 1)[0];

    const alert = {
      id: Date.now(),
      type: "guest_removed",
      title: "Guest Removed",
      message: `${removedGuest.name} has been removed from the guest list`,
      guestName: removedGuest.name,
      timestamp: new Date().toISOString()
    };

    guestStore.alerts.unshift(alert);

    res.json({ success: true, message: "Guest deleted successfully", alert });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete guest" });
  }
});

// GET dietary summary
app.get("/api/guests/analytics/dietary", (req, res) => {
  try {
    const summary = {};
    guestStore.guests.forEach(guest => {
      guest.dietaryRequirements?.forEach(diet => {
        summary[diet] = (summary[diet] || 0) + 1;
      });
    });
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch dietary summary" });
  }
});

// GET special needs summary
app.get("/api/guests/analytics/special-needs", (req, res) => {
  try {
    const summary = {
      wheelchairAccessible: guestStore.guests.filter(g => g.wheelchairAccessible).length,
      mobilityAssistance: guestStore.guests.filter(g => g.mobilityAssistance).length,
      totalGuests: guestStore.guests.length,
      withSpecialNeeds: guestStore.guests.filter(g => g.specialNeeds?.length > 0).length
    };
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch special needs summary" });
  }
});

// GET all alerts
app.get("/api/alerts", (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const alerts = guestStore.alerts.slice(0, limit);
    res.json({ success: true, data: alerts, count: alerts.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// DELETE alert by id
app.delete("/api/alerts/:id", (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const alertIndex = guestStore.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) return res.status(404).json({ error: "Alert not found" });
    guestStore.alerts.splice(alertIndex, 1);
    res.json({ success: true, message: "Alert dismissed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to dismiss alert" });
  }
});

// CLEAR all alerts
app.delete("/api/alerts", (req, res) => {
  try {
    guestStore.alerts = [];
    res.json({ success: true, message: "All alerts cleared" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to clear alerts" });
  }
});

/* ============================================
   HOTEL SEARCH API (unchanged)
============================================ */
app.post("/api/hotels", async (req, res) => {
  try {
    const { CityId, CheckInDate, CheckOutDate, Rooms } = req.body;
    if (!CityId || !CheckInDate || !CheckOutDate || !Rooms) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tboResponse = await axios.post(
      process.env.TBO_API_URL,
      { CityId: String(CityId), CheckInDate, CheckOutDate, Rooms: parseInt(Rooms), SortBy: 1, ShowResultCount: 50 },
      { auth: { username: process.env.TBO_USERNAME, password: process.env.TBO_PASSWORD }, headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    res.json(tboResponse.data);
  } catch (error) {
    console.error("[Hotel Search Error]", error.message);
    res.status(500).json({ error: "Hotel search failed", message: error.message });
  }
});

/* ============================================
   PRICING API (unchanged)
============================================ */
const PRICING_CONFIG = { TAX_RATE: 0.12, SERVICE_FEE_RATE: 0.05, GROUP_DISCOUNT_RATE: 0.10, EARLY_BIRD_DISCOUNT_RATE: 0.05, EARLY_BIRD_DAYS: 30, GROUP_SIZE_THRESHOLD: 5 };
const calculateNights = (checkInDate, checkOutDate) => { const checkIn = new Date(checkInDate); const checkOut = new Date(checkOutDate); const diffTime = Math.abs(checkOut - checkIn); return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; };
const daysUntilCheckIn = (checkInDate) => { const checkIn = new Date(checkInDate); const today = new Date(); const diffTime = checkIn - today; return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0; };
app.post("/api/pricing/calculate", (req, res) => {
  try {
    const { hotel, checkInDate, checkOutDate, rooms, memberCount } = req.body;
    if (!hotel?.Price) return res.status(400).json({ error: "Hotel price required" });

    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = hotel.Price.TotalPrice || 0;
    const tax = Math.round(basePrice * PRICING_CONFIG.TAX_RATE);
    const serviceFee = Math.round(basePrice * PRICING_CONFIG.SERVICE_FEE_RATE);
    const groupDiscount = memberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD ? Math.round(basePrice * PRICING_CONFIG.GROUP_DISCOUNT_RATE) : 0;
    const earlyBirdDiscount = daysUntilCheckIn(checkInDate) > PRICING_CONFIG.EARLY_BIRD_DAYS ? Math.round(basePrice * PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE) : 0;
    const totalDiscount = groupDiscount + earlyBirdDiscount;
    const subtotal = basePrice + tax + serviceFee;
    const total = subtotal - totalDiscount;

    res.json({ success: true, data: { basePrice, tax, serviceFee, groupDiscount, earlyBirdDiscount, subtotal, total } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Pricing calculation failed", message: error.message });
  }
});

/* ============================================
   EVENT API (NEW: MongoDB-based)
============================================ */
// GET all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// CREATE a new event
app.post("/api/events", async (req, res) => {
  try {
    const { title, date, venue, description, additionalFields } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Title and date are required" });

    const event = new Event({ title, date, venue, description, additionalFields });
    await event.save();
    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// DELETE an event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

/* ============================================
   SERVER START
============================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log("Guest & Alert APIs: /api/guests, /api/alerts");
  console.log("Pricing API: /api/pricing/calculate");
  console.log("Hotel API: /api/hotels");
  console.log("Event API (MongoDB): /api/events");
});
