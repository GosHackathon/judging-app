const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');
const JudgeGroup = require('../models/JudgeGroup');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is correctly set up

// Utility function to get team names based on judge's team IDs
async function getTeamNamesForJudge(judge) {
    try {
        const teamIds = judge.teams;

        // Fetch the teams from JudgeGroup model
        const judgeGroups = await JudgeGroup.find({ 'teams._id': { $in: teamIds } });

        // Extract team names
        const teamNames = [];
        judgeGroups.forEach(judgeGroup => {
            judgeGroup.teams.forEach(team => {
                if (teamIds.includes(team._id)) {
                    teamNames.push(team.name);
                }
            });
        });

        return teamNames;
    } catch (err) {
        console.error("Error fetching team names:", err);
        return [];
    }
}

// Get judge and populate their associated teams
router.get('/', authMiddleware, async (req, res) => {
    
    try {
        const judgeId = req.userId;

        // Fetch the judge by ID
        const judge = await Judge.findById(judgeId);

        if (!judge) {
            return res.status(404).json({ msg: 'Judge not found' });
        }

        // Check if teams array is defined
        if (!judge.teams || judge.teams.length === 0) {
            return res.status(404).json({ msg: 'No teams found for this judge' });
        }

        // Fetch team names based on the judge's team IDs
        const teamNames = await getTeamNamesForJudge(judge);

        // Log populated judge and team names for debugging
        

        res.json(teamNames); // Send back the team names
    } catch (err) {
        console.error('Error fetching judges:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
