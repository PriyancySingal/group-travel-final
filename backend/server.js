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
import insightRoutes from "./routes/insightRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ------------------ MIDDLEWARE ------------------ */

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

/* ------------------ HEALTH CHECK ------------------ */

app.get("/", (req, res) => {
  res.send("🚀 Group Travel Backend Running");
});

/* ------------------ ROUTES ------------------ */

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/insights", insightRoutes);

/* ------------------ HOTEL SEARCH (STABLE VERSION) ------------------ */

app.post("/api/hotels", async (req, res) => {
  try {
    const { CityCode, CheckIn, CheckOut, Adults } = req.body;

    if (!CityCode || !CheckIn || !CheckOut) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const END_USER_IP = "106.221.238.172";

    console.log("🔍 Searching hotels for city:", CityCode);

    /* STEP 1: GET HOTEL CODES */
    const hotelCodeResponse = await axios.post(
      `${process.env.TBO_API_URL}/TBOHotelCodeList`,
      {
        CityCode: String(CityCode),
        IsDetailedResponse: "false",
        EndUserIp: END_USER_IP
      },
      {
        auth: {
          username: process.env.TBO_USERNAME,
          password: process.env.TBO_PASSWORD
        }
      }
    );

    const hotelCodes = hotelCodeResponse.data?.Hotels
      ?.slice(0, 30) // safe limit
      .map(h => h.HotelCode)
      .join(",");

    if (!hotelCodes) {
      return res.json({
        Status: { Code: 200 },
        HotelResult: []
      });
    }

    /* STEP 2: SEARCH AVAILABILITY + PRICING */
    const searchResponse = await axios.post(
      `${process.env.TBO_API_URL}/Search`,
      {
        CheckIn,
        CheckOut,
        HotelCodes: hotelCodes,
        GuestNationality: "IN",
        PaxRooms: [
          {
            Adults: Adults || 1,
            Children: 0,
            ChildrenAges: []
          }
        ],
        ResponseTime: 10,
        IsDetailedResponse: false,
        EndUserIp: END_USER_IP
      },
      {
        auth: {
          username: process.env.TBO_USERNAME,
          password: process.env.TBO_PASSWORD
        }
      }
    );

    console.log("✅ Search Status:", searchResponse.data?.Status);

    return res.json(searchResponse.data);

  } catch (error) {
    console.error("❌ Hotel Search Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Hotel search failed",
      details: error.response?.data || error.message
    });
  }
});

/* ------------------ ERROR HANDLER ------------------ */

app.use(notFound);
app.use(errorHandler);

/* ------------------ START SERVER ------------------ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});