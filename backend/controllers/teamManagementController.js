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
      const teamName = team.teamName;

      // Safely check if these fields exist, default to false if they don't
      let indigenousValue = team['eligible for indigenous innovator'];
      let girlsWhoInnovateValue = team["eligible for 'girls who innovate"];

      // Log values to see if they're correctly extracted
      console.log('Raw eligible for indigenous innovator:', indigenousValue);
      console.log("Raw eligible for 'girls who innovate':", girlsWhoInnovateValue);

      // Trim the values in case of leading/trailing spaces
      indigenousValue = indigenousValue ? indigenousValue.trim().toLowerCase() : '';
      girlsWhoInnovateValue = girlsWhoInnovateValue ? girlsWhoInnovateValue.trim().toLowerCase() : '';

      const eligibleForIndigenousInnovator = indigenousValue === 'yes';
      const eligibleForGirlsWhoInnovate = girlsWhoInnovateValue === 'yes';

      if (!teamName) {
        console.error('teamName is missing:', team);
        continue;
      }

      // Find an existing team by teamName
      const existingTeam = await UploadTeam.findOne({ teamName });

      if (!existingTeam) {
        // If the team doesn't exist, create a new one
        const newTeam = new UploadTeam({
          teamName,
          eligibleForIndigenousInnovator,
          eligibleForGirlsWhoInnovate
        });

        await newTeam.save();
        console.log(`Inserted new team: ${teamName}`);
      } else {
        // If the team exists, update the existing record
        existingTeam.eligibleForIndigenousInnovator = eligibleForIndigenousInnovator;
        existingTeam.eligibleForGirlsWhoInnovate = eligibleForGirlsWhoInnovate;
        await existingTeam.save();
        console.log(`Updated team: ${teamName}`);
      }
    }
    return true;
  } catch (error) {
    console.error("Error inserting teams:", error);
    return false;
  }
};
// Function to insert or update judges in the database
// Function to insert or update judges in the database
const insertOrUpdateJudges = async (judges) => {
  try {
    // Loop through each judge in the provided list
    for (const judge of judges) {
      //console.log('Processing judge:', judge);

      // Extract judge name and email
      const judgeName = judge["JudgeName"];
      const judgeEmail = judge["JudgeEmail"];

      // Check if required data is present
      if (!judgeName || !judgeEmail) {
        console.error("Missing required data for judge:", judge);
        continue; // Skip to the next judge if data is missing
      }

      // Find and update or insert the judge in the database
      await UploadJudge.findOneAndUpdate(
        { email: judgeEmail.trim() },  // Condition to find the judge by email
        {
          name: judgeName.trim(),       // Update the judge's name
          email: judgeEmail.trim(),     // Update the judge's email
        },
        { upsert: true, new: true }     // Create new if not found, return the new doc
      );
    }
  } catch (error) {
    // Log and rethrow any error that occurs during the process
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
        // Fetch the judge from the UploadJudge collection
        const judge = await UploadJudge.findOne({ email: JudgeEmail.trim() });

        if (!judge) {
          console.error(`Judge not found: ${JudgeEmail}`);
          continue;
        }

        groups[GroupName].judges.push({
          name: JudgeName.trim(),
          email: JudgeEmail.trim(),
          judgeId: judge._id, // Now we have a valid judge._id
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
            name: teamName.trim(), // Add the team name
            teamId: team._id, // Add the team ID
          });
        } else {
          console.error(`Team not found: ${teamName}`);
        }
      } else {
        console.error("Missing teamName for judge:", group);
        continue; // Skip this entry if teamName is missing
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
        // Update existing group
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
    //console.log("Sheet names:", workbook.SheetNames);

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