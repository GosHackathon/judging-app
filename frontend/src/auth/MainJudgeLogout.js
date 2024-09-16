import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainJudgeLogout.css';


const MainJudgeLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored tokens or user data for Main Judge
    localStorage.removeItem('mainJudgeToken');
    sessionStorage.removeItem('mainJudgeToken');

    // Redirect to the Main Judge login page
    navigate('/main-judge-login');
  };

  const handleCancel = () => {
    // Redirect back to the Main Judge dashboard or previous page
    navigate(-1);
  };

//   const userEmail = "user@email.com"; // Replace with actual user email logic

  return (
    <div className="logout-wrapper">
      {/* <Sidebar />
      <FixedNavbar /> */}
      <div className="logout-box">
        <div className="logout-logo">
          {/* Add your logo here */}
          {/* <img src="path-to-logo.png" alt="Logo" /> */}
        </div>
        <h2>Logout</h2>
        {/* <p>Hi {userEmail},</p> */}
        <p>Are you sure you want to log out?</p>
        <div className="logout-actions">
          <button onClick={handleCancel} className="logout-button cancel">
            No
          </button>
          <button onClick={handleLogout} className="logout-button confirm">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainJudgeLogout;
