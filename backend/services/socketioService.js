/**
 * Socket.io Real-Time Integration
 * For "Add to Group Plan" Feature
 *
 * HOW TO USE:
 * 1. In server.js, initialize Socket.io:
 *    import { Server } from "socket.io";
 *    const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });
 *    global.io = io;
 *    setupSocketio(io);
 *
 * 2. In your controller, emit events:
 *    if (global.io) {
 *      global.io.emit("newGroupBookingCreated", { ... });
 *    }
 *
 * 3. In frontend, listen to events:
 *    useEffect(() => {
 *      const socket = io(API_BASE_URL);
 *      socket.on("newGroupBookingCreated", (data) => {
 *        // Update admin dashboard
 *      });
 *    }, []);
 */

const setupSocketio = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Rooms for different event types
    socket.on("joinAdminDashboard", () => {
      socket.join("admin-dashboard");
      console.log("Admin joined dashboard");
    });

    socket.on("joinGroupChat", ({ bookingId }) => {
      socket.join(`group-${bookingId}`);
      console.log(`User joined group room: ${bookingId}`);
    });

    socket.on("leaveGroupChat", ({ bookingId }) => {
      socket.leave(`group-${bookingId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

/**
 * EMISSION EVENTS (from backend)
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * 1. NEW GROUP BOOKING CREATED
 *
 * When a user successfully creates a group booking, this event is emitted
 * to the admin dashboard and any logged-in admins.
 *
 * Data Format:
 */
const emitNewGroupBooking = (io, data) => {
  if (io) {
    io.to("admin-dashboard").emit("newGroupBookingCreated", {
      bookingId: data._id,
      eventName: data.eventName,
      eventType: data.eventType,
      hotelName: data.hotel.name,
      createdAt: data.createdAt,
      createdBy: data.createdBy.name,
      totalAmount: data.pricingBreakdown.totalForAllRooms,
      memberCount: data.members.length,
      status: data.bookingStatus,
      suitabilityScore: data.suitabilityScore.overallScore
    });
  }
};

/**
 * 2. MEMBER ADDED TO GROUP
 *
 * When a new member is added to an existing group
 */
const emitMemberAdded = (io, bookingId, memberData) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("memberAdded", {
      bookingId,
      memberName: memberData.name,
      memberEmail: memberData.email,
      totalMembers: memberData.totalMembers,
      updatedPricing: memberData.updatedPricing,
      timestamp: new Date()
    });

    // Also emit to admin
    io.to("admin-dashboard").emit("groupUpdated", {
      bookingId,
      memberCount: memberData.totalMembers,
      action: "member_added"
    });
  }
};

/**
 * 3. MEMBER CONFIRMED PARTICIPATION
 *
 * When a member confirms their participation (status: Confirmed)
 */
const emitMemberConfirmed = (io, bookingId, memberData) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("memberConfirmed", {
      bookingId,
      memberName: memberData.name,
      confirmedCount: memberData.confirmedCount,
      totalMembers: memberData.totalMembers,
      timestamp: new Date()
    });
  }
};

/**
 * 4. PRICING UPDATED
 *
 * When pricing changes (member added, group discount applies, etc.)
 */
const emitPricingUpdated = (io, bookingId, pricingData) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("pricingUpdated", {
      bookingId,
      baseTotal: pricingData.baseTotal,
      gst: pricingData.gst,
      serviceFee: pricingData.serviceFee,
      groupDiscount: pricingData.groupDiscount,
      earlyBirdDiscount: pricingData.earlyBirdDiscount,
      finalTotal: pricingData.totalForAllRooms,
      pricePerMember: pricingData.pricePerMember,
      updatedAt: new Date()
    });
  }
};

/**
 * 5. BOOKING STATUS CHANGED
 *
 * When admin changes booking status (Draft → Confirmed, etc.)
 */
const emitBookingStatusChanged = (io, bookingId, newStatus) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("bookingStatusChanged", {
      bookingId,
      newStatus,
      changedAt: new Date()
    });

    io.to("admin-dashboard").emit("bookingStatusChanged", {
      bookingId,
      newStatus
    });
  }
};

/**
 * 6. AVAILABILITY ALERT
 *
 * When hotel availability changes
 */
const emitAvailabilityAlert = (io, bookingId, alertData) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("availabilityAlert", {
      bookingId,
      type: alertData.type, // "low_inventory", "fully_booked", etc.
      message: alertData.message,
      remainingRooms: alertData.remainingRooms,
      severity: alertData.severity, // "warning", "critical"
      timestamp: new Date()
    });
  }
};

/**
 * 7. PRICE SURGE ALERT
 *
 * When surge pricing is triggered
 */
const emitSurgePriceAlert = (io, bookingId, surgeData) => {
  if (io) {
    io.to(`group-${bookingId}`).emit("surgePriceAlert", {
      bookingId,
      originalPrice: surgeData.originalPrice,
      surgePrice: surgeData.surgePrice,
      surgePercentage: surgeData.percentage, // 10%, 20%, etc.
      reason: surgeData.reason, // "last_minute", "high_demand", etc.
      message: `Suite pricing by ${surgeData.percentage}% due to ${surgeData.reason}`,
      timestamp: new Date()
    });

    io.to("admin-dashboard").emit("surgePriceAlert", {
      bookingId,
      surgePercentage: surgeData.percentage
    });
  }
};

/**
 * 8. ADMIN DASHBOARD UPDATE
 *
 * General update for admin metrics
 */
const emitAdminDashboardUpdate = (io, analyticsData) => {
  if (io) {
    io.to("admin-dashboard").emit("dashboardUpdate", {
      totalBookings: analyticsData.totalBookings,
      totalRevenue: analyticsData.totalRevenue,
      averageGroupSize: analyticsData.averageGroupSize,
      bookingsByType: analyticsData.bookingsByType,
      bookingsByStatus: analyticsData.bookingsByStatus,
      timestamp: new Date()
    });
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * FRONTEND LISTENERS
 * ═══════════════════════════════════════════════════════════════════
 *
 * Example React Hook for Admin Dashboard:
 *
 * function AdminDashboard() {
 *   const [socket, setSocket] = useState(null);
 *   const [bookings, setBookings] = useState([]);
 *
 *   useEffect(() => {
 *     const socketInstance = io(API_BASE_URL);
 *     setSocket(socketInstance);
 *
 *     socketInstance.emit("joinAdminDashboard");
 *
 *     // Listen to new bookings
 *     socketInstance.on("newGroupBookingCreated", (data) => {
 *       setBookings(prev => [data, ...prev]);
 *       // Show notification
 *       showToast(`New group: ${data.eventName}`);
 *     });
 *
 *     // Listen to member additions
 *     socketInstance.on("groupUpdated", (data) => {
 *       setBookings(prev => prev.map(b =>
 *         b.bookingId === data.bookingId
 *           ? { ...b, memberCount: data.memberCount }
 *           : b
 *       ));
 *     });
 *
 *     // Listen to surge prices
 *     socketInstance.on("surgePriceAlert", (data) => {
 *       showWarning(`Surge pricing: ${data.surgePercentage}% for booking ${data.bookingId}`);
 *     });
 *
 *     return () => socketInstance.disconnect();
 *   }, []);
 *
 *   return <div>{...bookings...}</div>;
 * }
 */

/**
 * ═══════════════════════════════════════════════════════════════════
 * USAGE IN CONTROLLERS
 * ═══════════════════════════════════════════════════════════════════
 *
 * Example in groupController.js:
 *
 * exports.createGroupBooking = async (req, res) => {
 *   try {
 *     // ... create booking logic ...
 *
 *     const bookingData = await groupBooking.populate("createdBy");
 *
 *     // Emit real-time event
 *     emitNewGroupBooking(global.io, bookingData);
 *
 *     res.status(201).json({ success: true, data: bookingData });
 *   } catch (error) {
 *     res.status(500).json({ success: false, error: error.message });
 *   }
 * };
 *
 * exports.addMemberToGroup = async (req, res) => {
 *   try {
 *     // ... add member logic ...
 *
 *     emitMemberAdded(global.io, bookingId, {
 *       name: member.name,
 *       email: member.email,
 *       totalMembers: booking.members.length,
 *       updatedPricing: booking.pricingBreakdown
 *     });
 *
 *     res.status(200).json({ success: true, data: booking });
 *   } catch (error) {
 *     res.status(500).json({ success: false, error: error.message });
 *   }
 * };
 */

module.exports = {
  setupSocketio,
  emitNewGroupBooking,
  emitMemberAdded,
  emitMemberConfirmed,
  emitPricingUpdated,
  emitBookingStatusChanged,
  emitAvailabilityAlert,
  emitSurgePriceAlert,
  emitAdminDashboardUpdate
};
