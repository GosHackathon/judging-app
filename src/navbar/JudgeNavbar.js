import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserData } from "../services/apiService";
import "./JudgeNavbar.css";
import { FiLogOut, FiPhone, FiChevronDown } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faCog, faAddressBook } from '@fortawesome/free-solid-svg-icons';

function JudgeNavbar() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUserData();
        if (userResponse) {
          setUser(userResponse);
        }
      } catch (error) {
        console.error("Error fetching Main Judge data:", error);
        setError("Failed to fetch data");
        navigate("/judge/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/judge/NormalJudgeLogout");
  };

  const handleContact = () => {
    navigate("/judge/contacts");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getPageTitle = (pathname) => {
    switch (location.pathname) {
      case "/judge/home":
        return "/Home";
      case "/judge/contacts":
        return "/Contact Us";
      case "/judge/logout":
        return "/Logout";
      case "/judge/scores":
        return "/Score Management";
      case "/judge/dashboard":
        return "/Judge Dashboard";
      case "/judge/form":
        return "/Form";
      case "/judge/leaderboard":
        return "/Leaderboard";
      case "/judge/team-list":
        return "/Team List";
      default:
        return location.pathname
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  // Generate initials for the avatar from the mainJudge's name
  const getInitials = (name) => {
    if (!name) return "";
    const splitName = name.split(" ");
    const initials = splitName.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  return (
    <div className="judge-navbar">
      <div className="d-flex align-items-center">
        <h2 className="nav-header-title">Organization</h2>
        <span className="route-text">  {getPageTitle(location.pathname)}</span>
      </div>
      <div className="d-flex align-items-center profile-info-container">
        <div className="d-flex flex-column user-info-container">
          <p className="mb-0 user-name">{user ? user.name : "Loading..."}</p>
          <p className="user-email">{user ? user.email : ""}</p>
        </div>
        {/* Avatar */}
        <div className="avatar" onClick={toggleDropdown}>
          {getInitials(user.name)}
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
            <p className="greeting">Hi, {user.name}!</p>
          </div>
          
          <button className="dropdown-item" onClick={() => navigate("/judge/contacts")}>
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

export default JudgeNavbar;