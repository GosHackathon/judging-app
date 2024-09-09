const express = require("express");
const router = express.Router();
//const {  } = require('../controllers/teamManagementController'); // Adjust path as needed

const {
  downloadTeamTemplate,
  uploadTeamFile,
  getJudgeGroups,
} = require("../controllers/teamManagementController");

// Route to generate and download the Excel file
router.get("/download-excel", downloadTeamTemplate);

// Route to handle file upload
router.post("/upload", uploadTeamFile);

//Route to view the data
router.get("/view", getJudgeGroups);



module.exports = router;
