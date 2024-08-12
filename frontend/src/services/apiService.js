import axios from "axios";

// Define your API base URL
const API_URL = "http://localhost:5000/api";

// Signup user
export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
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
    return response.data;
  } catch (error) {
    // Include error response details
    const errorMessage = error.response
      ? error.response.data.msg
      : "Error logging in";
    throw new Error(errorMessage);
  }
};

// Other existing exports
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error("Error fetching leaderboard");
  }
};

export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/userData`);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error("Error fetching user data");
  }
};

export const postScores = async (scores) => {
  try {
    const response = await axios.post(`${API_URL}/scores`, scores);
    return response.data;
  } catch (error) {
    // Handle error
    throw new Error("Error posting scores");
  }
};
