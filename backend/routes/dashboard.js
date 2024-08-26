// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');
//const Team = require('../models/team');

// Route to get judge's assigned teams
router.get('/judge-dashboard', async (req, res) => {
  try {
    const judgeEmail = req.user.email; // Assuming `req.user` contains the logged-in judge's details
    const judge = await Judge.findOne({ email: judgeEmail }).populate('teams');

    if (!judge) {
      return res.status(404).json({ error: 'Judge not found' });
    }

    // Extracting team names
    const teamNames = judge.teams.map(team => team.name);

    // Sending the team names back to the front-end
    res.json({ teamNames });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
