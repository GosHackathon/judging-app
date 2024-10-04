const mongoose = require('mongoose');

const judgeGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,  // Ensure unique group names
  },
  judges: [
    { 
      judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadJudge', required: true },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,  // Ensure unique judge emails
      },
    },
  ],
  teams: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UploadTeam',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
});

const JudgeGroup = mongoose.model('JudgeGroup', judgeGroupSchema);

module.exports = JudgeGroup;
