import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData, getMainJudgeData } from "../services/apiService";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Determine if the route is for Main Judge or general users
        if (location.pathname.startsWith("/main-judge")) {
          // If accessing a Main Judge route, check Main Judge authentication
          await getMainJudgeData();
        } else {
          // Otherwise, check regular user authentication
          await getUserData();
        }
        // If authentication succeeds, allow access regardless of data presence
        setIsAuthenticated(true);
      } catch (err) {
        // If authentication fails, capture the error and block access
        setIsAuthenticated(false);
        setError(err.message || "Authentication failed");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) return <div>Loading...</div>;

  if (error) {
    console.error("Authentication error:", error);
    return location.pathname.startsWith("/main-judge") ? (
      <Navigate to="/main-judge/login" />
    ) : (
      <Navigate to="/judge/login" />
    );
  }

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
