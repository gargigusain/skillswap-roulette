// server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Setup for Express
app.use(
  cors({
    origin: ["http://localhost:3000", "https://skillswap-roulette.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const swapRoutes = require("./routes/swaps");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/swaps", swapRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🌐 SkillSwap Backend is running");
});

// ✅ Socket.IO Setup
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "https://skillswap-roulette.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // Register user ID to socket ID
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} registered with socket ${socket.id}`);
  });

  // 💬 Private chat message event
  socket.on("private_message", ({ to, from, message }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", { from, message });
    }
  });

  // 📞 Caller initiates call — notify callee of incoming call
  socket.on("call-user", ({ to, from }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { from });
    }
  });

  // 📡 WebRTC Offer
  socket.on("send-offer", ({ to, offer }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive-offer", { offer, from: socket.id });
    }
  });

  // 📡 WebRTC Answer
  socket.on("send-answer", ({ to, answer }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive-answer", { answer });
    }
  });

  // ❄️ ICE Candidate Exchange
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", { candidate });
    }
  });

  // 🔴 Disconnect Handler
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
