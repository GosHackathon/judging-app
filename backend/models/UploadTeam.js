const mongoose = require('mongoose');

const uploadTeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true, // Ensure teamName is unique to avoid duplicates
  },
  teamMembers: {
    type: [String], // Array of strings to hold member names
    required: false,
  },
  eligibleForIndigenousInnovator: {
    type: Boolean, // true or false depending on eligibility
    required: true, // Must be provided
  },
  eligibleForGirlsWhoInnovate: {
    type: Boolean, // true or false depending on eligibility
    required: true, // Must be provided
  },
  allocatedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge',
    required: false, // Make it optional initially
  },
});

const UploadTeam = mongoose.model('UploadTeam', uploadTeamSchema);

module.exports = UploadTeam;
