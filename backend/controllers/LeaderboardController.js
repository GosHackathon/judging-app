
const FinalScore = require('../models/FinalScore');
const ExcelJS = require('exceljs');

// Function to get leaderboard data
const getLeaderboard = async (req, res) => {
    try {
        const scores = await FinalScore.find().sort({ totalScore: -1 });
        const leaderboard = scores.map(score => ({
            judgeGroup: score.judgeGroup,
            teamName: score.teamName,
            score: score.totalScore
        }));
        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Error fetching leaderboard data" });
    }
};

// Function to download consolidated spreadsheet
const downloadFinalScoreSpreadsheet = async (req, res) => {
    try {
        // Fetch the data from FinalScore model, sorted by totalScore
        const scores = await FinalScore.find().sort({ totalScore: -1 });

        // Prepare the data in the required format
        const leaderboardData = scores.map(score => ({
            judgeGroup: score.judgeGroup,
            teamName: score.teamName,
            score: score.totalScore
        }));

        // Create a new workbook and worksheet for Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Final Scores');

        // Define the columns in the Excel sheet
        worksheet.columns = [
            { header: 'Judge Group', key: 'judgeGroup', width: 30 },
            { header: 'Team Name', key: 'teamName', width: 20 },
            { header: 'Score', key: 'score', width: 15 },
        ];

        // Add rows from the leaderboard data
        leaderboardData.forEach(data => {
            worksheet.addRow(data);
        });

        // Set headers for the response to download the Excel file
        res.setHeader('Content-Disposition', 'attachment; filename=final_scores.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Write the Excel file to the response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating spreadsheet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getLeaderboard,
    downloadFinalScoreSpreadsheet
};