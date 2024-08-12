import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup"; // Import the Signup component
import Dashboard from "./components/Dashboard";
import ScoreEntry from "./components/ScoreEntry";
import Leaderboard from "./components/Leaderboard";
import Form from "./components/Form"; // Import the Form component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* Add Signup route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/score-entry" element={<ScoreEntry />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/form" element={<Form />} /> {/* Add Form route */}
      </Routes>
    </Router>
  );
}

export default App;
