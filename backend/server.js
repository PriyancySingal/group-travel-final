import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// ===== EVENT SYSTEM IMPORTS =====
import { Event } from "./models/Event.js";
import auth from "./middleware/auth.js";

// ===== GROUP TRAVEL ROUTES =====
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ===============================
   MIDDLEWARE
=================================*/

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

/* ===============================
   HEALTH CHECK
=================================*/

app.get("/", (req, res) => {
  res.send("🚀 Backend Running (Events + Travel)");
});

/* =====================================================
   ================= EVENT SYSTEM ======================
=====================================================*/

// GET ALL EVENTS
app.get("/api/events", auth, async (req, res) => {
  try {
    const events =
      req.user.role === "admin"
        ? await Event.find().sort({ createdAt: -1 })
        : await Event.find({
            "createdBy.userId": req.user.userId
          }).sort({ createdAt: -1 });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// CREATE EVENT
app.post("/api/events", auth, async (req, res) => {
  const {
    name,
    type,
    description,
    location,
    startDate,
    endDate,
    status,
    organizer,
    logo,
    hotel,
    guestCount,
    budget
  } = req.body;

  if (
    !name ||
    !type ||
    !location ||
    !startDate ||
    !endDate ||
    !organizer ||
    guestCount === undefined ||
    !budget
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const event = new Event({
      name,
      type,
      description: description || "",
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "planning",
      organizer,
      logo: logo || "🎫",
      hotel: hotel || "",
      guestCount: Number(guestCount),
      budget,
      createdBy: {
        userId: req.user.userId,
        role: req.user.role
      }
    });

    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// GET SINGLE EVENT
app.get("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.createdBy.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// UPDATE EVENT
app.patch("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.createdBy.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE EVENT (ADMIN ONLY)
app.delete("/api/events/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

/* =====================================================
   ================= GROUP TRAVEL ======================
=====================================================*/

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);

/* =====================================================
   ================= HOTEL SEARCH ======================
=====================================================*/

app.post("/api/hotels", async (req, res) => {
  try {
    const { CityCode, CheckIn, CheckOut, Adults } = req.body;

    if (!CityCode || !CheckIn || !CheckOut) {
      return res.status(400).json({
        error: "CityCode, CheckIn and CheckOut are required"
      });
    }

    const END_USER_IP = process.env.END_USER_IP || "106.221.238.172";

    const hotelCodeResponse = await axios.post(
      `${process.env.TBO_API_URL}/TBOHotelCodeList`,
      {
        CityCode: String(CityCode),
        IsDetailedResponse: "false",
        EndUserIp: END_USER_IP
      },
      {
        auth: {
          username: process.env.TBO_USERNAME,
          password: process.env.TBO_PASSWORD
        }
      }
    );

    const hotelCodes = hotelCodeResponse.data?.Hotels
      ?.slice(0, 30)
      .map(h => h.HotelCode)
      .join(",");

    if (!hotelCodes) {
      return res.json({ HotelResult: [] });
    }

    const searchResponse = await axios.post(
      `${process.env.TBO_API_URL}/Search`,
      {
        CheckIn,
        CheckOut,
        HotelCodes: hotelCodes,
        GuestNationality: "IN",
        PaxRooms: [
          {
            Adults: Adults || 1,
            Children: 0,
            ChildrenAges: []
          }
        ],
        ResponseTime: 10,
        IsDetailedResponse: false,
        EndUserIp: END_USER_IP
      },
      {
        auth: {
          username: process.env.TBO_USERNAME,
          password: process.env.TBO_PASSWORD
        }
      }
    );

    return res.json(searchResponse.data);

  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      error: "Hotel search failed",
      details: error.response?.data || error.message
    });
  }
});

/* ===============================
   ERROR HANDLING
=================================*/

app.use(notFound);
app.use(errorHandler);

/* ===============================
   START SERVER
=================================*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});