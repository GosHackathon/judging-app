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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Show loader during API call

    try {
      if (!email || !password) {
        setError("Please enter both email and password.");
        setIsLoading(false); // Stop loader if there's an error
        return;
      }

      console.log("Attempting login with email:", email);
      const response = await loginMainJudge(email, password);

      if (!response || !response.token) {
        setError("Login failed. No user data returned.");
        setIsLoading(false); // Stop loader on failure
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
    } finally {
      setIsLoading(false); // Stop loader in any case
    }
  };

  return (
    <div className="login-container-judge-login">
      <div className="login-form-judge-login">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faGavel} size="3x" />
          <h2 className="mt-3">MAIN JUDGE LOGIN</h2>
        </div>
        {error && <div className="error-login">{error}</div>}
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
              aria-label="Email"
            />
          </div>
          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
              title={showPassword ? "Hide password" : "Show password"} // Tooltip for accessibility
              aria-label={showPassword ? "Hide password" : "Show password"}
            />
          </div>
          <p>
            <Link to="/forget-password">Forget Password?</Link>
          </p>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOG IN"}
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
