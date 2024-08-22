const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as needed
const Judge = require("../models/Judge"); // Adjust the path as needed
const MainJudge = require("../models/MainJudge"); // Adjust the path as needed

const router = express.Router();

// @route    GET /api/user/userData
// @desc     Get user data
// @access   Private
router.get("/userData", authMiddleware, async (req, res) => {
  try {
    let user;

    if (req.userType === "judge") {
      user = await Judge.findById(req.userId).populate("teams"); // Populate teams field
    } else if (req.userType === "mainJudge") {
      user = await MainJudge.findById(req.userId).populate("teams"); // Populate teams field
    } else {
      return res.status(400).json({ msg: "Invalid user type" });
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
