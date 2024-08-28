// controllers/judgeManagementController.js

const Judge = require("../models/Judge"); // Adjust the path based on your directory structure

// Fetch all judges
exports.getJudges = async (req, res) => {
  try {
    const judges = await Judge.find(); // Adjust query if necessary
    res.json(judges);
  } catch (err) {
    console.error("Error fetching judges:", err);
    res.status(500).json({ message: "Error fetching judges" });
  }
};
