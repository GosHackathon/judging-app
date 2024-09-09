const mongoose = require('mongoose');
const UploadTeam = require('./UploadTeam');

// Define a sub-schema for the individual score entries within teamScores
const teamScoreSchema = new mongoose.Schema({
  entry: { type: String, required: true },
  criteria: { type: String, required: true },
  ratingText: { type: String, required: true }, // Added ratingText as it's part of the data
  score: { type: Number, required: true },
});

// Main schema for the scores
const scoreSchema = new mongoose.Schema({
  judgeName: { type: String, required: true, ref: 'JudgeGroup' }, // Reference to JudgeGroup
  teamScores: [teamScoreSchema], // Array of teamScoreSchema
  totalScore: { type: Number, required: true },
  team: { type: String, required: true, ref: 'UploadTeam' }

});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
