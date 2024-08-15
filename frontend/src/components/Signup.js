// Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/apiService"; // Update the path based on your directory structure
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
    setSuccess(""); // Clear previous success message

    try {
      await signupUser(name, email, password);
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => {
        navigate("/"); // Redirect to login or home page
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message || "Error creating account");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
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
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
