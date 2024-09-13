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


// Function to fetch the list of judges
export const fetchJudges = async () => {
  try {
    const response = await axios.get(`${API_URL}/judgeList`);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the judges!', error);
    throw error; // Rethrow the error to handle it in the component
  }
};
//function to get the team list for the judge display page

export const fetchJudgeAndTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/teamList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error.response?.data?.msg || error.message);
    throw error;
  }
};

// Function to clear previously submitted scores
export const clearPreviousScores = async (judgeName, team) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { Authorization: `Bearer ${token}` };

  // Correctly pass parameters as URL parameters if needed
  try {
    const response = await axios.delete(`${API_URL}/scores`, {
      headers,
      data: { judgeName, team } // Send data in the request body for DELETE
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing previous scores:", error.response?.data?.msg || error.message);
    throw error; // Propagate error for handling in the calling code
  }
};

// Function to get existing scores from the database
// In your frontend file

export const getExistingScores = async (judgeName, team) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.get(`${API_URL}/scores/existing-scores`, { // Updated path
      headers,
      params: { judgeName, team },
    });
    return response.data; // Expected to be an object with a message and potentially scores
  } catch (error) {
    console.error("Error fetching existing scores:", error);
    throw new Error("Error fetching existing scores");
  }
};

// Function to update final scores
export const updateFinalScore = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/finalScores`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating final score:', error);
    throw new Error('Error updating final score');
  }
};

// Function to fetch judges in a group
export const fetchJudgesByGroup = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/finalscore/judgeGroups/${groupId}/judges`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching judges:', error);
    throw new Error('Error fetching judges');
  }
};

// Function to fetch teams for a specific judge group
export const fetchTeamsByGroup = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/finalscore/judgeGroups/${groupId}/teams`, { 
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw new Error('Error fetching teams');
  }
};

// Function to fetch judge groups
export const fetchJudgeGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/finalScore/judgeGroups`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching judge groups:', error);
    throw new Error('Error fetching judge groups');
  }
};




// Fetch judges and teams for a specific judge group
export const fetchJudgesAndTeams = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/finalScore/judgeGroups/${groupId}/details`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching judges and teams:", error.response ? error.response.data : error.message);
    const errorMessage = error.response ? error.response.data.msg || "An error occurred" : "An error occurred";
    throw new Error(errorMessage);
  }
};



// Fetch team scores for a specific group
export const fetchTeamScores = async (groupId) => {
  const response = await axios.get(`${API_URL}/finalScore/judgeGroups/${groupId}/scores`);
  return response.data.finalTeamScores;
};

//function to submit final score
export const submitScores = async (groupId, scores) => {
  try {
    console.log("Submitting Scores:", { groupId, scores });

    const response = await axios.post(`${API_URL}/finalScore/submit`, {
      groupId,
      scores
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting scores:", error);
    throw error;
  }
};

export const getFinalScores = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard/final-scores`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch final scores");
  }
};




export const downloadFinalScoreSpreadsheet = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard/download-final-scores`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'final_scores.xlsx'); // Update file name as needed
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    throw new Error("Failed to download spreadsheet");
  }
};

//function to get score management data
export const fetchScoreManagementData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const headers = { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'  // Ensure the Content-Type is set
  };
  return await apiCall("GET", "/scores/management", {}, headers);
};


