import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, loginMainJudge } from "../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import "./MainJudgeLogin.css";
import "./Forgetpassword.css";

function Login({ isMainJudge = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");

    try {
      if (isMainJudge) {
        await loginMainJudge(email, password);
        setSuccess("Main Judge login successful. Redirecting...");
        navigate("/main-judge-dashboard");
      } else {
        await loginUser(email, password);
        setSuccess("Login successful. Redirecting...");
        navigate("/judge-home");
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
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#888",
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            LOG IN
          </button>
          <div className="signup-link text-center mt-3">
            <p>
              Not a member? <Link to="/signup">Register here</Link>
            </p>
            <p>
              <Link to="/forgetpassword">Forget Password?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
