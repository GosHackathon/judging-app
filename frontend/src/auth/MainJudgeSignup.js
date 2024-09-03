import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { signupMainJudge } from "../services/apiService"; // Ensure this function is correctly exported from apiService
import "./MainJudgeSignup.css"; // Import the CSS file

function MainJudgeSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupMainJudge(name, email, password); // Call the signup function
      navigate("/main-judge-login"); // Redirect to login page after successful signup
    } catch (err) {
      setError("Error signing up.");
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup for Main Judge</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default MainJudgeSignup;
