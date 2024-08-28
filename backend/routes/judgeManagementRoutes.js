// routes/judgeManagementRoutes.js

const express = require("express");
const router = express.Router();
const { getJudges } = require("../controllers/judgeManagementController");

// Define the route to get the list of judges
router.get("/judgeList", getJudges);

module.exports = router;
