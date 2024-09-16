const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set your upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save file with a timestamp and original name
  }
});

const upload = multer({ storage: storage ,   limits: { fileSize: 10 * 1024 * 1024 }
});


const {
  downloadTeamTemplate,
  uploadTeamFile,
  getJudgeGroups,
} = require("../controllers/teamManagementController");

// Route to generate and download the Excel file
router.get("/download-excel", downloadTeamTemplate);

// Route to handle file upload
router.post("/upload", upload.single('file'), uploadTeamFile);

//Route to view the data
router.get("/view", getJudgeGroups);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File size exceeds limit.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Handle any other errors
    if (err.message.includes('Unexpected end of form')) {
      return res.status(400).json({ error: 'Incomplete form submission.' });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  }
  next();
});

module.exports = router;
