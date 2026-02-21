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
import mongoose from "mongoose";
import { Event } from "./models/Event.js"; // Event model
import auth from "./middleware/auth.js"; // Auth middleware for role-based access
import authRoutes from "./routes/auth.js"; // Authentication routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health Check Route
app.get("/", (req, res) => {
  res.send("Backend running");
});

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
});
