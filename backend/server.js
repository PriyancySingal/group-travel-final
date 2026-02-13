import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for guests and alerts (replace with database in production)
const guestStore = {
  guests: [],
  alerts: []
};

// Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ============================================
// GUEST PROFILES & PREFERENCES API ENDPOINTS
// ============================================

// GET all guests
app.get("/api/guests", (req, res) => {
  try {
    res.json({
      success: true,
      data: guestStore.guests,
      count: guestStore.guests.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

// GET a single guest by ID
app.get("/api/guests/:id", (req, res) => {
  try {
    const guest = guestStore.guests.find(g => g.id === parseInt(req.params.id));
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json({ success: true, data: guest });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch guest" });
  }
});

// CREATE or UPDATE a guest profile
app.post("/api/guests", (req, res) => {
  try {
    const guestData = req.body;

    // Validate required fields
    if (!guestData.name) {
      return res.status(400).json({ error: "Guest name is required" });
    }

    const existingIndex = guestStore.guests.findIndex(
      g => g.id === guestData.id
    );

    let isUpdate = false;
    if (existingIndex >= 0) {
      isUpdate = true;
      guestStore.guests[existingIndex] = guestData;
    } else {
      guestStore.guests.push(guestData);
    }

    // Create alert for preference changes
    const alertType = isUpdate ? "preference_update" : "new_guest";
    const alertMessage = isUpdate
      ? `${guestData.name}'s preferences have been updated`
      : `${guestData.name} has been added to the guest list`;

    const alert = {
      id: Date.now(),
      type: alertType,
      title: isUpdate ? "Guest Preference Updated" : "New Guest Added",
      message: alertMessage,
      guestName: guestData.name,
      timestamp: new Date().toISOString()
    };

    guestStore.alerts.unshift(alert);
    if (guestStore.alerts.length > 100) {
      guestStore.alerts.pop();
    }

    res.json({
      success: true,
      message: isUpdate ? "Guest updated successfully" : "Guest added successfully",
      data: guestData,
      alert: alert
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to save guest" });
  }
});

// DELETE a guest
app.delete("/api/guests/:id", (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    const guestIndex = guestStore.guests.findIndex(g => g.id === guestId);

    if (guestIndex === -1) {
      return res.status(404).json({ error: "Guest not found" });
    }

    const removedGuest = guestStore.guests.splice(guestIndex, 1)[0];

    const alert = {
      id: Date.now(),
      type: "guest_removed",
      title: "Guest Removed",
      message: `${removedGuest.name} has been removed from the guest list`,
      guestName: removedGuest.name,
      timestamp: new Date().toISOString()
    };

    guestStore.alerts.unshift(alert);

    res.json({
      success: true,
      message: "Guest deleted successfully",
      alert: alert
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete guest" });
  }
});

// GET dietary requirements summary
app.get("/api/guests/analytics/dietary", (req, res) => {
  try {
    const summary = {};
    guestStore.guests.forEach(guest => {
      guest.dietaryRequirements.forEach(diet => {
        summary[diet] = (summary[diet] || 0) + 1;
      });
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch dietary summary" });
  }
});

// GET special needs summary
app.get("/api/guests/analytics/special-needs", (req, res) => {
  try {
    const summary = {
      wheelchairAccessible: guestStore.guests.filter(g => g.wheelchairAccessible).length,
      mobilityAssistance: guestStore.guests.filter(g => g.mobilityAssistance).length,
      totalGuests: guestStore.guests.length,
      withSpecialNeeds: guestStore.guests.filter(g => g.specialNeeds.length > 0).length
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch special needs summary" });
  }
});

// GET all alerts
app.get("/api/alerts", (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const alerts = guestStore.alerts.slice(0, limit);

    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// DISMISS an alert
app.delete("/api/alerts/:id", (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const alertIndex = guestStore.alerts.findIndex(a => a.id === alertId);

    if (alertIndex === -1) {
      return res.status(404).json({ error: "Alert not found" });
    }

    guestStore.alerts.splice(alertIndex, 1);

    res.json({
      success: true,
      message: "Alert dismissed successfully"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to dismiss alert" });
  }
});

// CLEAR all alerts
app.delete("/api/alerts", (req, res) => {
  try {
    guestStore.alerts = [];

    res.json({
      success: true,
      message: "All alerts cleared"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to clear alerts" });
  }
});

// GET guest report
app.get("/api/guests/report/summary", (req, res) => {
  try {
    const dietarySummary = {};
    guestStore.guests.forEach(guest => {
      guest.dietaryRequirements.forEach(diet => {
        dietarySummary[diet] = (dietarySummary[diet] || 0) + 1;
      });
    });

    const report = {
      totalGuests: guestStore.guests.length,
      dietarySummary,
      specialNeedsSummary: {
        wheelchairAccessible: guestStore.guests.filter(g => g.wheelchairAccessible).length,
        mobilityAssistance: guestStore.guests.filter(g => g.mobilityAssistance).length
      },
      guestsList: guestStore.guests,
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// 🔥 HOTEL SEARCH API
app.post("/api/hotels", async (req, res) => {
  try {
    const { CityId, CheckInDate, CheckOutDate, Rooms } = req.body;

    // Validate required fields
    if (!CityId || !CheckInDate || !CheckOutDate || !Rooms) {
      return res.status(400).json({
        error: "Missing required fields: CityId, CheckInDate, CheckOutDate, Rooms",
        received: req.body
      });
    }

    console.log(`[Hotel Search] Searching: City=${CityId}, CheckIn=${CheckInDate}, CheckOut=${CheckOutDate}, Rooms=${Rooms}`);

    // Call TBO API with proper formatting
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

    // Return error with more details
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

// ============================================
// PRICING API ENDPOINTS
// ============================================

// Pricing configuration
const PRICING_CONFIG = {
  TAX_RATE: 0.12,           // 12% GST
  SERVICE_FEE_RATE: 0.05,  // 5% service fee
  GROUP_DISCOUNT_RATE: 0.10, // 10% discount for groups > 5
  EARLY_BIRD_DISCOUNT_RATE: 0.05, // 5% early bird discount
  EARLY_BIRD_DAYS: 30,      // Days in advance for early bird
  GROUP_SIZE_THRESHOLD: 5, // Min group size for group discount
};

// Calculate number of nights
const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 1;
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
};

// Calculate days until check-in
const daysUntilCheckIn = (checkInDate) => {
  if (!checkInDate) return 0;
  
  const checkIn = new Date(checkInDate);
  const today = new Date();
  const diffTime = checkIn - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// Calculate dynamic pricing
app.post("/api/pricing/calculate", (req, res) => {
  try {
    const { hotel, checkInDate, checkOutDate, rooms, memberCount, customSplits } = req.body;

    if (!hotel || !hotel.Price) {
      return res.status(400).json({
        error: "Hotel data with price is required"
      });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = hotel.Price.TotalPrice || 0;

    // Calculate additional costs
    const tax = Math.round(basePrice * PRICING_CONFIG.TAX_RATE);
    const serviceFee = Math.round(basePrice * PRICING_CONFIG.SERVICE_FEE_RATE);
    
    // Calculate discounts
    const groupDiscount = memberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD 
      ? Math.round(basePrice * PRICING_CONFIG.GROUP_DISCOUNT_RATE)
      : 0;
    
    const daysUntil = daysUntilCheckIn(checkInDate);
    const earlyBirdDiscount = daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS
      ? Math.round(basePrice * PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE)
      : 0;
    
    const totalDiscount = groupDiscount + earlyBirdDiscount;

    // Calculate final totals
    const subtotal = basePrice + tax + serviceFee;
    const total = subtotal - totalDiscount;

    // Calculate per person and per room
    const validMemberCount = memberCount || 1;
    const validRooms = rooms || 1;
    const perPerson = Math.round(total / validMemberCount);
    const perRoom = Math.round(total / validRooms);

    res.json({
      success: true,
      data: {
        // Base price info
        basePrice: {
          perNight: Math.round(basePrice / nights),
          totalForNights: basePrice,
          perRoomPerNight: Math.round(basePrice / (nights * validRooms))
        },
        
        // Breakdown
        breakdown: {
          basePrice,
          tax,
          serviceFee,
          groupDiscount,
          earlyBirdDiscount,
          totalDiscount,
          subtotal,
          total
        },
        
        // Allocation
        allocation: {
          nights,
          rooms: validRooms,
          memberCount: validMemberCount,
          perPerson,
          perRoom
        },
        
        // Discount status
        discounts: {
          earlyBird: {
            applies: daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS,
            daysUntil,
            requiredDays: PRICING_CONFIG.EARLY_BIRD_DAYS,
            rate: PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE * 100,
            amount: earlyBirdDiscount
          },
          group: {
            applies: validMemberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD,
            memberCount: validMemberCount,
            threshold: PRICING_CONFIG.GROUP_SIZE_THRESHOLD,
            rate: PRICING_CONFIG.GROUP_DISCOUNT_RATE * 100,
            amount: groupDiscount
          }
        },
        
        // Configuration used
        config: {
          taxRate: PRICING_CONFIG.TAX_RATE * 100,
          serviceFeeRate: PRICING_CONFIG.SERVICE_FEE_RATE * 100
        }
      }
    });

  } catch (error) {
    console.error("[Pricing Calculation Error]", error.message);
    res.status(500).json({
      error: "Failed to calculate pricing",
      message: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
  console.log("Guest Preferences API endpoints available:");
  console.log("  GET    /api/guests");
  console.log("  POST   /api/guests");
  console.log("  DELETE /api/guests/:id");
  console.log("  GET    /api/alerts");
  console.log("  DELETE /api/alerts/:id");
  console.log("\nPricing API endpoints available:");
  console.log("  POST   /api/pricing/calculate");
});
