import React, { useState } from "react";
import axios from "axios";
import "./TeamManagement.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar"; // Import the Sidebar component

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5003/api";

const TeamManagement = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/team-management/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded successfully!");
      setFile(null); // Clear the file input after successful upload
    } catch (error) {
      setMessage("Error uploading file.");
      console.error("Error uploading file:", error);
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/team-management/download-excel`,
        {
          responseType: "blob", // Important for downloading binary files
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teams.xlsx"); // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setMessage("Error downloading file.");
      console.error("Error downloading file:", error);
    }
  };

  const viewJudgeGroups = () => {
    navigate("/judge-groups"); // Navigate to the JudgeGroups page
  };

  return (
    <div className="main-container">
      <Sidebar /> {/* Sidebar component included */}
      <div className="content">
        <h1>Team Management</h1>
        <div className="upload-section">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <button onClick={handleFileUpload} className="button">
            Upload Excel File
          </button>
          {message && <p className="message">{message}</p>}
        </div>
        <div className="download-section">
          <button onClick={handleFileDownload} className="button">
            Download Team Template
          </button>
        </div>
        <div className="view-section">
          <button onClick={viewJudgeGroups} className="button">
            View Judge Groups
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
