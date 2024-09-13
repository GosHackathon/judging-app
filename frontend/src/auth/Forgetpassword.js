// src/forgetpassword.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Forgetpassword.css"; // Ensure this file has the necessary CSS

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  //const location = useLocation();
  
  //console.log("location123",location)

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Handle password reset logic here
    setMessage("If this email is registered, a password reset link will be sent.");
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-form">
        <h2>Forget Password</h2>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          <div className="back-to-login text-center mt-3">
            <Link to="/main-judge-login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
