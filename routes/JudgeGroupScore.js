// Function to process scores and group by groupName
const processScoresByGroup = async () => {
    try {
      // Fetch all scores from the database
      const scores = await Score.find().exec();
  
      // Group scores by groupName
      const groupedScores = scores.reduce((acc, score) => {
        if (!acc[score.groupName]) {
          acc[score.groupName] = [];
        }
        acc[score.groupName].push(score);
        return acc;
      }, {});
  
      // Process each group
      const result = Object.keys(groupedScores).map((groupName) => {
        const scoresInGroup = groupedScores[groupName];
        
        // Extract unique team names and judge names
        const teamNames = [...new Set(scoresInGroup.map(score => score.teamName))];
        const judgeNames = [...new Set(scoresInGroup.map(score => score.judgeName))];
  
        // Check if all judges submitted the same scores
        const criteriaScores = scoresInGroup.reduce((acc, score) => {
          if (!acc[score.teamName]) {
            acc[score.teamName] = {};
          }
          if (!acc[score.teamName][score.criteria]) {
            acc[score.teamName][score.criteria] = [];
          }
          acc[score.teamName][score.criteria].push(score.score);
          return acc;
        }, {});
  
        // Determine if scores are consistent across judges
        const consistentScores = Object.keys(criteriaScores).reduce((acc, teamName) => {
          const criteria = Object.keys(criteriaScores[teamName]);
          let allMatch = true;
          const teamScores = {};
  
          criteria.forEach((criterion) => {
            const scoresForCriterion = criteriaScores[teamName][criterion];
            const uniqueScores = [...new Set(scoresForCriterion)];
  
            if (uniqueScores.length > 1) {
              allMatch = false;
            }
            
            // Aggregate scores for final result
            teamScores[criterion] = uniqueScores[0] || null;
          });
  
          if (allMatch) {
            const totalScore = Object.values(teamScores).reduce((sum, score) => sum + (score || 0), 0);
  
            acc.push({
              groupName,
              teamNames,
              judgeNames,
              criteriaScores: teamScores,
              finalScore: totalScore
            });
          }
  
          return acc;
        }, []);
  
        return consistentScores;
      }).flat();
  
      return result;
    } catch (error) {
      console.error('Error processing scores:', error);
      throw error;
    }
  };
  
  module.exports = processScoresByGroup;
  