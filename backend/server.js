import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
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
});
