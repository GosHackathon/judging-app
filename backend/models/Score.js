const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "Judge" },
  entry: { type: String, required: true },
  criteria: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", ScoreSchema);
