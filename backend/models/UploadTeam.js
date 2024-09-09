const mongoose = require('mongoose');

const uploadTeamSchema = new mongoose.Schema({
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

const UploadTeam = mongoose.model('UploadTeam', uploadTeamSchema);

module.exports = UploadTeam;
