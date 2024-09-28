import React, { useState } from "react";
import Form from "./Form";
import { getJudgeId } from "../services/apiService";
import "./ScoreEntry.css";

function ScoreEntry() {
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [judgeId, setJudgeId] = useState(""); // State to hold the judge's ID
  const [error, setError] = useState(""); // State for error handling

  const handleShowForm = async () => {
    try {
      const response = await getJudgeId(); // Fetch judge ID from the server
      setJudgeId(response.id); // Assuming response contains judge ID
      setShowForm(true);
    } catch (err) {
      setError("Failed to fetch judge ID.");
    }
  };

  return (
    <div className="score-entry-container">
      {!showForm ? (
        <>
          <h2>Enter Scores</h2>
          {error && <div className="error">{error}</div>}
          <button onClick={handleShowForm}>Enter Scores</button>
        </>
      ) : (
        <Form judgeId={judgeId} />
      )}
    </div>
  );
}

export default ScoreEntry;
