import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaListAlt, FaTrophy, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./JudgeSidebar.css";

function JudgeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`judge-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="judge-sidebar-header">
        <h1 className="judge-sidebar-title">{isCollapsed ? "Menu" : "Welcome!"}</h1>
        <button onClick={toggleSidebar} className="collapse-btn">
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav>
        <ul className="judge-sidebar-nav">
          <li className="judge-sidebar-navItem">
            <Link to="/judge/home" className="judge-sidebar-navLink">
              <FaHome className="sidebar-icon" />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/judge/team-list" className="judge-sidebar-navLink">
              <FaListAlt className="sidebar-icon" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/judge/form" className="judge-sidebar-navLink">
              <FaTrophy className="sidebar-icon" />
              {!isCollapsed && <span>Enter Scores</span>}
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/judge/leaderboard" className="judge-sidebar-navLink">
              <FaTrophy className="sidebar-icon" />
              {!isCollapsed && <span>Leaderboard</span>}
            </Link>
          </li>
          <li className="judge-sidebar-navItem">
            <Link to="/judge/NormalJudgeLogout" className="judge-sidebar-navLink">
              <FaSignOutAlt className="sidebar-icon" />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default JudgeSidebar;