import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS for the sidebar

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">GoSHackathon24 JUDGING</h1>
      <nav>
        <ul className="sidebar-nav">
          <li className="sidebar-navItem">
            <Link to="/main-judge-home" className="sidebar-navLink">
              Home
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/dashboard" className="sidebar-navLink">
              Dashboard
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/team-management" className="sidebar-navLink">
              Teams Management
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/judge-management" className="sidebar-navLink">
              Judge Management
            </Link>
          </li>

          <li className="sidebar-navItem">
            <Link to="/scores" className="sidebar-navLink">
              Score Management
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/leaderboard" className="sidebar-navLink">
              Leaderboard
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/reports" className="sidebar-navLink">
              Reports
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/spreadsheet" className="sidebar-navLink">
              Upload/Download Spreadsheet
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/settings" className="sidebar-navLink">
              Settings
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/main-judge-login" className="sidebar-navLink">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
