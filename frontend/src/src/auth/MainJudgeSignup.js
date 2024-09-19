import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupMainJudge } from "../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./MainJudgeSignup.css";

function MainJudgeSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await signupMainJudge(name, email, password);
      navigate("/main-judge-login");
    } catch (err) {
      setError("Error signing up.");
      console.error("Error signing up:", err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="header-container">
          <FontAwesomeIcon icon={faUserPlus} className="signup-icon" />
          <h2 className="signup-header">MAIN JUDGE SIGNUP</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={toggleShowPassword} className="toggle-password">
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={toggleShowPassword} className="toggle-password">
              <FontAwesomeIcon icon={showPassword ? faEye: faEyeSlash} />
            </span>
          </div>
          <button type="submit">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="login-redirect">
          Already have an account? <a href="/main-judge-login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default MainJudgeSignup;
