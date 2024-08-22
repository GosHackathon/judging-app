import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../services/apiService"; // Import only the functions that exist
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData(); // Fetch user data
        if (response.data) {
          setUser(response.data);
          setTeams(response.data.teams || []); // Ensure teams field is set correctly
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
    <div className="dashboard-container">
      <h2>Welcome, {user ? user.name : "Judge!"}</h2>{" "}
      {/* Display dynamic user name */}
      <div className="dashboard-links">
        <Link to="/score-entry">Enter Scores</Link>
        <Link to="/leaderboard">View Leaderboard</Link>
      </div>
      {/* Display assigned teams */}
      {teams.length > 0 ? (
        <div className="assigned-teams">
          <h3>Your Assigned Teams</h3>
          <ul>
            {teams.map((team) => (
              <li key={team._id}>{team.name}</li> // Ensure key is team._id for uniqueness
            ))}
          </ul>
        </div>
      ) : (
        <div>No teams assigned.</div> // Handle case when no teams are assigned
      )}
      {/* Download consolidated spreadsheet button (if applicable) */}
      {user &&
        user.isMainJudge && ( // Conditionally render based on user type
          <button
            onClick={handleDownloadSpreadsheet}
            className="btn btn-primary"
          >
            Download Consolidated Spreadsheet
          </button>
        )}
      {/* Display error messages */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Dashboard;
