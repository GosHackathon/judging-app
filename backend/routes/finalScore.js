const express = require('express');
const router = express.Router();

const { getJudgeGroups, fetchJudgesAndTeams, fetchTeamScores,submitFinalScore } = require('../controllers/finalScoreController');

// Route to get all judge groups
router.get('/judgeGroups', getJudgeGroups);

// Route to get judges and teams for a specific judge group
router.get('/judgeGroups/:groupId/details', fetchJudgesAndTeams);

// Route to get the team scores for a specific judge group
router.get('/judgeGroups/:groupId/scores', fetchTeamScores);

router.post('/submit', submitFinalScore );
module.exports = router;
