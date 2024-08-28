const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const UploadTeam = require("../models/UploadTeam");
const UploadJudge = require("../models/UploadJudge");
const JudgeGroupModel = require("../models/JudgeGroup");

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

// Function to insert teams into the database
const insertTeams = async (teams) => {
  try {
    for (let team of teams) {
      console.log("Processing team:", team);

      const teamName = team.teamName;
      const teamEmail = team.teamEmail;

      if (!teamName || !teamEmail) {
        console.error("teamName or teamEmail is missing:", team);
        continue;
      }

      const existingTeam = await UploadTeam.findOne({ teamName: teamName });

      if (!existingTeam) {
        const newTeam = new UploadTeam({
          teamName: teamName,
          teamEmail: teamEmail,
        });

        await newTeam.save();
      }
    }
    return true;
  } catch (error) {
    console.error("Error inserting teams:", error);
    return false;
  }
};

// Function to insert or update judges in the database
const insertOrUpdateJudges = async (judges) => {
  try {
    for (const judge of judges) {
      console.log("Processing judge:", judge);

      const judgeName = judge["JudgeName"];
      const judgeEmail = judge["JudgeEmail"];

      if (!judgeName || !judgeEmail) {
        console.error("Missing required data for judge:", judge);
        continue;
      }

      await UploadJudge.findOneAndUpdate(
        { email: judgeEmail.trim() },
        {
          name: judgeName.trim(),
          email: judgeEmail.trim(),
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error("Error inserting/updating judges:", error);
    throw error;
  }
};

// Function to insert judge groups into the database
const insertJudgeGroups = async (judgeGroups) => {
  try {
    const groups = {}; // Temporary storage for groups

    for (const group of judgeGroups) {
      const { GroupName, JudgeName, JudgeEmail, teamName } = group;

      // Initialize group if it doesn't exist
      if (!groups[GroupName]) {
        groups[GroupName] = {
          groupName: GroupName,
          judges: [],
          teams: [],
        };
      }

      // Add judge to the group
      if (JudgeName && JudgeEmail) {
        groups[GroupName].judges.push({
          name: JudgeName.trim(),
          email: JudgeEmail.trim(),
        });
      } else {
        console.error("Missing required data for judge:", group);
        continue;
      }

      // Add team to the group
      if (teamName) {
        let team = await UploadTeam.findOne({ teamName: teamName.trim() });
        if (team) {
          groups[GroupName].teams.push({
            name: teamName.trim(),
            teamId: team._id,
          });
        } else {
          console.error(`Team not found: ${teamName}`);
        }
      } else {
        console.error("Missing teamName for judge:", group);
        continue;
      }
    }

    // Save all groups to the database
    for (const groupName in groups) {
      const { groupName: name, judges, teams } = groups[groupName];

      let judgeGroup = await JudgeGroupModel.findOne({ groupName: name });

      if (!judgeGroup) {
        judgeGroup = new JudgeGroupModel({
          groupName: name,
          judges: judges,
          teams: teams,
        });
      } else {
        judgeGroup.judges = judges;
        judgeGroup.teams = teams;
      }

      await judgeGroup.save();
    }

    console.log("Judge groups inserted or updated successfully!");
  } catch (error) {
    console.error("Error inserting or updating judge groups:", error);
  }
};

// Upload file
exports.uploadTeamFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send("No file uploaded");
    }

    const file = req.files.file;
    const workbook = XLSX.read(file.data, { type: "buffer" });

    // Log sheet names to verify
    console.log("Sheet names:", workbook.SheetNames);

    const teamSheet = workbook.Sheets["teams"];
    const judgeSheet = workbook.Sheets["judges"];
    const judgeGroupSheet = workbook.Sheets["judgeGroup"];

    if (!teamSheet || !judgeSheet || !judgeGroupSheet) {
      console.error(
        "Sheet names are incorrect or missing in the uploaded file"
      );
      return res.status(400).send("Invalid file format");
    }

    const teams = XLSX.utils.sheet_to_json(teamSheet);
    const judges = XLSX.utils.sheet_to_json(judgeSheet);
    const judgeGroups = XLSX.utils.sheet_to_json(judgeGroupSheet);

    await insertTeams(teams);
    await insertOrUpdateJudges(judges);
    await insertJudgeGroups(judgeGroups);

    res.send("File uploaded and data saved to MongoDB!");
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).send("Server error");
  }
};

// Function to fetch judge groups
exports.getJudgeGroups = async (req, res) => {
  try {
    const judgeGroups = await JudgeGroupModel.find();
    res.json(judgeGroups);
  } catch (error) {
    console.error("Error fetching judge groups:", error);
    res.status(500).send("Server error");
  }
};
