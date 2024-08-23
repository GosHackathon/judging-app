const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // Reference to Team model
});

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = Judge;
