import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUsers,
  FaGavel,
  FaClipboardList,
  FaChartLine,
  FaFileAlt,
  FaUpload,
  FaCogs,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ mainJudge }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScoreManagementOpen, setIsScoreManagementOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to toggle the settings submenu

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleScoreManagement = () => {
    setIsScoreManagementOpen(!isScoreManagementOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">{isCollapsed ? "Menu" : "Welcome!"}</h1>
        <button onClick={toggleSidebar} className="collapse-btn">
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav>
        <ul className="sidebar-nav">
          <li className="sidebar-navItem">
            <Link to="/main-judge/home" className="sidebar-navLink">
              <FaHome />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          {/* <li className="sidebar-navItem">
            <Link to="/main-judge/dashboard" className="sidebar-navLink">
              <FaTachometerAlt />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li> */}
          <li className="sidebar-navItem">
            <Link to="/main-judge/team-management" className="sidebar-navLink">
              <FaUsers />
              {!isCollapsed && <span>Teams Management</span>}
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/main-judge/judges" className="sidebar-navLink">
              <FaGavel />
              {!isCollapsed && <span>Judge Management</span>}
            </Link>
          </li>
          <li className="sidebar-navItem has-submenu">
            <button onClick={toggleScoreManagement} className="sidebar-navLink">
              <FaClipboardList />
              {!isCollapsed && <span>Score Management</span>}
            </button>
            {isScoreManagementOpen && (
              <ul className="sidebar-subnav">
                <li className="sidebar-navItem">
                  <Link to="/main-judge/add-final-score" className="sidebar-navLink">
                    <FaClipboardList />
                    {!isCollapsed && <span>Add Final Score</span>}
                  </Link>
                </li>
                <li className="sidebar-navItem">
                  <Link to="/main-judge/score-management" className="sidebar-navLink">
                    <FaClipboardList />
                    {!isCollapsed && <span>View Scores</span>}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="sidebar-navItem">
            <Link to="/main-judge/Leaderboard" className="sidebar-navLink">
              <FaChartLine />
              {!isCollapsed && <span>Leaderboard</span>}
            </Link>
          </li>
          <li className="sidebar-navItem">
            <Link to="/main-judge/ReportPage" className="sidebar-navLink">
              <FaFileAlt />
              {!isCollapsed && <span>Reports</span>}
            </Link>
          </li>
         
          
          

          <li className="sidebar-navItem">
            <Link to="/main-judge/logout" className="sidebar-navLink">
              <FaSignOutAlt />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
