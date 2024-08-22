import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginMainJudge } from "../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import "./MainJudgeLogin.css";

function Login({ isMainJudge = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      if (isMainJudge) {
        await loginMainJudge(email, password);
        setSuccess("Main Judge login successful. Redirecting...");
        navigate("/main-judge-dashboard"); // Redirect to the Main Judge dashboard
      } else {
        await loginUser(email, password);
        setSuccess("Login successful. Redirecting...");
        navigate("/dashboard"); // Redirect to the regular Judge dashboard
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className={`login-container ${isMainJudge ? "main-judge" : "judge"}`}>
      <div className="login-form">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faUserLock} size="3x" />
          <h2 className="mt-3">
            {isMainJudge ? "Main Judge Login" : "Judge Login"}
          </h2>
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
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
          <div className="signup-link text-center mt-3">
            <p>
              Not a member? <a href="/signup">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
