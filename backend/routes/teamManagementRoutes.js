const express = require("express");
const router = express.Router();
const {
  downloadTeamTemplate,
  uploadTeamFile,
} = require("../controllers/teamManagementController");

// Route to generate and download the Excel file
router.get("/download-excel", downloadTeamTemplate);

// Route to handle file upload
router.post("http://localhost:3000/api/team-management/upload", uploadTeamFile);

module.exports = router;
