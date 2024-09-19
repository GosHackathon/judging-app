import React, { useState, useEffect } from "react";
import {
  getFinalScores,
  downloadFinalScoreSpreadsheet,
} from "../services/apiService";
import "./Leaderboard.css";

function Leaderboard({ isMainJudge }) {
  const [allScores, setAllScores] = useState([]);
  const [displayedScores, setDisplayedScores] = useState([]);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchFinalScores();
  }, []);

  useEffect(() => {
    setDisplayedScores(showAll ? allScores : allScores.slice(0, 5));
  }, [showAll, allScores]);

  const fetchFinalScores = async () => {
    try {
      const scores = await getFinalScores();
      setAllScores(scores);
      setDisplayedScores(scores.slice(0, 5));
    } catch (error) {
      console.error("There was an error fetching the final scores!", error);
      setError("Error fetching final scores.");
    }
  };

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadFinalScoreSpreadsheet();
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const downloadCSV = () => {
    const headers = ["Group Name", "Team Name", "Score"];
    const csvContent = [
      headers.join(","),
      ...allScores.map(score => `${score.judgeGroup},${score.teamName},$${Math.round(score.score)}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "leaderboard.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Team Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {displayedScores.map((entry, index) => (
              <tr key={index}>
                <td>{entry.judgeGroup}</td>
                <td>{entry.teamName}</td>
                <td>{Math.round(entry.score)}</td>  
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        {allScores.length > 5 && (
          <button onClick={toggleShowAll} className="btn btn-secondary">
            {showAll ? "Show Less" : "Show Full List"}
          </button>
        )}
        <button onClick={downloadCSV} className="btn btn-secondary">
          Download Leaderboard
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;