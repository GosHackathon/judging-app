const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Define the path for temporary files
const TEMP_DIR = path.join(__dirname, "../temp");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Function to generate and download the Excel file with headings only
exports.downloadTeamTemplate = async (req, res) => {
  try {
    // Define headings
    const headings = [
      "Team Name",
      "Team Members",
      "Allocated Judge",
      "Judge Email",
    ];

    // Create an array with a single object representing the headings
    const data = [
      headings.reduce((acc, heading) => {
        acc[heading] = "";
        return acc;
      }, {}),
    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headings });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

    // Write workbook to a buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set headers for the file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=teams_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the buffer as a response
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
};

// Function to handle file upload
exports.uploadTeamFile = (req, res) => {
  // Handle file upload logic here
  res.send("File uploaded successfully");
};
