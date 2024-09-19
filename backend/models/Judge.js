const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge'},
  judgeGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JudgeGroup', // Reference to the JudgeGroup model
    required: false, // Make it optional if needed
  },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UploadTeam' }], // Reference to Team model
});

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = Judge;
