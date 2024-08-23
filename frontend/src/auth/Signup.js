import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      await signupUser(name, email, password);
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message || "Error creating account");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faUserPlus} size="3x" />
          <h2 className="mt-3">Sign Up</h2>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Sign Up
          </button>
          <div className="login-link text-center mt-3">
            <p>
              Already have an account? <Link to="/">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
