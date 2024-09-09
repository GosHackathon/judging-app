import React, { useState, useEffect } from "react";
import {
  getFinalScores,
  downloadFinalScoreSpreadsheet,
} from "../services/apiService";
import "./Leaderboard.css";

function Leaderboard({ isMainJudge }) {
  const [finalScores, setFinalScores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinalScores = async () => {
      try {
        const response = await getFinalScores(); // Use API service function for final scores
        setFinalScores(response.data);
      } catch (error) {
        console.error("There was an error fetching the final scores!", error);
        setError("Error fetching final scores.");
      }
    };

    fetchFinalScores();
  }, []);

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadFinalScoreSpreadsheet(); // Use API service function to download spreadsheet
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Final Scores</h2>
      {isMainJudge && (
        <button onClick={handleDownloadSpreadsheet} className="btn btn-primary">
          Download Consolidated Spreadsheet
        </button>
      )}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Judge Group</th>
            <th>Team Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {finalScores.map((entry, index) => (
            <tr key={index}>
              <td>{entry.judgeGroup}</td>
              <td>{entry.teamName}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
