const mongoose = require("mongoose");

const JudgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Reference to Team model
});

module.exports = mongoose.model("Judge", JudgeSchema);
