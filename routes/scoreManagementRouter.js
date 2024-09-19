const express = require('express');
const router = express.Router();
const ScoreManagementController = require('../controllers/ScoreManagementController');

router.get('/', async (req, res) => {
  try {
    const scoreManagementData = await ScoreManagementController.getScoreManagementData();
    res.status(200).json(scoreManagementData);
  } catch (error) {
    console.error('Error fetching score management data:', error);
    res.status(500).json({ message: 'Error fetching score management data' });
  }
});

module.exports = router;