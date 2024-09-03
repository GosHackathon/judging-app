import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/apiService";
import "./JudgeNavbar.css";

function JudgeNavbar() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) return <div>Loading...</div>; // Add a loading state
  if (error) return <div>{error}</div>; // Add an error state

  return (
    <div className="judge-navbar">
      <div className="d-flex align-items-center">
        <h2 className="nav-header-title">Organization Admin</h2>
        <span className="route-text"> / Home</span>
      </div>
      <div className="d-flex align-items-center profile-info-container">
        <img src="/assets/images/admin/Profile.svg" alt="profile" />
        <div className="d-flex flex-column user-info-container">
          <p className="mb-0 user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
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

export default JudgeNavbar;