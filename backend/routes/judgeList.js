const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');
const JudgeGroup = require('../models/JudgeGroup'); // Assuming you have a JudgeGroup model

// Get all judges
router.get('/', async (req, res) => {
  try {
    // Fetch judges and populate their associated JudgeGroup
    const judges = await Judge.find()

    // If you need to flatten the teams back into the Judge model's teams array:
    // const modifiedJudges = judges.map(judge => {
    //   if (judge.judgeGroup) {
    //     judge.teams = judge.judgeGroup.teams.map(team => team._id);
    //   }
    //   return judge;
    // });

    res.json(judges); // Send back modified judges with populated teams
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
