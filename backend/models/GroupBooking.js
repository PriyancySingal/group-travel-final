const mongoose = require("mongoose");

const GroupBookingSchema = new mongoose.Schema(
  {
    // Event Information
    eventName: {
      type: String,
      required: true,
      trim: true
    },
    eventType: {
      type: String,
      enum: ["MICE", "Wedding", "Conference", "General"],
      required: true
    },

    // Hotel Information Snapshot
    hotel: {
      hotelId: String,
      hotelCode: String,
      name: String,
      city: String,
      starRating: Number,
      amenities: [String],
      basePriceSnapshot: Number,
      cancellationPolicy: String
    },

    // Booking Details
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    numberOfRooms: {
      type: Number,
      default: 1,
      min: 1
    },
    numberOfNights: Number,

    // Members Information
    members: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        name: String,
        email: String,
        phone: String,
        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Declined"],
          default: "Pending"
        },
        share: Number,
        invitedAt: Date,
        respondedAt: Date,
        dietaryRestrictions: String, // For Wedding events
        _id: false
      }
    ],

    // Pricing Information
    pricingBreakdown: {
      basePrice: Number,
      gst: Number, // 12%
      serviceFee: Number, // 5%
      groupDiscount: Number, // Applied if 5+ members
      earlyBirdDiscount: Number,
      totalPerRoom: Number,
      totalForAllRooms: Number,
      pricePerMember: Number,
      lastUpdatedAt: Date
    },

    // Booking Status
    bookingStatus: {
      type: String,
      enum: ["Draft", "Active", "Confirmed", "Cancelled"],
      default: "Draft"
    },

    // Event Category Specific Data
    eventCategoryData: {
      miceConfig: {
        networking: Boolean,
        seatingRequired: Boolean,
        eventDuration: Number
      },
      weddingConfig: {
        dietaryManagement: Boolean,
        roomGrouping: Boolean,
        guestCount: Number
      },
      conferenceConfig: {
        sessionScheduling: Boolean,
        speakerTagging: Boolean,
        sessionCount: Number
      }
    },

    // AI Suitability Score
    suitabilityScore: {
      overallScore: Number, // 0-100
      eventTypeMatch: Number,
      amenitiesMatch: Number,
      priceMatch: Number,
      recommendationText: String
    },

    // Real-Time Alerts
    alerts: [
      {
        type: {
          type: String,
          enum: ["availability", "price_surge", "last_minute"]
        },
        message: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    // Administrative
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    adminNotes: String,
    overridePricing: Number, // Admin override
    resourceAllocation: {
      allocated: Boolean,
      allocatedDate: Date,
      allocatedBy: mongoose.Schema.Types.ObjectId
    },

    // Analytics
    analytics: {
      invitationsSent: { type: Number, default: 0 },
      confirmations: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      lastViewed: Date
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for performance
GroupBookingSchema.index({ createdBy: 1, createdAt: -1 });
GroupBookingSchema.index({ eventType: 1 });
GroupBookingSchema.index({ bookingStatus: 1 });
GroupBookingSchema.index({ "hotel.city": 1 });
GroupBookingSchema.index({ checkInDate: 1 });

// Pre-save middleware to calculate nights
GroupBookingSchema.pre("save", function (next) {
  if (this.checkInDate && this.checkOutDate) {
    const nights =
      (this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24);
    this.numberOfNights = Math.ceil(nights);
  }
  next();
});

// Virtual for member count
GroupBookingSchema.virtual("totalMembers").get(function () {
  return this.members ? this.members.length : 0;
});

// Virtual for confirmed members count
GroupBookingSchema.virtual("confirmedMembers").get(function () {
  return this.members
    ? this.members.filter((m) => m.status === "Confirmed").length
    : 0;
});

GroupBookingSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("GroupBooking", GroupBookingSchema);
