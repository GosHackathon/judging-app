import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../services/apiService";
import JudgeSidebar from "../sidebar/JudgeSidebar"; // Import the JudgeSidebar
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response) {
          setUser(response);
          setTeams(response.teams || []); // Ensure `teams` is set correctly
        }
      } catch (error) {
        setError("Error fetching user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle download spreadsheet if the function is available or remove this functionality
  const handleDownloadSpreadsheet = () => {
    setError("Download functionality not implemented.");
    console.error("Download functionality not implemented.");
  };

  return (
    <div className="dashboard-layout">
      <JudgeSidebar /> {/* Add JudgeSidebar here */}
      <div className="dashboard-content">
        <h2>Welcome, {user ? user.name : "Judge!"}</h2>
        <div className="dashboard-links">
          <Link to="/score-entry">Enter Scores</Link>
          <Link to="/leaderboard">View Leaderboard</Link>
        </div>
        {teams.length > 0 ? (
          <div className="assigned-teams">
            <h3>Your Assigned Teams</h3>
            <ul>
              {teams.map((team) => (
                <li key={team._id}>{team.name}</li> // Ensure uniqueness with team._id
              ))}
            </ul>
          </div>
        ) : (
          <div>No teams assigned.</div>
        )}
        {user && user.isMainJudge && (
          <button
            onClick={handleDownloadSpreadsheet}
            className="btn btn-primary"
          >
            Download Consolidated Spreadsheet
          </button>
        )}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default Dashboard;
