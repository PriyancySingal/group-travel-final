import Guest from "../models/Guest.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const createGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.create(req.body);
  res.status(201).json(guest);
});

export const getGuests = asyncHandler(async (req, res) => {
  const guests = await Guest.find().sort("-updatedAt");
  res.json(guests);
});

export const updateGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!guest) {
    return res.status(404).json({ message: "Guest not found" });
  }

  res.json(guest);
});

export const deleteGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.findByIdAndDelete(req.params.id);

  if (!guest) {
    return res.status(404).json({ message: "Guest not found" });
  }

  res.json({ success: true });
});
