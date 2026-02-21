// Import necessary modules
// import express from 'express';
// import { Event } from '../models/Event.js'; // Assuming you have a model for events
// import auth from '../middleware/auth.js'; // If you need authentication

// const router = express.Router();

// // POST route to create new event
// router.post("/", auth, async (req, res) => {
//   console.log("REQ BODY:", req.body);
//   const { name, type, description, location, startDate, endDate, status, organizer, logo, hotel, guestCount, budget } = req.body;

//   if (!name || !location || !startDate || !endDate || !organizer || !guestCount || !budget) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const newEvent = new Event({
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
//       budget,
//       createdBy: req.user.userId, // Assuming you have authentication middleware
//     });

//     // Save the event to the database
//     await newEvent.save();

//     res.status(201).json({ success: true, data: newEvent });
//   } catch (error) {
//     console.error("Error creating event", error);
//     res.status(500).json({ error: "Failed to create event" });
//   }
// });

// export default router;
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
//  console.log("REQ BODY:", req.body);
console.log("Received event data:", req.body); // Add this log
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

  // ✅ FIXED validation
  if (
    !name ||
    !location ||
    !startDate ||
    !endDate ||
    !organizer ||
    guestCount === undefined ||
    !budget
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  } // Check if startDate and endDate are valid dates
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (isNaN(parsedStartDate.getTime())) {
    return res.status(400).json({ error: "Invalid start date" });
  }

  if (isNaN(parsedEndDate.getTime())) {
    return res.status(400).json({ error: "Invalid end date" });
  }

  // Ensure end date is after start date
  if (parsedEndDate < parsedStartDate) {
    return res.status(400).json({ error: "End date must be after start date" });
  }

  try {
    const newEvent = new Event({
      name,
      type: type || "general", // Default type to "general" if not provided
      description: description || "",
      location,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      status: status || "planning",
      organizer,
      logo: logo || "🎫",
      hotel: hotel || "",
      guestCount: Number(guestCount), // Ensure guest count is a number
      budget,
      createdBy: req.user.userId
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ error: error.message });
  }
});

//   try {
//     const newEvent = new Event({
//       name,
//       type: type || "general",              // ✅ FIX
//       description: description || "",
//       location,
//       startDate: new Date(startDate),        // ✅ FIX
//       endDate: new Date(endDate),            // ✅ FIX
//       status: status || "planning",
//       organizer,
//       logo: logo || "🎫",
//       hotel: hotel || "",
//       guestCount: Number(guestCount),        // ✅ FIX
//       budget,
//       createdBy: req.user.userId
//     });

//     await newEvent.save();

//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error("Error creating event:", error);
//     res.status(400).json({ error: error.message });
//   }
// });
