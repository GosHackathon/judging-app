// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Judge = require("../models/Judge");

const router = express.Router();

// @route    POST /api/auth/signup
// @desc     Register a new judge
// @access   Public
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if judge already exists
      let judge = await Judge.findOne({ email });
      if (judge) {
        return res.status(400).json({ msg: "Judge already exists" });
      }

      // Create a new judge
      judge = new Judge({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      judge.password = await bcrypt.hash(password, salt);

      // Save judge to database
      await judge.save();

      // Create payload for JWT
      const payload = {
        judge: {
          id: judge.id,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
