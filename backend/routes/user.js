const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Judge = require("../models/Judge");
const MainJudge = require("../models/MainJudge");

// @route    GET /api/user/userData
// @desc     Get user data
// @access   Private
router.get("/userData", authMiddleware, async (req, res) => {
  try {
    let user;

    if (req.userType === "judge") {
      // Populate teams if necessary
      user = await Judge.findById(req.userId).populate('teams').select("-password");
    } else if (req.userType === "mainJudge") {
      // Populate teams if necessary
      user = await MainJudge.findById(req.userId).populate('teams').select("-password");
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
