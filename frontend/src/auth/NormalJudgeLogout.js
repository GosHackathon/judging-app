import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NormalJudgeLogout.css';

const NormalJudgeLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored tokens or user data for Normal Judge
    localStorage.removeItem('normalJudgeToken');
    sessionStorage.removeItem('normalJudgeToken');

    // Redirect to the Normal Judge login page
    navigate('/judge/login');
  };

  const handleCancel = () => {
    // Redirect back to the Normal Judge dashboard or previous page
    navigate(-1);
  };

  return (
    <div className="logout-wrapper">
      <div className="logout-box">
        <div className="logout-logo">
          {/* Add your logo here if necessary */}
          {/* <img src="path-to-logo.png" alt="Logo" /> */}
        </div>
        <h2>Logout</h2>
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

export default NormalJudgeLogout;
