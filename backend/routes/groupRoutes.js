const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const auth = require("../middleware/auth");

/**
 * Group Booking Routes
 * All routes require authentication
 */

// Create new group booking
router.post("/create", auth, groupController.createGroupBooking);

// Get single booking by ID
router.get("/:bookingId", auth, groupController.getGroupBooking);

// Update booking
router.patch("/:bookingId", auth, groupController.updateGroupBooking);

// Add member to group
router.post("/:bookingId/add-member", auth, groupController.addMemberToGroup);

// Get user's bookings
router.get("/user/bookings", auth, groupController.getUserBookings);

// Get all bookings (Admin only)
router.get("/admin/all", auth, groupController.getAllBookings);

// Get analytics (Admin only)
router.get("/admin/analytics", auth, groupController.getAnalytics);

module.exports = router;
