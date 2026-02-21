import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
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
import groupPlanRoutes from "./routes/groupPlanRoutes.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Track connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join group room (for group plan page)
  socket.on('join-group', (groupId) => {
    socket.join(`group:${groupId}`);
    console.log(`📥 Client ${socket.id} joined group: ${groupId}`);
  });

  // Leave group room
  socket.on('leave-group', (groupId) => {
    socket.leave(`group:${groupId}`);
    console.log(`📤 Client ${socket.id} left group: ${groupId}`);
  });

  // Join admin room
  socket.on('admin:join', () => {
    socket.join('admin');
    console.log(`👑 Admin ${socket.id} joined admin room`);
  });

  // User authentication for tracking
  socket.on('user:register', (userData) => {
    connectedUsers.set(socket.id, userData);
    io.to('admin').emit('admin:users-connected', connectedUsers.size);
  });

  // Handle pricing update broadcast
  socket.on('pricing:update', (data) => {
    io.to(`group:${data.groupId}`).emit('pricing:updated', data);
  });

  // Handle payment update broadcast
  socket.on('payment:update', (data) => {
    io.to(`group:${data.groupId}`).emit('payment:updated', data);
    io.to('admin').emit('payment:updated', data);
  });

  // Handle member join broadcast
  socket.on('member:join', (data) => {
    io.to(`group:${data.groupId}`).emit('member:joined', data);
    io.to('admin').emit('member:joined', data);
  });

  // Handle booking confirmation broadcast
  socket.on('booking:confirm', (data) => {
    io.to(`group:${data.groupId}`).emit('booking:confirmed', data);
    io.to('admin').emit('booking:confirmed', data);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    connectedUsers.delete(socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.send("🏨 Group Travel Backend API Running Successfully");
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/group-plans", groupPlanRoutes);

/* =========================================================
   TBO HOTEL SEARCH
========================================================= */

app.post("/api/hotels", async (req, res) => {
  try {
    const { CityId, CheckInDate, CheckOutDate, Rooms } = req.body;

    if (!CityId || !CheckInDate || !CheckOutDate || !Rooms) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const soapBody = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <HotelSearch xmlns="http://www.tbotechnology.in/">
      <UserName>${process.env.TBO_USERNAME}</UserName>
      <Password>${process.env.TBO_PASSWORD}</Password>
      <CityId>${CityId}</CityId>
      <CheckInDate>${CheckInDate}</CheckInDate>
      <CheckOutDate>${CheckOutDate}</CheckOutDate>
      <IsNearBySearchAllowed>false</IsNearBySearchAllowed>
      <NoOfRooms>${Rooms}</NoOfRooms>
      <GuestNationality>IN</GuestNationality>
      <RoomGuests>
        <RoomGuest>
          <NoOfAdults>2</NoOfAdults>
          <NoOfChild>0</NoOfChild>
          <ChildAge></ChildAge>
        </RoomGuest>
      </RoomGuests>
      <Currency>INR</Currency>
      <ResultCount>20</ResultCount>
      <ResponseTime>23</ResponseTime>
    </HotelSearch>
  </soap:Body>
</soap:Envelope>
`;

    const response = await axios.post(
      process.env.TBO_API_URL,
      soapBody,
      {
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          "SOAPAction": "http://www.tbotechnology.in/HotelSearch"
        },
        timeout: 30000
      }
    );

    console.log("TBO RAW XML:", response.data);

    res.send(response.data);

  } catch (error) {
    console.error("TBO ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "TBO Hotel Search Failed",
      details: error.response?.data || error.message
    });
  }
});

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(notFound);
app.use(errorHandler);

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI}`);
  console.log("🔌 Socket.io ready for connections");
});
