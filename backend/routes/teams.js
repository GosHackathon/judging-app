// In your backend routes file (e.g., teamRoutes.js)
const express = require('express');
const router = express.Router();
const UploadTeam = require('../models/UploadTeam');

// Fetch team details by IDs
router.post('/teamsByIds', async (req, res) => {
  try {
    const teamIds = req.body.teamIds; // Array of team IDs
    const teams = await UploadTeam.find({ '_id': { $in: teamIds } });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
