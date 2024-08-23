const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Judge = require("../models/Judge");
const MainJudge = require("../models/MainJudge");

const Team = require("../models/Team"); // Import the Team model if you have one

// @route    GET /api/user/userData
// @desc     Get user data
// @access   Private
router.get("/userData", authMiddleware, async (req, res) => {
  try {
    let user;

    if (req.userType === "judge") {
      user = await Judge.findById(req.userId)
        .populate("teams") // Populate the teams field
        .select("-password");
    } else if (req.userType === "mainJudge") {
      user = await MainJudge.findById(req.userId)
        .populate("teams") // Populate the teams field (if applicable)
        .select("-password");
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
