// Import necessary modules
import express from 'express';
import { Event } from '../models/Event.js'; // Assuming you have a model for events

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
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

export default router;
