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
import Layout from "./layout/Layout"; // Import Layout
import JudgeGroups from "./components/JudgeGroups"; 
import JudgeList from './components/JudgeList';
import TeamList from "./components/TeamList";
import JudgeHome from "./components/JudgeHome";
import Form from "./components/Form";
//import AddCriteriaScores from "./components/AddFinalScore"; 
//<Route path="/add-criteria-scores" element={<AddCriteriaScores />} />
//import DisplayScore from "./components/DisplayScore"; // Import DisplayScore AddCriteriaScores
//import AddCriteriaScores from "./components/AddCriteriaScores";
import AddFinalScore from './components/AddFinalScore'; // Adjust path
import ScoreManagement from "./components/ScoreManagement";
import ReportPage from './components/ReportPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main-judge-login" element={<MainJudgeLogin />} />
        <Route path="/main-judge-signup" element={<MainJudgeSignup />} />
        <Route path="/signup" element={<Signup />} />

        {/* Wrap judge-related routes with Layout component */}
        <Route path="/judge" element={<Layout />}>
          <Route
            path="dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="score-entry"
            element={<ProtectedRoute element={<ScoreEntry />} />}
          />
          <Route
            path="leaderboard"
            element={<ProtectedRoute element={<Leaderboard />} />}
          />
        </Route>

        <Route
          path="/main-judge-home"
          element={<ProtectedRoute element={<MainJudgeHome />} />}
        />
        
        <Route
          path="team-management"
          element={<ProtectedRoute element={<TeamManagement />} />}
        />
        
        <Route
          path="/judge-home"
          element={<ProtectedRoute element={<JudgeHome />} />}
        />
        <Route 
        path="/form" 
        element={<ProtectedRoute element={<Form />} />} 
        />
        
        
        
        <Route path="/judge-groups" element={<JudgeGroups />} />
        <Route path="/score-management" element={<ScoreManagement />} />
        <Route path="/add-final-score" element={<AddFinalScore />} />
        <Route path="/judges" element={<JudgeList />} />
        <Route path="/team-list" element={<TeamList />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
