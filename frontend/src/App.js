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
import MainJudgeLogout from './auth/MainJudgeLogout';
import ManageProfile from './components/ManageProfile';
import Contacts from "./components/Contacts";
import Reports from "./components/Reports";


//import AddCriteriaScores from "./components/AddFinalScore"; 
//<Route path="/add-criteria-scores" element={<AddCriteriaScores />} />
//import DisplayScore from "./components/DisplayScore"; // Import DisplayScore AddCriteriaScores
//import AddCriteriaScores from "./components/AddCriteriaScores";
import AddFinalScore from './components/AddFinalScore'; // Adjust path
import ScoreManagement from "./components/ScoreManagement";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main-judge-login" element={<MainJudgeLogin />} />
        <Route path="/main-judge-signup" element={<MainJudgeSignup />} />
        <Route path="/main-judge-logout" element={<MainJudgeLogout />} />
        <Route path="/signup" element={<Signup />} />

        {/* Wrap judge-related routes with Layout component */}
        <Route path="/judge" element={<Layout><Dashboard /></Layout>}>
          <Route
            path="dashboard"
            element={<ProtectedRoute element={<Layout><Dashboard /></Layout>} />}
          />
          <Route
            path="score-entry"
            element={<ProtectedRoute element={<Layout><ScoreEntry /></Layout>} />}
          />
          <Route
            path="leaderboard"
            element={<ProtectedRoute element={<Layout><Leaderboard /></Layout>} />}
          />
        </Route>

        <Route
          path="/main-judge-home"
          element={<ProtectedRoute element={<Layout><MainJudgeHome /></Layout>} />}
        />
        <Route
          path="team-management"
          element={<ProtectedRoute element={<Layout><TeamManagement /></Layout>} />}
        />
        <Route
          path="leaderboard"
          element={<ProtectedRoute element={<Layout><Leaderboard /></Layout>} />}
        />
        <Route
          path="/judge-home"
          element={<ProtectedRoute element={<Layout><JudgeHome /></Layout>} />}
        />
        <Route
          path="/form"
          element={<ProtectedRoute element={<Layout><Form /></Layout>} />}
        />
        <Route
          path="score-management"
          element={<ProtectedRoute element={<Layout><ScoreManagement /></Layout>} />}
        />


        <Route path="/judge-groups" element={<Layout><JudgeGroups /></Layout>} />
        <Route path="/add-final-score" element={<Layout><AddFinalScore /></Layout>} />
        <Route path="/judges" element={<Layout><JudgeList /></Layout>} />
        <Route path="/team-list" element={<Layout><TeamList /></Layout>} />
        <Route path="/manage-profile" element={<Layout><ManageProfile /></Layout>} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Reports" element={<Layout><Reports /></Layout>} />



      </Routes>
    </Router>
  );
}

export default App;
