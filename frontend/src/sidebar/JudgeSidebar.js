import React from "react";
import { Link } from "react-router-dom";
import "./JudgeSidebar.css"; // Import the CSS for the sidebar


function JudgeSidebar() {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">GoSHackathon24 JUDGING</h1>
      <nav>
        <ul className="sidebar-nav">

        <li className="judge-sidebar-navItem">
            <Link to="/judge-home" className="judge-sidebar-navLink">
              Home 
            </Link>
          </li>
      
          <li className="judge-sidebar-navItem">
            <Link to="/team-list" className="judge-sidebar-navLink">
              Dashboard
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/form" className="judge-sidebar-navLink">
              Enter Scores
            </Link>
          </li>

          <li className="judge-sidebar-navItem">
            <Link to="/leaderboard" className="judge-sidebar-navLink">
              Leaderboard
            </Link>
          </li>

          <li className="judge-sidebar-navItem">
            <Link to="/settings" className="judge-sidebar-navLink">
              Settings
            </Link>
          </li>
          

        </ul>
      </nav>
    </aside>
  );
}

export default JudgeSidebar;
