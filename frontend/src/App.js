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
import ForgetPassword from "./auth/Forgetpassword"
import ManageProfile from "./components/ManageProfile";
import MainJudgeLogout from './auth/MainJudgeLogout';
import Contacts from "./components/Contacts";
import JudgeManageProfile from "./components/JudgeManageProfile";
import NormalJudgeLogout from "./auth/NormalJudgeLogout";

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
        <Route path="/judge/login" element={<Login />} />
        <Route path="/main-judge/login" element={<MainJudgeLogin />} />
        <Route path="/main-judge/signup" element={<MainJudgeSignup />} />
        <Route path="/main-judge/logout" element={<MainJudgeLogout />} />
        <Route path="/judge/signup" element={<Signup />} />
        <Route path="/judge/NormalJudgeLogout" element={<NormalJudgeLogout/>} />


        
        <Route path="/main-judge/forget-password" element={<ForgetPassword userType="main-judge" />} />
        <Route path="/judge/forget-password" element={<ForgetPassword userType="judge" />} />
        

        <Route
          path="/main-judge/home"
          element={<ProtectedRoute element={<Layout><MainJudgeHome /></Layout>} />}
        />
        
        <Route
          path="/main-judge/team-management"
          element={<ProtectedRoute element={<Layout><TeamManagement /></Layout>} />}
        />
        
        <Route
          path="/judge/home"
          element={<ProtectedRoute element={<JudgeHome />} />}
        />
        <Route 
        path="/judge/form" 
        element={<ProtectedRoute element={<Form />} />} 
        />
        
        <Route 
          path="/main-judge/contacts" 
          element={<ProtectedRoute element={<Contacts userType="main-judge" />} />} 
        />
        <Route 
          path="/judge/contacts" 
          element={<ProtectedRoute element={<Contacts userType="judge" />} />} 
        />


        <Route path="/judge/JudgeManageProfile" element={<JudgeManageProfile />} />
        <Route path="/main-judge/manage-profile" element={<Layout><ManageProfile /></Layout>} />
        <Route path="/main-judge/judge-groups" element={<Layout><JudgeGroups /></Layout>} />
        <Route
          path="/main-judge/score-management"
          element={<ProtectedRoute element={<Layout><ScoreManagement /></Layout>} />}
        />

        <Route path="/main-judge/add-final-score" element={<Layout><AddFinalScore /></Layout>} />
        <Route path="/main-judge/judges" element={<Layout><JudgeList /></Layout>} />
        <Route path="/judge/team-list" element={<TeamList />} />
        <Route path="/main-judge/ReportPage" element={<Layout><ReportPage /></Layout>} />
        
       
        <Route
          path="/main-judge/Leaderboard"
          element={<ProtectedRoute element={<Leaderboard />} />}
        />
        <Route
          path="/judge/Leaderboard"
          element={<ProtectedRoute element={<Leaderboard />} />}
        />

      </Routes>
    </Router>
  );
}

export default App;
