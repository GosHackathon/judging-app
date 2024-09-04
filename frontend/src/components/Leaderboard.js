import React, { useState, useEffect } from "react";
import {
  getLeaderboard,
  downloadConsolidatedSpreadsheet,
} from "../services/apiService";
import "./Leaderboard.css";

function Leaderboard({ isMainJudge }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard(); // Use API service function
        setLeaderboard(response.data);
      } catch (error) {
        console.error("There was an error fetching the leaderboard!", error);
        setError("Error fetching leaderboard data.");
      }
    };

    fetchLeaderboard();
  }, []);

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadConsolidatedSpreadsheet();
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      {isMainJudge && (
        <button onClick={handleDownloadSpreadsheet} className="btn btn-primary">
          Download Consolidated Spreadsheet
        </button>
      )}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Entry</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
