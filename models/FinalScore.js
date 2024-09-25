// models/FinalScore.js

const mongoose = require('mongoose');

const finalScoreSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JudgeGroup',
    required: true,
  },
  judgeGroup: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  obtainedScore: {
    type: Number,
    required: true,
  },
  criteria1: {
    type: String,
    required: true,
  },
  criteria1Score: {
    type: Number,
    required: true,
  },
  criteria2: {
    type: String,
    required: true,
  },
  criteria2Score: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('FinalScore', finalScoreSchema);
