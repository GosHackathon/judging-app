import axios from "axios";

// Define the base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5003/api";

// Generic API call function
const apiCall = async (method, url, data = {}, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      headers: { ...headers },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API call error:",
      error.response ? error.response.data : error.message
    );

    const errorMessage = error.response
      ? error.response.data.msg || "An error occurred"
      : "An error occurred";

    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - possibly redirecting to login.");
    }

    throw new Error(errorMessage);
  }
};

// Function to create a new user
export const signupUser = async (name, email, password) => {
  const data = { name, email, password };
  const response = await apiCall("POST", "/auth/signup", data);
  localStorage.setItem("token", response.token);
  return response;
};

// Function to log in a user
export const loginUser = async (email, password) => {
  const data = { email, password };
  const response = await apiCall("POST", "/auth/login", data);
  localStorage.setItem("token", response.token);
  return response;
};

// Function to log in the Main Judge
export const loginMainJudge = async (email, password) => {
  const data = { email, password };
  const response = await apiCall("POST", "/auth/main-judge-login", data);
  localStorage.setItem("token", response.token);
  return response;
};

// Function to signup a Main Judge
export const signupMainJudge = async (name, email, password) => {
  const data = { name, email, password };
  const response = await apiCall("POST", "/auth/main-judge-signup", data);
  localStorage.setItem("token", response.token);
  return response;
};

// Function to get user data
export const getUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };
  return await apiCall("GET", "/user/userData", {}, headers);
};

// Function to get Main Judge data
export const getMainJudgeData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_URL}/main-judge/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Function to get leaderboard
export const getLeaderboard = async () => {
  return await apiCall("GET", "/leaderboard");
};

// Function to post scores
export const postScores = async (scores) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };
  return await apiCall("POST", "/scores", scores, headers);
};

// Function to post Main Judge's scores
export const postMainJudgeScores = async (scores) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };
  return await apiCall("POST", "/scores/main-judge", scores, headers);
};

// Function to get Judge ID
export const getJudgeId = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };
  return await apiCall("GET", "/judge/id", {}, headers);
};

// Function to download the consolidated spreadsheet
export const downloadConsolidatedSpreadsheet = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };
  return await apiCall("GET", "/spreadsheet/consolidated", {}, headers);
};

// Function to upload an updated spreadsheet
export const uploadUpdatedSpreadsheet = async (file) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const formData = new FormData();
  formData.append("file", file);
  return await apiCall("POST", "/spreadsheet/upload", formData, headers);
};

// Function to download the team template
export const downloadTeamTemplate = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    responseType: "blob", // Important for handling binary data
  };

  try {
    const response = await axios.get(
      `${API_URL}/team-management/download-excel`,
      {
        headers,
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "team-template.xlsx"); // Specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return response.data; // Return data if needed for further processing
  } catch (error) {
    console.error("Error downloading team template:", error);
    throw new Error("Error downloading team template.");
  }
};

// Function to upload a team file
export const uploadTeamFile = async (file) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const formData = new FormData();
  formData.append("file", file);
  return await apiCall(
    "POST",
    `${API_URL}/team-management/upload`,
    formData,
    headers
  );
};
