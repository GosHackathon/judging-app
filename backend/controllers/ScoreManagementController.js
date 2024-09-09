const Score = require('../models/Score');
const JudgeGroup = require('../models/JudgeGroup');

class ScoreManagementController {
  async getScoreManagementData() {
    try {
      // Fetch all judge groups with their judges and teams
      const judgeGroups = await JudgeGroup.find().lean();
      //console.log('Fetched judge groups:', judgeGroups); // Debug log

      // Create a map of all judges and their assigned teams, including group names
      const judgeTeamMap = new Map();
      judgeGroups.forEach(group => {
        group.judges.forEach(judge => {
          // Adding judgeGroupName to the map
          judgeTeamMap.set(judge.name, {
            teams: group.teams.map(team => team.name),
            groupName: group.groupName
          });
        });
      });
     // console.log('Judge team map:', Array.from(judgeTeamMap)); // Debug log

      // Fetch all scores
      const scores = await Score.find().lean();
      //console.log('Fetched scores:', scores); // Debug log

      // Prepare processed data
      const processedData = [];
      //console.log('scores123:', scores);
      //console.log('scores123:', judgeTeamMap);
      // Loop through all judge-team combinations (whether or not they have scores)
      judgeTeamMap.forEach((value, judgeName) => {
        const { teams, groupName } = value;
        teams.forEach(teamName => {
          //console.log(`Processing judge: ${judgeName}, team: ${teamName}`);

          // Find the score if it exists
          
          const scoreEntry = scores.find(score => 
            score.judgeName.toLowerCase() === judgeName.toLowerCase() && 
            score.team.toLowerCase() === teamName.toLowerCase()
          );         // console.log(`Score Entry Found:`, scoreEntry);


          if (scoreEntry) {
            // If the score exists, process it as submitted
            let scoreArray = new Array(5).fill('-');
            scoreEntry.teamScores.forEach((ts, index) => {
              scoreArray[index] = ts.score;
            });

            processedData.push({
              judgeName: judgeName,
              teamName: teamName,
              scores: scoreArray,
              totalScore: scoreEntry.totalScore,
              status: 'Submitted',
              judgeGroupName: groupName // Add the group name here
            });
          } else {
            // If no score exists, mark as pending
            processedData.push({
              judgeName: judgeName,
              teamName: teamName,
              scores: new Array(5).fill('-'),
              totalScore: '-',
              status: 'Pending',
              judgeGroupName: groupName // Add the group name here
            });
          }
        });
      });

      //console.log('Processed data:', processedData); // Debug log

      // Return the combined results
      return processedData;
    } catch (error) {
      console.error('Error in getScoreManagementData:', error);
      throw error;
    }
  }
}

module.exports = new ScoreManagementController();
