const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MainJudge = require("../models/MainJudge"); // Adjust the path if necessary
const authMiddleware = require("../middleware/authMiddleware"); // Import your authentication middleware

// Import the loginMainJudge function from the controller
const { loginMainJudge } = require("../controllers/mainJudgeController");

const router = express.Router();

// @route    POST /api/auth/main-judge-signup
// @desc     Register a new Main Judge
// @access   Public
router.post("/main-judge-signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    // Route to generate and download the Excel file
    router.get("/download-excel", downloadTeamTemplate);

    // Route to handle file upload
    router.post("/upload", uploadTeamFile);

    // Check if Main Judge already exists
    let mainJudge = await MainJudge.findOne({ email });
    if (mainJudge) {
      return res.status(400).json({ msg: "Main Judge already exists" });
    }

    // Create a new Main Judge
    mainJudge = new MainJudge({ name, email, password });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    mainJudge.password = await bcrypt.hash(password, salt);

    // Save the Main Judge to the database
    await mainJudge.save();

    // Generate a JWT token
    const payload = { user: { id: mainJudge.id, userType: "mainJudge" } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST /api/auth/main-judge-login
// @desc     Log in a Main Judge
// @access   Public
router.post("/main-judge-login", loginMainJudge); // Updated route path

// @route    GET /api/main-judge/data
// @desc     Get Main Judge data
// @access   Private
router.get("/data", authMiddleware, async (req, res) => {
  try {
    // Fetch the Main Judge's data by their ID, excluding the password
    const mainJudge = await MainJudge.findById(req.user.id).select("-password");
    if (!mainJudge) {
      return res.status(404).json({ msg: "Main Judge not found" });
    }
    res.json(mainJudge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
