const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  judge: {
    type: String, // Adjusted to String for judge's name
    required: true,
  },
  entry: {
    type: String,
    required: true,
  },
  criteria: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Score", ScoreSchema);
