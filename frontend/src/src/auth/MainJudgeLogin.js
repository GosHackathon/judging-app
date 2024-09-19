import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginMainJudge } from "../services/apiService";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./MainJudgeLogin.css";

function MainJudgeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Check if fields are empty
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }

      console.log("Attempting login with email:", email);
      const response = await loginMainJudge(email, password);

      if (!response || !response.token) {
        setError("Login failed. No user data returned.");
        return;
      }

      setSuccess("Login successful. Redirecting...");
      console.log("Login successful, redirecting...");
      setTimeout(() => {
        navigate("/main-judge-home");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faGavel} size="3x" />
          <h2 className="mt-3">Main Judge Login</h2>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"} // Toggle input type based on state
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            />
          </div>
          <p>
            <Link to="/forget-password">Forget Password?</Link>
          </p>
          <button type="submit" className="btn btn-primary btn-block">
            LOG IN
          </button>
          <div className="signup-link text-center mt-3">
            <p>
              Not a Main Judge?{" "}
              <a href="/main-judge-signup">Sign Up as a Main Judge</a>
            </p>
            <p>
              Not a Judge? <Link to="/login">Login as a Judge</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MainJudgeLogin;
