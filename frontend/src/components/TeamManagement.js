import React, { useState } from "react";
import axios from "axios";
import "./TeamManagement.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import DragNdrop from "./DragnDrop"; // Ensure your DragNdrop component is styled properly

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5003/api";

const TeamManagement = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);

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
      const response = await axios.get(`${API_URL}/team-management/download-excel`, {
        responseType: "blob", // Important for downloading binary files
      });

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
    <div className="team-management-page">
      <div className="card">
        <h1>Team Management</h1>
        {/* <p>Manage team data and related actions below.</p> */}

        {/* Drag and Drop for Upload */}
        <DragNdrop onFilesSelected={setFile} width="100%" height="150px" />
        <button onClick={handleFileUpload} className="button primary-btn">
          Upload Excel File
        </button>
        {message && <p className="message">{message}</p>}

        {/* Download Button */}
        <button onClick={handleFileDownload} className="button secondary-btn">
          Download Team Template
        </button>

        {/* View Judge Groups */}
        <button onClick={viewJudgeGroups} className="button secondary-btn">
          View Judge Groups
        </button>
      </div>
    </div>
  );
};

export default TeamManagement;
