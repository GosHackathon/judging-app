// In your Express router file

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitScores,
  updateScore,
  getAllScores,
  getScoresByGroup,
  clearScores,
  getExistingScores, // Ensure this function is imported
} = require("../controllers/scoreController");

// CREATE: Add new scores
router.post("/", authMiddleware, submitScores);

// UPDATE: Update an existing score
router.put("/:id", authMiddleware, updateScore);

// READ: Get all scores
router.get("/", authMiddleware, getAllScores);

// READ: Get scores by group
router.get('/scores-by-group', getScoresByGroup);

// READ: Get existing scores for a specific judge and team
router.get('/existing-scores', authMiddleware, getExistingScores); // Adjusted path

// DELETE: Clear scores
router.delete("/", authMiddleware, clearScores);

module.exports = router;
