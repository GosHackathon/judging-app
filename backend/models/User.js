const mongoose = require("mongoose");
const Team = require("./Team"); // Import the Team model

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Reference to Team model
});

module.exports = mongoose.model("User", UserSchema);
