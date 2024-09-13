const Score = require('../models/Score');
const ExcelJS = require('exceljs');

// Function to get leaderboard data
const getLeaderboard = async (req, res) => {
    try {
        const scores = await Score.aggregate([
            {
                $group: {
                    _id: { judgeName: "$judgeName", team: "$team" },
                    totalScore: { $sum: "$totalScore" }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $project: {
                    judgeName: "$_id.judgeName",
                    teamName: "$_id.team",
                    score: "$totalScore",
                    _id: 0
                }
            }
        ]);
        res.json(scores);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Error fetching leaderboard data" });
    }
};

// Function to download consolidated spreadsheet
const downloadFinalScoreSpreadsheet = async (req, res) => {
    try {
        const scores = await Score.aggregate([
            {
                $group: {
                    _id: { judgeName: "$judgeName", team: "$team" },
                    totalScore: { $sum: "$totalScore" }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $project: {
                    judgeName: "$_id.judgeName",
                    teamName: "$_id.team",
                    score: "$totalScore",
                    _id: 0
                }
            }
        ]);
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Final Scores');
        worksheet.columns = [
            { header: 'Judge Name', key: 'judgeName', width: 20 },
            { header: 'Team Name', key: 'teamName', width: 20 },
            { header: 'Score', key: 'score', width: 15 },
        ];
        scores.forEach(score => {
            worksheet.addRow(score);
        });
        res.setHeader('Content-Disposition', 'attachment; filename=final_scores.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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