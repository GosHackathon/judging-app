const mongoose = require("mongoose");

// Define the MainJudge schema
const MainJudgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team", // Reference to the Team model
    },
  ],
});

// Export the MainJudge model
module.exports = mongoose.model("MainJudge", MainJudgeSchema);
