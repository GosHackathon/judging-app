const JudgeGroup = require('../models/JudgeGroup');
const Score = require('../models/Score');
const UploadTeam = require('../models/UploadTeam');
const FinalScore = require('../models/FinalScore');
// Controller function to fetch all judge groups
const getJudgeGroups = async (req, res) => {
  try {
    // Fetch all judge groups
    const judgeGroups = await JudgeGroup.find();
    res.status(200).json(judgeGroups);
  } catch (error) {
    // Log and handle errors
    console.error("Error fetching judge groups:", error);
    res.status(500).json({ msg: 'Failed to fetch judge groups.' });
  }
};

// Controller function to fetch judges and teams for a specific judge group
const fetchJudgesAndTeams = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Find the JudgeGroup by ID and populate judges and teams with team details
    const judgeGroup = await JudgeGroup.findById(groupId)
      .populate('judges')              // Populate judges details
      .populate({
        path: 'teams.teamId',          // Populate teamId field
        select: 'teamName'                 // Select only the name field from UploadTeam
      })
      .exec();

    if (!judgeGroup) {
      return res.status(404).json({ msg: 'Judge group not found.' });
    }

    // Prepare the response
    res.status(200).json({
      judges: judgeGroup.judges,
      teams: judgeGroup.teams.map(team => team.teamId), // Extract team details
      scores: {} // Empty scores as we are not using them here
    });
  } catch (error) {
    console.error('Error fetching judges and teams:', error);
    res.status(500).json({ msg: 'Failed to fetch judges or teams.' });
  }
};

const fetchTeamScores = async (req, res) => {
  const { groupId } = req.params;

  try {
    //console.log('Fetching judge group with ID:', groupId);

    // Fetch the group with judges and teams
    const judgeGroup = await JudgeGroup.findById(groupId)
      .populate('judges')
      .populate({
        path: 'teams.teamId',          // Populate teamId field
        select: 'teamName'             // Select only the name field from UploadTeam
      })
      .exec();

    if (!judgeGroup) {
     // console.log('Judge group not found.');
      return res.status(404).json({ msg: 'Judge group not found.' });
    }

    //console.log('Judge group found:', judgeGroup);

    const teams = judgeGroup.teams;
    const judges = judgeGroup.judges;

    // Ensure you are accessing the correct path for the teamName
    //console.log('Teams:', teams.map(team => team.teamId.teamName));
    //console.log('Judges:', judges.map(judge => judge.name));

    // Fetch all scores for the teams and judges in this group at once
    const scores = await Score.find({
      team: { $in: teams.map(team => team.teamId.teamName) }, // Match team field in Score schema
      judgeName: { $in: judges.map(judge => judge.name) }
    });

    //console.log('Fetched scores:', scores);

    const finalTeamScores = [];

    // Iterate through each team in the group
    for (const team of teams) {
      let totalScore = 0;
      let scoreCount = 0;
      const judgeScores = new Set();  // Use a set to avoid duplicates

      //console.log(`Calculating scores for team: ${team.teamId.teamName}`);

      // Filter scores related to this team
      const teamScores = scores.filter(score => score.team === team.teamId.teamName);

      //console.log(`Scores for team ${team.teamId.teamName}:`, teamScores);

      // For each judge in the group, check if they have scored this team
      for (const judge of judges) {
        const judgeScore = teamScores.find(score => score.judgeName === judge.name);

        if (judgeScore && !judgeScores.has(judge.name)) {
          judgeScores.add(judge.name);  // Track that this judge has submitted a score
          totalScore += judgeScore.totalScore;  // Add the score to the total
          scoreCount += 1;  // Increase the count of valid scores

          //console.log(`Judge ${judge.name} scored team ${team.teamId.teamName}: ${judgeScore.totalScore}`);
        } else {
         // console.log(`Judge ${judge.name} has not scored team ${team.teamId.teamName}`);
        }
      }

      // Calculate the average score for the team
      const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

      //console.log(`Final scores for team ${team.teamId.teamName} - Average Score: ${averageScore}, Total Score: ${totalScore}, Number of Scores: ${scoreCount}`);

      // Add the team's final score details to the response array
      finalTeamScores.push({
        teamName: team.teamId.teamName,  // Ensure each team has its unique name
        averageScore: averageScore,
        totalScore: totalScore,
        numberOfScores: scoreCount,
      });
    }

   // console.log('Final team scores:', finalTeamScores);

    // Return the final team scores
    res.status(200).json({ finalTeamScores });
  } catch (error) {
    console.error("Error calculating team scores:", error);
    res.status(500).json({ msg: 'Failed to calculate team scores.' });
  }
};

const submitFinalScore = async (req, res) => {
  try {
    const { groupId, scores } = req.body;
   // console.log('Received groupId:', groupId);
   // console.log('Received scores:', scores);

    // Validate that groupId and scores are provided
    if (!groupId || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ message: 'Invalid input: groupId and scores are required' });
    }

    // Fetch the judgeGroup based on groupId
    const judgeGroup = await JudgeGroup.findOne({ _id: groupId });
    
    if (!judgeGroup) {
      return res.status(404).json({ message: 'JudgeGroup not found' });
    }

    // Validate each score entry
    for (const score of scores) {
      const { teamName, obtainedScore, criteria1, criteria1Score, criteria2, criteria2Score, totalScore } = score;
      if (!teamName || obtainedScore === undefined || !criteria1 || criteria1Score === undefined || !criteria2 || criteria2Score === undefined || totalScore === undefined) {
        return res.status(400).json({ message: 'Invalid score entry' });
      }
    }

    // Create or update FinalScore documents based on the scores
    for (const score of scores) {
      await FinalScore.findOneAndUpdate(
        { groupId, teamName: score.teamName },
        {
          judgeGroup: judgeGroup.groupName, // Add the judgeGroup information
          ...score
        },
        { upsert: true, new: true } // upsert option creates a new document if none exists, new returns the updated document
      );
    }

    res.status(201).json({ message: 'Final scores submitted successfully' });
  } catch (error) {
    console.error('Error submitting final score:', error.message);
    res.status(500).json({ message: 'Error submitting final score', error: error.message });
  }
};

module.exports = {
  getJudgeGroups,
  fetchJudgesAndTeams,
  fetchTeamScores,
  submitFinalScore 
};
