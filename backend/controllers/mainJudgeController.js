// controllers/mainJudgeController.js
const MainJudge = require("../models/MainJudge");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to handle Main Judge login
const loginMainJudge = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mainJudge = await MainJudge.findOne({ email });
    if (!mainJudge) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, mainJudge.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: mainJudge.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      mainJudge: { id: mainJudge.id, email: mainJudge.email },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = { loginMainJudge };
