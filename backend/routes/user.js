// routes/user.js

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path if needed
const Judge = require("../models/Judge"); // Assuming Judge model is used for user data

const router = express.Router();

// @route    GET /api/userData
// @desc     Get logged-in judge's data
// @access   Private
router.get("/userData", authMiddleware, async (req, res) => {
  try {
    const judge = await Judge.findById(req.judge.id).select("-password"); // exclude password
    res.json(judge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
