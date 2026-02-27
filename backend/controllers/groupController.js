const GroupBooking = require("../models/GroupBooking");
const User = require("../models/User");
const { calculateGroupPricing } = require("../services/pricingService");
const { calculateEventSuitability } = require("../services/eventSuitabilityService");

// Calculate Suitability Score
const calculateSuitability = (hotel, eventType) => {
  const scoreData = {
    overallScore: 0,
    eventTypeMatch: 0,
    amenitiesMatch: 0,
    priceMatch: 0,
    recommendationText: ""
  };

  // Event Type Matching Logic
  const eventMatches = {
    MICE: {
      requiredAmenities: ["Conference Room", "WiFi", "Parking"],
      scoreBoost: 25,
      text: "Great for corporate events with conference facilities"
    },
    Wedding: {
      requiredAmenities: ["Banquet Hall", "Kitchen", "Parking"],
      scoreBoost: 25,
      text: "Excellent wedding venue with catering facilities"
    },
    Conference: {
      requiredAmenities: ["Auditorium", "WiFi", "Projector"],
      scoreBoost: 25,
      text: "Perfect for conferences with modern tech setup"
    }
  };

  const config = eventMatches[eventType];
  if (config) {
    scoreData.eventTypeMatch = config.scoreBoost;
    scoreData.recommendationText = config.text;
  }

  // Amenities matching
  const hotelAmenities = hotel.amenities || [];
  if (config) {
    const matches = config.requiredAmenities.filter((a) =>
      hotelAmenities.some((ha) => ha.toLowerCase().includes(a.toLowerCase()))
    );
    scoreData.amenitiesMatch = (matches.length / config.requiredAmenities.length) * 25;
  }

  // Price match (basic logic)
  scoreData.priceMatch = 25;

  // Overall score
  scoreData.overallScore = Math.min(
    100,
    scoreData.eventTypeMatch + scoreData.amenitiesMatch + scoreData.priceMatch
  );

  return scoreData;
};

// Create new Group Booking
exports.createGroupBooking = async (req, res) => {
  try {
    const {
      hotelId,
      hotelCode,
      hotelName,
      city,
      eventName,
      eventType,
      checkInDate,
      checkOutDate,
      numberOfRooms,
      basePrice,
      amenities
    } = req.body;

    // Validate input
    if (!eventName || !eventType || !hotelName || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get authenticated user
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Calculate pricing
    const pricingBreakdown = calculateGroupPricing(
      basePrice,
      numberOfRooms,
      Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
    );

    // Calculate suitability
    const suitabilityScore = calculateSuitability(
      { amenities },
      eventType
    );

    // Create Group Booking
    const groupBooking = new GroupBooking({
      eventName,
      eventType,
      hotel: {
        hotelId,
        hotelCode,
        name: hotelName,
        city,
        amenities: amenities || []
      },
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfRooms,
      pricingBreakdown,
      suitabilityScore,
      bookingStatus: "Draft",
      createdBy: userId,
      // Initialize with creator as first member
      members: [
        {
          name: req.user?.name || "Organizer",
          email: req.user?.email || "",
          status: "Confirmed"
        }
      ]
    });

    // Set event-specific configurations
    switch (eventType) {
      case "MICE":
        groupBooking.eventCategoryData.miceConfig = {
          networking: true,
          seatingRequired: true,
          eventDuration: 2
        };
        break;
      case "Wedding":
        groupBooking.eventCategoryData.weddingConfig = {
          dietaryManagement: true,
          roomGrouping: true,
          guestCount: 0
        };
        break;
      case "Conference":
        groupBooking.eventCategoryData.conferenceConfig = {
          sessionScheduling: true,
          speakerTagging: true,
          sessionCount: 0
        };
        break;
    }

    await groupBooking.save();

    // Emit real-time event (Socket.io)
    if (global.io) {
      global.io.emit("newGroupBookingCreated", {
        bookingId: groupBooking._id,
        eventName,
        eventType,
        hotelName,
        createdAt: groupBooking.createdAt,
        createdBy: req.user?.name || "User",
        totalAmount: pricingBreakdown.totalForAllRooms
      });
    }

    // Log for analytics
    console.log(`✅ Group booking created: ${groupBooking._id}`);

    res.status(201).json({
      success: true,
      message: "Group booking created successfully",
      data: {
        bookingId: groupBooking._id,
        eventName: groupBooking.eventName,
        pricingBreakdown: groupBooking.pricingBreakdown,
        suitabilityScore: groupBooking.suitabilityScore
      }
    });
  } catch (error) {
    console.error("Error creating group booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create group booking",
      error: error.message
    });
  }
};

// Get Group Booking by ID
exports.getGroupBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id || req.user?.id;

    const booking = await GroupBooking.findById(bookingId).populate(
      "createdBy",
      "name email role"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Authorization: User can view their own booking or if they're admin
    if (
      booking.createdBy._id.toString() !== userId.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking"
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking"
    });
  }
};

// Update Group Booking
exports.updateGroupBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { eventName, eventType, bookingStatus, adminNotes } = req.body;
    const userId = req.user?._id || req.user?.id;

    const booking = await GroupBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Authorization
    if (
      booking.createdBy.toString() !== userId.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Update allowed fields
    if (eventName) booking.eventName = eventName;
    if (eventType) booking.eventType = eventType;
    if (bookingStatus && req.user?.role === "admin") {
      booking.bookingStatus = bookingStatus;
    }
    if (adminNotes && req.user?.role === "admin") {
      booking.adminNotes = adminNotes;
    }

    booking.updatedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking"
    });
  }
};

// Add Member to Group
exports.addMemberToGroup = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, email, phone } = req.body;
    const userId = req.user?._id || req.user?.id;

    const booking = await GroupBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if member already exists
    if (booking.members.some((m) => m.email === email)) {
      return res.status(400).json({
        success: false,
        message: "Member already exists"
      });
    }

    // Add member
    booking.members.push({
      name,
      email,
      phone,
      status: "Pending",
      invitedAt: new Date()
    });

    // Recalculate pricing
    const nights = Math.ceil(
      (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)
    );
    booking.pricingBreakdown = calculateGroupPricing(
      booking.hotel.basePriceSnapshot,
      booking.numberOfRooms,
      nights,
      booking.members.length
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: {
        totalMembers: booking.members.length,
        updatedPricing: booking.pricingBreakdown
      }
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member"
    });
  }
};

// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { eventType, status, page = 1, limit = 10 } = req.query;

    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const filter = {};
    if (eventType) filter.eventType = eventType;
    if (status) filter.bookingStatus = status;

    const bookings = await GroupBooking.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GroupBooking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// Get User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    const bookings = await GroupBooking.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GroupBooking.countDocuments({ createdBy: userId });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// Get Analytics for Admin
exports.getAnalytics = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const totalBookings = await GroupBooking.countDocuments();
    const bookingsByType = await GroupBooking.aggregate([
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 }
        }
      }
    ]);

    const bookingsByStatus = await GroupBooking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await GroupBooking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$pricingBreakdown.totalForAllRooms" }
        }
      }
    ]);

    const avgGroupSize = await GroupBooking.aggregate([
      {
        $group: {
          _id: null,
          avgMembers: { $avg: { $size: "$members" } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        bookingsByType,
        bookingsByStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgGroupSize: avgGroupSize[0]?.avgMembers || 0
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics"
    });
  }
};
