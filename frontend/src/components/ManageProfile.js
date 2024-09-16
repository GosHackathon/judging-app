import React, { useState, useEffect } from "react";
import { updateJudgeProfile ,getMainJudgeData} from "../services/apiService";
import "./ManageProfile.css";

function ManageProfile() {
  // Initial state to hold current user info
  const [currentUsername, setCurrentUsername] = useState(""); // Placeholder for current username
  const [currentEmail, setCurrentEmail] = useState(""); // Placeholder for current email (non-editable)

  // State to hold updated values
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for error and success messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function getProfile() {
      const profile = await getMainJudgeData();
      setCurrentEmail(profile.email)
      setCurrentUsername(profile.name)

      console.log(profile);
    }
    getProfile();
  }, []);

  // Unified handler for all profile updates
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
    if (!currentUsername.trim()) {
      setErrorMessage("Username cannot be empty.");
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Simulate profile updates
    if (currentUsername) {
      setCurrentUsername(currentUsername);
    }

    if (password) {
      // Simulate password update (ideally you would send it to the server)
      setPassword("");
      setConfirmPassword("");
    }

    console.log({
      email: currentEmail,
      name: currentUsername,
      password,
      confirmPassword
    })

    updateJudgeProfile({
      email: currentEmail,
      name: currentUsername,
      password,
      confirmPassword
    })
    setSuccessMessage("Profile updated successfully!");
  };

  return (
    <div className="profile-page-container">
      <div className="manage-profile-container">
        <h2>MANAGE PROFILE</h2>

        {/* Success and Error Messages */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Manage Profile Form */}
        <form onSubmit={handleUpdateProfile} className="manage-profile-form">
          {/* Display Current Email (non-editable) */}
          <div className="form-group">
            <label htmlFor="currentEmail">Current Email</label>
            <input type="email" id="currentEmail" value={currentEmail} disabled />
          </div>

          {/* Update Username */}
          <div className="form-group">
            <label htmlFor="currentUsername">Update Username</label>
            <input
              type="text"
              id="currentUsername"
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>

          {/* Update Password */}
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageProfile;
