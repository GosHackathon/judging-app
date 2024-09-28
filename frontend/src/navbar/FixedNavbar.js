import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMainJudgeData } from "../services/apiService";
import "./FixedNavbar.css";
// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faCog, faAddressBook } from '@fortawesome/free-solid-svg-icons';

function FixedNavbar() {
  const [mainJudge, setMainJudge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const fetchMainJudgeData = async () => {
      try {
        const data = await getMainJudgeData();
        setMainJudge(data);
      } catch (error) {
        console.error("Error fetching Main Judge data:", error);
        setError("Failed to fetch data");
        navigate("/main-judge/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMainJudgeData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("toklen");
    navigate("/main-judge/logout");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Map current path to a more user-friendly title
  const getPageTitle = (pathname) => {
    switch (location.pathname) {
      case "/main-judge/home":
        return "/Home";
      case "/main-judge/add-final-score":
        return "/Final Score";
      case "/main-judge/Leaderboard":
        return "/Leader Board";
      case "/main-judge/team-management":
        return "/Upload Team";
      case "/main-judge/judges":
        return "/Judges";
      case "/main-judge/manage-profile":
          return "/Manage Profile";
      case "/main-judge/logout":
          return "/Logout";
      case "/main-judge/contacts":
          return "/Contacts";
      case "/main-judge/score-management":
          return "/Scores"
      case "/main-judge/ReportPage":
          return "/Reports";
      
      default:
        return location.pathname
    }
  };

  if (loading) return <div>Loading...</div>; // Add a loading state
  if (error) return <div>{error}</div>; // Add an error state

  // Generate initials for the avatar from the mainJudge's name
  const getInitials = (name) => {
    if (!name) return "";
    const splitName = name.split(" ");
    const initials = splitName.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  return (
    <div className="fixed-navbar">
      <div className="d-flex align-items-center">
        <h2 className="nav-header-title">Organization</h2>
        <span className="route-text">  {getPageTitle(location.pathname)}</span> {/* Display current page */}
      </div>
      <div className="d-flex align-items-center profile-info-container">
       
        <div className="d-flex flex-column user-info-container">
          <p className="mb-0 user-name">{mainJudge.name}</p>
          <p className="user-email">{mainJudge.email}</p>
        </div>
        {/* Avatar */}
        <div className="avatar" onClick={toggleDropdown}>
          {getInitials(mainJudge.name)}
        </div>
        <button
          className="dropdown-toggle"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
        </button>
        <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
          <div className="dropdown-item greeting-item">
            <FontAwesomeIcon icon={faUserCircle} size="3x" className="avatar-icon" />
            <p className="greeting">Hi, {mainJudge.name}!</p>
          </div>
          <button className="dropdown-item" onClick={() => navigate("/main-judge/manage-profile")}>
            <FontAwesomeIcon icon={faCog} className="dropdown-icon" /> Manage Profile
          </button>
          <button className="dropdown-item" onClick={() => navigate("/main-judge/contacts")}>
            <FontAwesomeIcon icon={faAddressBook} className="dropdown-icon" /> Contacts
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default FixedNavbar;
