import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMainJudgeData } from "../services/apiService";
import "./FixedNavbar.css";

function FixedNavbar() {
  const [mainJudge, setMainJudge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainJudgeData = async () => {
      try {
        const data = await getMainJudgeData();
        setMainJudge(data);
      } catch (error) {
        console.error("Error fetching Main Judge data:", error);
        setError("Failed to fetch data");
        navigate("/main-judge-login");
      } finally {
        setLoading(false);
      }
    };

    fetchMainJudgeData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/main-judge-login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) return <div>Loading...</div>; // Add a loading state
  if (error) return <div>{error}</div>; // Add an error state

  return (
    <div className="fixed-navbar">
      <div className="d-flex align-items-center">
        <h2 className="nav-header-title">Organization Admin</h2>
        <span className="route-text"> / Home</span>
      </div>
      <div className="d-flex align-items-center profile-info-container">
        <img src="/assets/images/admin/Profile.svg" alt="profile" />
        <div className="d-flex flex-column user-info-container">
          <p className="mb-0 user-name">{mainJudge.name}</p>
          <p className="user-email">{mainJudge.email}</p>
        </div>
        <button
          className="dropdown-toggle"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <img src="/assets/images/icons/chevron-down.svg" alt="more info" />
        </button>
        <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
          <button className="dropdown-item" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default FixedNavbar;
