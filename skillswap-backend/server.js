const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins (Dev + Production)
const allowedOrigins = [
  "http://localhost:3000",
  "https://skillswap-roulette.vercel.app", // Deployed frontend
];

// ✅ CORS Setup
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Environment Vars
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/swaps", require("./routes/swaps"));

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🌐 SkillSwap Backend is running");
});

// ✅ Socket.IO Setup
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Online Users Mapping
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Register user ID
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ Registered user ${userId} to socket ${socket.id}`);
  });

  // 💬 Private Messaging
  socket.on("private_message", ({ to, from, message }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("private_message", { from, message });
    }
  });

  // 📞 Call Initiation
  socket.on("call-user", ({ to, from }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { from });
    }
  });

  // 📡 WebRTC Offer
  socket.on("send-offer", ({ to, offer }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("receive-offer", { offer, from: socket.id });
    }
  });

  // 📡 WebRTC Answer
  socket.on("send-answer", ({ to, answer }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("receive-answer", { answer });
    }
  });

  // ❄️ ICE Candidate
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  // 🔴 Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
