const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE: Add a new score
router.post("/", authMiddleware, async (req, res) => {
  const { entry, criteria, score } = req.body;

  // Check if all required fields are provided
  if (!entry || !criteria || !score) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  try {
    // Create a new score document with the judge information from the middleware
    const newScore = new Score({
      judge: req.userId, // Attach the judge ID from the middleware
      entry,
      criteria,
      score,
    });

    // Save the score to the database
    const savedScore = await newScore.save();
    res.status(201).json(savedScore); // Respond with the saved score
  } catch (err) {
    console.error("Error saving score:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// READ: Get all scores
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch all scores and populate the judge field
    const scores = await Score.find().populate("judge", ["name"]); // Adjust the fields as needed
    res.status(200).json(scores); // Respond with the list of scores
  } catch (err) {
    console.error("Error fetching scores:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
