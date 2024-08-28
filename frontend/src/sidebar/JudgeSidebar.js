import React from "react";
import { Link } from "react-router-dom";
import "./JudgeSidebar.css"; // Import the CSS for the sidebar

function JudgeSidebar() {
  return (
    <aside className="judge-sidebar">
      <h1 className="judge-sidebar-title">GoSHackathon24 JUDGE</h1>
      <nav>
        <ul className="judge-sidebar-nav">
          <li className="judge-sidebar-navItem">
            <Link to="/dashboard" className="judge-sidebar-navLink">
              Dashboard
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/enter-scores" className="judge-sidebar-navLink">
              Enter Scores
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/leaderboard" className="judge-sidebar-navLink">
              Leaderboard
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/reports" className="judge-sidebar-navLink">
              Reports
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/settings" className="judge-sidebar-navLink">
              Settings
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/logout" className="judge-sidebar-navLink">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default JudgeSidebar;
