const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as needed
const User = require("../models/User"); // Adjust the path as needed

const router = express.Router();

// @route    GET /api/userData
// @desc     Get user data
// @access   Private
router.get("/userData", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.judge.id); // req.judge.id is set by authMiddleware
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
