const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");
const userRoutes = require("./routes/user");
const mainJudgeRoutes = require("./routes/mainJudgeRoutes");
const teamManagementRoutes = require("./routes/teamManagementRoutes");
const teamListRoutes = require("./routes/teamList");
const teamRoutes = require('./routes/teams');
const judgeListRoutes = require('./routes/judgeList');
const finalScoreRoutes = require('./routes/finalScore');
const leaderboardRoutes = require('./routes/leaderboard'); // Adjust path as needed
const scoreManagementRouter = require('./routes/scoreManagementRouter');
const contactUsRouter = require('./routes/contactUsRouter');


// Initialize Express app and HTTP server
const app = express();
app.use(bodyParser())

const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware setup
app.use(express.json()); // For parsing application/json
app.use(helmet()); // Security headers
app.use(fileUpload());

app.use(cors());
//app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Uncomment if using a specific origin

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Handle preflight requests
app.options("*", cors());

// Ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/main-judge", mainJudgeRoutes);
app.use("/api/team-management", teamManagementRoutes);
app.use("/api/teamList", teamListRoutes);
app.use('/api/teams', teamRoutes); // Use the new route
app.use('/api/judgeList', judgeListRoutes);
app.use('/api/finalscore', finalScoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes); // Register the leaderboard routes
app.use('/api/scores/management', scoreManagementRouter);
app.use('/api/contactus', contactUsRouter);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("scoreUpdated", (data) => io.emit("scoreUpdated", data));

  socket.on("disconnect", () => console.log("User disconnected"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
