// // // import express from "express";
// // // import axios from "axios";
// // // import cors from "cors";
// // // import dotenv from "dotenv";
// // // import mongoose from "mongoose";
// // // import { Event } from "./models/Event.js";
// // // import auth from "./middleware/auth.js";
// // // import authRoutes from "./routes/auth.js";

// // // dotenv.config();

// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());
// // // app.use("/api/auth", authRoutes);

// // // /* ============================================
// // //    MONGODB CONNECTION
// // // ============================================ */
// // // mongoose
// // //   .connect(process.env.MONGO_URI)
// // //   .then(() => console.log("✅ MongoDB Atlas Connected"))
// // //   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // // /* ============================================
// // //    HEALTH CHECK
// // // ============================================ */
// // // app.get("/", (req, res) => {
// // //   res.send("Backend running");
// // // });

// // // /* ============================================
// // //    EVENT API (SECURE + ROLE BASED)
// // // ============================================ */

// // // /**
// // //  * GET ALL EVENTS
// // //  * ADMIN  -> all events
// // //  * CLIENT -> only own events
// // //  */
// // // app.get("/api/events", auth, async (req, res) => {
// // //   try {
// // //     const events =
// // //       req.user.role === "admin"
// // //         ? await Event.find().sort({ createdAt: -1 })
// // //         : await Event.find({
// // //             "createdBy.userId": req.user.userId
// // //           }).sort({ createdAt: -1 });

// // //     res.json({ success: true, data: events });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to fetch events" });
// // //   }
// // // });

// // // /**
// // //  * CREATE EVENT (ANY LOGGED-IN USER)
// // //  */
// // // app.post("/api/events", auth, async (req, res) => {
// // //   try {
// // //     const { title, date, venue, description, additionalFields } = req.body;

// // //     if (!title || !date) {
// // //       return res.status(400).json({ error: "Title and date are required" });
// // //     }

// // //     const event = new Event({
// // //       title,
// // //       date,
// // //       venue,
// // //       description,
// // //       additionalFields,
// // //       createdBy: {
// // //         userId: req.user.userId,
// // //         role: req.user.role
// // //       }
// // //     });

// // //     await event.save();
// // //     res.status(201).json({ success: true, data: event });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to create event" });
// // //   }
// // // });

// // // /**
// // //  * GET SINGLE EVENT
// // //  * ADMIN -> any
// // //  * CLIENT -> only own
// // //  */
// // // app.get("/api/events/:id", auth, async (req, res) => {
// // //   try {
// // //     const event = await Event.findById(req.params.id);

// // //     if (!event) {
// // //       return res.status(404).json({ error: "Event not found" });
// // //     }

// // //     if (
// // //       req.user.role !== "admin" &&
// // //       event.createdBy.userId.toString() !== req.user.userId
// // //     ) {
// // //       return res.status(403).json({ error: "Access denied" });
// // //     }

// // //     res.json({ success: true, data: event });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to fetch event" });
// // //   }
// // // });

// // // /**
// // //  * UPDATE EVENT (ADMIN or OWNER)
// // //  */
// // // app.patch("/api/events/:id", auth, async (req, res) => {
// // //   try {
// // //     const event = await Event.findById(req.params.id);

// // //     if (!event) {
// // //       return res.status(404).json({ error: "Event not found" });
// // //     }

// // //     if (
// // //       req.user.role !== "admin" &&
// // //       event.createdBy.userId.toString() !== req.user.userId
// // //     ) {
// // //       return res.status(403).json({ error: "Access denied" });
// // //     }

// // //     event.additionalFields = req.body.additionalFields;
// // //     await event.save();

// // //     res.json({ success: true, data: event });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to update event" });
// // //   }
// // // });

// // // /**
// // //  * DELETE EVENT (ADMIN ONLY)
// // //  */
// // // app.delete("/api/events/:id", auth, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== "admin") {
// // //       return res.status(403).json({ error: "Admins only" });
// // //     }

// // //     const deleted = await Event.findByIdAndDelete(req.params.id);
// // //     if (!deleted) {
// // //       return res.status(404).json({ error: "Event not found" });
// // //     }

// // //     res.json({ success: true, message: "Event deleted successfully" });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to delete event" });
// // //   }
// // // });

// // // /* ============================================
// // //    SERVER
// // // ============================================ */
// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => {
// // //   console.log(`🚀 Server running on port ${PORT}`);
// // // });

// // import express from "express";
// // import axios from "axios";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import mongoose from "mongoose";
// // import { Event } from "./models/Event.js";
// // import auth from "./middleware/auth.js";
// // import authRoutes from "./routes/auth.js";

// // dotenv.config();

// // const app = express();
// // app.use(cors());
// // app.use(express.json());
// // app.use("/api/auth", authRoutes);

// // /* ============================================
// //    MONGODB CONNECTION
// // ============================================ */
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log("✅ MongoDB Atlas Connected"))
// //   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // /* ============================================
// //    HEALTH CHECK
// // ============================================ */
// // app.get("/", (req, res) => {
// //   res.send("Backend running");
// // });

// // /* ============================================
// //    EVENT API (SECURE + ROLE BASED)
// // ============================================ */

// // /**
// //  * GET ALL EVENTS
// //  * ADMIN  -> all events
// //  * CLIENT -> only own events
// //  */
// // app.get("/api/events", auth, async (req, res) => {
// //   try {
// //     const events =
// //       req.user.role === "admin"
// //         ? await Event.find().sort({ createdAt: -1 })
// //         : await Event.find({
// //             "createdBy.userId": req.user.userId
// //           }).sort({ createdAt: -1 });

// //     res.json({ success: true, data: events });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to fetch events" });
// //   }
// // });

// // /**
// //  * CREATE EVENT (ANY LOGGED-IN USER)
// //  */
// // app.post("/api/events", auth, async (req, res) => {
// //   try {
// //     console.log("REQ BODY 👉", req.body);
// //     // Adjusted to align with frontend's field names: name -> title, startDate -> date, endDate
// //     const { name, startDate, endDate, venue, description, additionalFields } = req.body;

// //     if (!name || !startDate || !endDate) {
// //       return res.status(400).json({ error: "Title and date are required" });
// //     }

// //     const event = new Event({
// //       title: name,  // Mapping name to title
// //       date: startDate,  // Mapping startDate to date
// //       venue,
// //       description,
// //       additionalFields,
// //       createdBy: {
// //         userId: req.user.userId,
// //         role: req.user.role
// //       }
// //     });

// //     await event.save();
// //     res.status(201).json({ success: true, data: event });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to create event" });
// //   }
// // });

// // /**
// //  * GET SINGLE EVENT
// //  * ADMIN -> any
// //  * CLIENT -> only own
// //  */
// // app.get("/api/events/:id", auth, async (req, res) => {
// //   try {
// //     const event = await Event.findById(req.params.id);

// //     if (!event) {
// //       return res.status(404).json({ error: "Event not found" });
// //     }

// //     if (
// //       req.user.role !== "admin" &&
// //       event.createdBy.userId.toString() !== req.user.userId
// //     ) {
// //       return res.status(403).json({ error: "Access denied" });
// //     }

// //     res.json({ success: true, data: event });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to fetch event" });
// //   }
// // });

// // /**
// //  * UPDATE EVENT (ADMIN or OWNER)
// //  */
// // app.patch("/api/events/:id", auth, async (req, res) => {
// //   try {
// //     const event = await Event.findById(req.params.id);

// //     if (!event) {
// //       return res.status(404).json({ error: "Event not found" });
// //     }

// //     if (
// //       req.user.role !== "admin" &&
// //       event.createdBy.userId.toString() !== req.user.userId
// //     ) {
// //       return res.status(403).json({ error: "Access denied" });
// //     }

// //     event.additionalFields = req.body.additionalFields;
// //     await event.save();

// //     res.json({ success: true, data: event });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to update event" });
// //   }
// // });

// // /**
// //  * DELETE EVENT (ADMIN ONLY)
// //  */
// // app.delete("/api/events/:id", auth, async (req, res) => {
// //   try {
// //     if (req.user.role !== "admin") {
// //       return res.status(403).json({ error: "Admins only" });
// //     }

// //     const deleted = await Event.findByIdAndDelete(req.params.id);
// //     if (!deleted) {
// //       return res.status(404).json({ error: "Event not found" });
// //     }

// //     res.json({ success: true, message: "Event deleted successfully" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to delete event" });
// //   }
// // });

// // /* ============================================
// //    SERVER
// // ============================================ */
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// import { Event } from "./models/Event.js";
// import auth from "./middleware/auth.js";
// import authRoutes from "./routes/auth.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// /* ============================================
//    AUTH ROUTES
// ============================================ */
// app.use("/api/auth", authRoutes);

// /* ============================================
//    MONGODB CONNECTION
// ============================================ */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Atlas Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// /* ============================================
//    HEALTH CHECK
// ============================================ */
// app.get("/", (req, res) => {
//   res.send("Backend running");
// });

// /* ============================================
//    EVENTS API (ROLE-BASED)
// ============================================ */

// /**
//  * GET ALL EVENTS
//  * ADMIN  -> all events
//  * CLIENT -> only own events
//  */
// app.get("/api/events", auth, async (req, res) => {
//   try {
//     const events =
//       req.user.role === "admin"
//         ? await Event.find().sort({ createdAt: -1 })
//         : await Event.find({
//             "createdBy.userId": req.user.userId
//           }).sort({ createdAt: -1 });

//     res.json({ success: true, data: events });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

// /**
//  * CREATE EVENT (ANY LOGGED-IN USER)
//  * ✅ MATCHES EventSchema EXACTLY
//  */
// app.post("/api/events", auth, async (req, res) => {
//   try {
//     console.log("REQ BODY 👉", req.body);

//     const {
//       name,
//       type,
//       description,
//       location,
//       startDate,
//       endDate,
//       status,
//       organizer,
//       logo,
//       hotel,
//       guestCount,
//       budget
//     } = req.body;

//     // ✅ Validation
//     if (
//       !name ||
//       !type ||
//       !location ||
//       !startDate ||
//       !endDate ||
//       !organizer ||
//       guestCount === undefined ||
//       !budget
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const event = new Event({
//       name,
//       type,
//       description: description || "",
//       location,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       status: status || "planning",
//       organizer,
//       logo: logo || "🎫",
//       hotel: hotel || "",
//       guestCount: Number(guestCount),
//       budget,
//       createdBy: {
//         userId: req.user.userId,
//         role: req.user.role
//       }
//     });

//     await event.save();
//     res.status(201).json({ success: true, data: event });
//   } catch (error) {
//     console.error("Create event error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// /**
//  * GET SINGLE EVENT
//  * ADMIN -> any
//  * CLIENT -> only own
//  */
// app.get("/api/events/:id", auth, async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     if (
//       req.user.role !== "admin" &&
//       event.createdBy.userId !== req.user.userId
//     ) {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     res.json({ success: true, data: event });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch event" });
//   }
// });

// /**
//  * UPDATE EVENT (ADMIN or OWNER)
//  */
// app.patch("/api/events/:id", auth, async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     if (
//       req.user.role !== "admin" &&
//       event.createdBy.userId !== req.user.userId
//     ) {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     Object.assign(event, req.body);
//     await event.save();

//     res.json({ success: true, data: event });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update event" });
//   }
// });

// /**
//  * DELETE EVENT (ADMIN ONLY)
//  */
// app.delete("/api/events/:id", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ error: "Admins only" });
//     }

//     const deleted = await Event.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     res.json({ success: true, message: "Event deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete event" });
//   }
// });

// /* ============================================
//    SERVER
// ============================================ */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
import mongoose from "mongoose";
import { Event } from "./models/Event.js"; // Event model
import auth from "./middleware/auth.js"; // Auth middleware for role-based access
import authRoutes from "./routes/auth.js"; // Authentication routes
=======
import axios from "axios";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
>>>>>>> upstream/main

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Auth Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health Check Route
=======
// Health check
>>>>>>> upstream/main
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Group Travel Backend API</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; }
          .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .method { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; margin-right: 10px; }
          .get { background: #61affe; color: white; }
          .post { background: #49cc90; color: white; }
          .patch { background: #fca130; color: white; }
          .delete { background: #f93e3e; color: white; }
          code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏨 Group Travel Backend API</h1>
          <p>Welcome to the AI-Powered Group Travel Coordination Platform API</p>
          
          <h2>Available Endpoints:</h2>
          
          <h3>Authentication</h3>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/auth/register</code> - Register new user</div>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/auth/login</code> - Login user</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/auth/me</code> - Get current user</div>
          
          <h3>Bookings</h3>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/bookings</code> - Get all bookings</div>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/bookings</code> - Create booking</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/bookings/:id</code> - Get booking</div>
          <div class="endpoint"><span class="method patch">PATCH</span> <code>/api/bookings/:id/confirm-member</code> - Confirm member</div>
          <div class="endpoint"><span class="method delete">DELETE</span> <code>/api/bookings/:id</code> - Delete booking</div>
          
          <h3>Guests</h3>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/guests</code> - Get all guests</div>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/guests</code> - Create guest</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/guests/analytics/dietary</code> - Dietary analytics</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/guests/analytics/special-needs</code> - Special needs analytics</div>
          
          <h3>Pricing</h3>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/pricing/calculate</code> - Calculate pricing</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/pricing/config</code> - Get pricing config</div>
          
          <h3>Analytics</h3>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/analytics/dashboard</code> - Dashboard (Admin)</div>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/analytics/revenue</code> - Revenue (Admin)</div>
          
          <h3>AI Features</h3>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/ai/guest-matching</code> - Guest matching</div>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/ai/networking</code> - Networking recommendations</div>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/ai/activities</code> - Activity suggestions</div>
          
          <h3>Alerts</h3>
          <div class="endpoint"><span class="method get">GET</span> <code>/api/alerts</code> - Get alerts</div>
          <div class="endpoint"><span class="method delete">DELETE</span> <code>/api/alerts/:id</code> - Delete alert</div>
          
          <h3>Hotel Search</h3>
          <div class="endpoint"><span class="method post">POST</span> <code>/api/hotels</code> - Search hotels</div>
        </div>
      </body>
    </html>
  `);
});

<<<<<<< HEAD
// ==========================
// EVENTS API (ROLE-BASED)
// ==========================

// GET ALL EVENTS (Admin: All events, Client: Own events)
app.get("/api/events", auth, async (req, res) => {
  try {
    const events =
      req.user.role === "admin"
        ? await Event.find().sort({ createdAt: -1 })  // Admin sees all events
        : await Event.find({
            "createdBy.userId": req.user.userId  // Client sees only their events
          }).sort({ createdAt: -1 });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// CREATE EVENT (Admin or Client)
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

  // Validate required fields
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
    console.error("Create event error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE EVENT (Admin: Any event, Client: Only own events)
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

// UPDATE EVENT (Admin or Owner)
app.patch("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user has permission to update the event (Admin or owner)
    if (
      req.user.role !== "admin" &&
      event.createdBy.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    Object.assign(event, req.body); // Update event fields
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE EVENT (Admin only)
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

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
=======
// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);

// Hotel Search API (External TBO API)
app.post("/api/hotels", async (req, res) => {
  try {
    const { CityId, CheckInDate, CheckOutDate, Rooms } = req.body;

    if (!CityId || !CheckInDate || !CheckOutDate || !Rooms) {
      return res.status(400).json({
        error: "Missing required fields: CityId, CheckInDate, CheckOutDate, Rooms",
        received: req.body
      });
    }

    console.log(`[Hotel Search] Searching: City=${CityId}, CheckIn=${CheckInDate}, CheckOut=${CheckOutDate}, Rooms=${Rooms}`);

    const tboResponse = await axios.post(
      process.env.TBO_API_URL,
      {
        CityId: String(CityId),
        CheckInDate: String(CheckInDate),
        CheckOutDate: String(CheckOutDate),
        Rooms: parseInt(Rooms),
        SortBy: 1,
        ShowResultCount: 50
      },
      {
        auth: {
          username: process.env.TBO_USERNAME,
          password: process.env.TBO_PASSWORD
        },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 30000
      }
    );

    console.log(`[Hotel Search Success] Found ${tboResponse.data?.HotelSearchResult?.HotelResults?.length || 0} hotels`);
    res.json(tboResponse.data);

  } catch (error) {
    console.error("[Hotel Search Error]", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response) {
      return res.status(error.response.status || 500).json({
        error: error.response.data?.Error || "TBO API Error",
        message: error.response.data?.Message || error.message,
        status: error.response.status
      });
    }

    res.status(500).json({
      error: "Hotel search failed",
      message: error.message
    });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/group-travel'}`);
>>>>>>> upstream/main
});
