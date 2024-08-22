import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainJudgeHome.css"; // Import the CSS file

function MainJudgeHome() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/api/main-judge/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div>
      {/* Header with Navigation */}
      <header className="header">
        <h1>Main Judge Dashboard</h1>
        <nav>
          <ul className="navList">
            <li className="navItem">
              <a href="/dashboard" className="navLink">
                Dashboard
              </a>
            </li>
            <li className="navItem">
              <a href="/team-management" className="navLink">
                {" "}
                {/* Correct route path */}
                Teams Management
              </a>
            </li>
            <li className="navItem">
              <a href="/judges" className="navLink">
                Judges Management
              </a>
            </li>
            <li className="navItem">
              <a href="/scores" className="navLink">
                Score Management
              </a>
            </li>
            <li className="navItem">
              <a href="/leaderboard" className="navLink">
                Leaderboard
              </a>
            </li>
            <li className="navItem">
              <a href="/reports" className="navLink">
                Reports
              </a>
            </li>
            <li className="navItem">
              <a href="/spreadsheet" className="navLink">
                Upload/Download Spreadsheet
              </a>
            </li>
            <li className="navItem">
              <a href="/settings" className="navLink">
                Settings
              </a>
            </li>
            <li className="navItem">
              <a href="/logout" className="navLink">
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="content">
        <div>
          <h2>Teams</h2>
          <ul>
            {teams.map((team) => (
              <li key={team._id}>
                {team.name} - Judges:{" "}
                {team.judges.map((judge) => judge.name).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainJudgeHome;
