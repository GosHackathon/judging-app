import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import MainJudgeLogin from "./auth/MainJudgeLogin";
import MainJudgeSignup from "./auth/MainJudgeSignup";
import Signup from "./auth/Signup";
import Dashboard from "./components/Dashboard";
import ScoreEntry from "./components/ScoreEntry";
import Leaderboard from "./components/Leaderboard";
import TeamManagement from "./components/TeamManagement";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainJudgeHome from "./components/MainJudgeHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main-judge-login" element={<MainJudgeLogin />} />
        <Route path="/main-judge-signup" element={<MainJudgeSignup />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/score-entry"
          element={<ProtectedRoute element={<ScoreEntry />} />}
        />
        <Route
          path="/leaderboard"
          element={<ProtectedRoute element={<Leaderboard />} />}
        />
        <Route
          path="/main-judge-home"
          element={<ProtectedRoute element={<MainJudgeHome />} />}
        />
        <Route
          path="/team-management"
          element={<ProtectedRoute element={<TeamManagement />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
