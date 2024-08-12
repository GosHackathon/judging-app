import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../services/apiService"; // Example API service import
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData(); // Example API call
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user ? user.name : "Judge!"}</h2>{" "}
      {/* Display dynamic user name */}
      <div className="dashboard-links">
        <Link to="/score-entry">Enter Scores</Link>
        <Link to="/leaderboard">View Leaderboard</Link>
      </div>
    </div>
  );
}

export default Dashboard;
