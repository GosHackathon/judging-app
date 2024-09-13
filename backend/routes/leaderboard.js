// routes/leaderboard.js

const express = require('express');
const router = express.Router();
const { getLeaderboard, downloadFinalScoreSpreadsheet } = require('../controllers/LeaderboardController');

// Define routes
router.get('/final-scores', getLeaderboard);
router.get('/final-scores/download', downloadFinalScoreSpreadsheet);

module.exports = router;
