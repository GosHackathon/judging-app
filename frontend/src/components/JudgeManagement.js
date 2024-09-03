import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JudgeManagement.css";

function JudgeList() {
  const [judges, setJudges] = useState([]);

  useEffect(() => {
    // Fetch the judges list when the component mounts
    const fetchJudges = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/judgeList");
        console.log("Fetched judges:", response.data); // Log data here
        setJudges(response.data);
      } catch (error) {
        console.error("There was an error fetching the judges!", error);
      }
    };

    fetchJudges();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div className="judge-list">
      {judges.length === 0 ? (
        <p>No judges found.</p>
      ) : (
        judges.map((judge) => (
          <div key={judge._id} className="judge-card">
            <h2>{judge.name}</h2>
            <p>Email: {judge.email}</p>
            <p>Teams: {judge.teams.length}</p> {/* Display team count */}
          </div>
        ))
      )}
    </div>
  );
}

export default JudgeManagement;
