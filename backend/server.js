const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Log the MONGO_URI to verify it is being loaded
console.log("MongoDB URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// CORS middleware
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable credentials
  })
);

// Handle preflight requests
app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("scoreUpdated", (data) => {
    io.emit("scoreUpdated", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
