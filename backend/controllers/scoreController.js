const Score = require("../models/Score");


// Function to submit scores
//
exports.submitScores = async (req, res) => {
  try {
    
    const { judgeId, judgeName, team, teamScores, totalScore } = req.body;

    // Log the incoming request data for debugging
    console.log("Received scores:", {
      judgeId,
      judgeName,
      team,
      teamScores,
      totalScore
    });

    // Validate that teamScores is an array and has the required fields
    //const isValid = Array.isArray(teamScores) && teamScores.every(score => 
     // score.judgeName && score.entry && score.criteria && score.score !== undefined
    //);
    const isValid = Array.isArray(teamScores) && teamScores.every(score => 
      // score.judge && typeof score.judge === 'string' &&
      score.judgeName && typeof score.judgeName === 'string' &&
      typeof score.entry === 'string' &&
      typeof score.criteria === 'string' &&
      typeof score.score === 'number' && !isNaN(score.score)
    );

    console.log("Is valid:", isValid);

    if (!isValid) {
      return res.status(400).json({ msg: "Missing required fields in the request." });
    }

    // Prepare the scores to be saved in the database
    const scoresToSave = teamScores.map(score => ({
      entry: score.entry,
      criteria: score.criteria,
      ratingText: score.ratingText,
      score: score.score
    }));

    let scoreSaveObj = new Score({
      judgeName,
      judgeId,
      totalScore,
      teamScores: scoresToSave,
      team: team
    });



    // Save the scores in the database

    console.log("Scores to save:", scoreSaveObj);

    scoreSaveObj.save()

    res.status(201).json({ scoreSaveObj, totalScore });
  } catch (error) {
    console.error("Error saving scores:", error.message);
    res.status(400).json({ msg: "Error saving scores", error: error.message });
  }
};

// Function to update an existing score
exports.updateScore = async (req, res) => {
  const { id } = req.params; // Get the score ID from the route parameter
  const { entry, criteria, score, team, totalScore } = req.body;

  // Check if all required fields are provided
  if (!entry || !criteria || score === undefined || !team || !totalScore) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  try {
    // Find the score by ID and update it with new details
    const updatedScore = await Score.findByIdAndUpdate(
      id,
      { entry, criteria, score, team, totalScore },
      { new: true, runValidators: true }
    );

    if (!updatedScore) {
      return res.status(404).json({ msg: "Score not found" });
    }

    res.status(200).json(updatedScore); // Respond with the updated score
  } catch (error) {
    console.error("Error updating score:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Function to get all scores
exports.getAllScores = async (req, res) => {
  try {
    // Fetch all scores
    const scores = await Score.find();
    res.status(200).json(scores); // Respond with the list of scores
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


exports.getScoresByGroup = async (req, res) => {
  console.log(req.query);
  const { groupId } = req.query;
  console.log(groupId);
  if (!groupId) {
    return res.status(400).json({ msg: "Group ID is required" });
  }

  try {
    // Query to fetch scores by group ID
    const scores = await Score.find({ 'team.groupId': groupId }); // Adjust according to your schema
    console.log(scores);
    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching scores by group:', error.message);
    res.status(500).json({ msg: "Error fetching scores", error: error.message });
  }
};
// Function to clear previously submitted scores
exports.clearScores = async (req, res) => {
  const { judgeId, team } = req.body;

  if (!judgeId || !team) {
    return res.status(400).json({ msg: "Judge ID and team are required" });
  }

  try {
    // Remove scores that match the judgeId and team
    await Score.deleteMany({ judgeId, team });
    res.status(200).json({ msg: 'Scores cleared successfully' });
  } catch (error) {
    console.error("Error clearing scores:", error.message);
    res.status(500).json({ msg: "Error clearing scores", error: error.message });
  }
};

// Function to get existing scores for a specific judge and team
exports.getExistingScores = async (req, res) => {
  console.log("Route hit");
  const { judgeName, team } = req.query;

  console.log(req.query);

  if (!judgeName || !team) {
    return res.status(400).json({ msg: "Judge name and team are required" });
  }

  try {
    const existingScores = await Score.findOne({ judgeName, team });

    if (existingScores) {
      return res.status(200).json({
        msg: `Scores for Team ${team} have already been submitted by ${judgeName}. Please clear previous scores before re-entering.`,
        scores: existingScores
      });
    } else {
      return res.status(200).json({ msg: "No existing scores found. You can submit the scores." });
    }
  } catch (error) {
    console.error("Error fetching existing scores:", error.message);
    res.status(500).json({ msg: "Error fetching existing scores", error: error.message });
  }
};