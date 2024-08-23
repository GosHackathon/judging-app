const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamMembers: {
    type: [String], // Array of strings to hold member names
    required: false,
  },
  teamEmail: {
    type: String,
    required: true,
    unique: true,
  },
  allocatedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge',
    required: false, // Make it optional initially
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
