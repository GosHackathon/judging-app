const Score = require('../models/Score');
const JudgeGroup = require('../models/JudgeGroup');

class ScoreManagementController {
  async getScoreManagementData() {
    try {
      // Fetch all judge groups with their judges and teams
      const judgeGroups = await JudgeGroup.find().lean();
      
      // Create a map of all judges (by judgeId) and their assigned teams, including group names
      const judgeTeamMap = new Map();
      judgeGroups.forEach(group => {
        group.judges.forEach(judge => {
          if (judge.judgeId) {
            judgeTeamMap.set(judge.judgeId.toString(), {
              teams: group.teams.map(team => team.name),
              groupName: group.groupName,
              judgeName: judge.name  // Ensure judge name is stored here
            });
          }
        });
      });

      console.log('Judge Team Map:', Array.from(judgeTeamMap.entries()));

      // Fetch all scores
      const scores = await Score.find().lean();

      console.log('Scores:', scores);

      // Prepare processed data
      const processedData = [];
      judgeTeamMap.forEach((value, judgeId) => {
        const { teams, groupName, judgeName } = value; // Retrieve judgeName from the map
        teams.forEach(teamName => {
          // Find the score if it exists
          const scoreEntry = scores.find(score =>
            score.judgeId && score.judgeId.toString() === judgeId &&
            score.team && score.team.toLowerCase() === teamName.toLowerCase()
          );

          if (scoreEntry) {
            // If the score exists, process it as submitted
            let scoreArray = new Array(5).fill('-');
            scoreEntry.teamScores.forEach((ts, index) => {
              scoreArray[index] = ts.score;
            });

            processedData.push({
              judgeName: judgeName, // Display judgeName
              teamName: teamName,
              scores: scoreArray,
              totalScore: scoreEntry.totalScore,
              status: 'Submitted',
              judgeGroupName: groupName // Add the group name here
            });
          } else {
            // If no score exists, mark as pending
            processedData.push({
              judgeName: judgeName, // Display judgeName
              teamName: teamName,
              scores: new Array(5).fill('-'),
              totalScore: '-',
              status: 'Pending',
              judgeGroupName: groupName // Add the group name here
            });
          }
        });
      });

      // Return the combined results
      return processedData;
    } catch (error) {
      console.error('Error in getScoreManagementData:', error);
      throw error;
    }
  }
}

module.exports = new ScoreManagementController();
