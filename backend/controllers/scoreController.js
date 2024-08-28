const Score = require("../models/Score");

// Function to handle score submission
exports.submitScores = async (req, res) => {
  try {
    const scores = req.body;

    // Create new scores in the database
    const savedScores = await Score.insertMany(scores);

    res.status(201).json(savedScores);
  } catch (error) {
    res.status(400).json({ msg: "Error saving scores", error: error.message });
  }
};
