const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Judge = require("../models/Judge");
const MainJudge = require("../models/MainJudge"); // Import the MainJudge model
const JudgeGroup = require("../models/JudgeGroup");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Function to get teams for a judge
async function getTeamsForJudge(judgeEmail) {
  try {
    // Find the JudgeGroup where the judge's email exists
    const judgeGroup = await JudgeGroup.findOne({
      'judges.email': judgeEmail
    }).populate('teams'); // Populate teams if it references the Team model

    console.log('JudgeGroup found:', judgeGroup);

    if (!judgeGroup) {
      return [];
    }

    // Return the teams associated with the JudgeGroup
    console.log('Teams found:', judgeGroup.teams);
    return judgeGroup.teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}
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
      judge.password = await bcrypt.hash(this.password, salt);

      // Save judge to database
      await judge.save();

      // Create payload for JWT
      const payload = {
        judge: {
          id: judge.id,
        },
      };

      // Sign token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST /api/auth/main-judge-signup
// @desc     Register a new Main Judge
// @access   Public
router.post(
  "/main-judge-signup",
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
      // Check if Main Judge already exists
      let mainJudge = await MainJudge.findOne({ email });
      if (mainJudge) {
        return res.status(400).json({ msg: "Main Judge already exists" });
      }

      // Create a new Main Judge
      mainJudge = new MainJudge({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      mainJudge.password = await bcrypt.hash(password, salt);

      // Save Main Judge to database
      await mainJudge.save();

      // Create payload for JWT
      const payload = {
        mainJudge: {
          id: mainJudge.id,
        },
      };

      // Sign token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST /api/auth/login
// @desc     Authenticate judge and get token
// @access   Public
// Login route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if judge exists
      let judge = await Judge.findOne({ email });
      if (!judge) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, judge.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Fetch associated teams from JudgeGroup schema
      const judgeGroup = await JudgeGroup.findOne({
        'judges.email': email
      }).populate('teams'); // Populate teams if it references the Team model

      if (!judgeGroup) {
        return res.status(404).json({ msg: "JudgeGroup not found" });
      }

      // Update or create Judge with team details
      judge.teams = judgeGroup.teams.map(team => team._id); // Update with team IDs
      await judge.save();
      // Optionally, populate the teams in the judge object before sending the response
      judge = await Judge.findById(judge._id).populate('teams');

      // Create payload for JWT
      const payload = {
        judge: {
          id: judge.id,
        },
      };

      // Sign token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      // Respond with token and updated judge data
      res.json({ token, judge });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


// @route    POST /api/auth/main-judge-login
// @desc     Authenticate Main Judge and get token
// @access   Public
router.post(
  "/main-judge-login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if Main Judge exists
      let mainJudge = await MainJudge.findOne({ email });
      if (!mainJudge) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, mainJudge.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create payload for JWT
      const payload = {
        mainJudge: {
          id: mainJudge.id,
        },
      };

      // Sign token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/judge/:email",authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;

    console.log(email, req.userType)

    // Find the judge by email
    let judge = await Judge.findOne({ email }).select("-password");


    if (!judge) {
      return res.status(404).json({ msg: "Judge not found" });
    }

    // Send the judge details
    res.json(judge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/judge/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    const { name, newEmail, password, confirmPassword } = req.body;

    let judgeData=null

    if (req.userType === "judge") {
      judgeData = await Judge.findOne({ email });
    } else if (req.userType === "mainJudge") {
      judgeData = await MainJudge.findOne({ email });
    }

    // Find the judge by emai
    if (!judgeData) {
      return res.status(404).json({ msg: "Judge not found" });
    }

    // Update name if provided
    if (name) {
      judgeData.name = name;
    }

    // Update email if newEmail is provided and it's different from current email
    if (newEmail && newEmail !== judgeData.email) {
      const emailExists = await Judge.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ msg: "New email is already in use" });
      }
      judgeData.email = newEmail;
    }

    // If password fields are provided, check if they match and update the password
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }

      // Hash the new password before saving it
      const salt = await bcrypt.genSalt(10);
      judgeData.password = await bcrypt.hash(password, salt);
    }

    // Save the updated judge details
    await judgeData.save();

    res.json({ msg: "Judge profile updated successfully", judgeData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



module.exports = router;
