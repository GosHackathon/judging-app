const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  ],
  judges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Judge",
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
