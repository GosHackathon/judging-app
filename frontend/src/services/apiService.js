import axios from "axios";

// Define your API base URL
const API_URL = "http://localhost:5003/api";

// Signup user
export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    // Store token in localStorage
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    // Include error response details
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error creating account";
    throw new Error(errorMessage);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // Store token in localStorage
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    // Include error response details
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error logging in";
    throw new Error(errorMessage);
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/userData`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error fetching user data";
    throw new Error(errorMessage);
  }
};

// Get leaderboard
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    // Handle error
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error fetching leaderboard";
    throw new Error(errorMessage);
  }
};

// Post scores
export const postScores = async (scores) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/scores`, scores, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error posting scores";
    throw new Error(errorMessage);
  }
};
