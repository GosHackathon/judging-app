const express = require("express");
const Score = require("../models/Score");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// @route    POST api/scores
// @desc     Submit a score
// @access   Private
router.post("/", authMiddleware, async (req, res) => {
  const { entry, criteria, score } = req.body;

  try {
    const newScore = new Score({
      judge: req.judge.id,
      entry,
      criteria,
      score,
    });

    const savedScore = await newScore.save();
    res.json(savedScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/scores
// @desc     Get all scores
// @access   Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find().populate("judge", ["name"]);
    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
