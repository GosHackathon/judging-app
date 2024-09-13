const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

// Route to handle score submission
router.post("/scores", scoreController.submitScores);

module.exports = router;
