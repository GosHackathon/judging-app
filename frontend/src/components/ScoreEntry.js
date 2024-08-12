import React, { useState } from "react";
import Form from "./Form"; // Import the Form component
import "./ScoreEntry.css";

function ScoreEntry() {
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="score-entry-container">
      {!showForm ? (
        <>
          <h2>Enter Scores</h2>
          <button onClick={handleShowForm}>Enter Scores</button>
        </>
      ) : (
        <Form />
      )}
    </div>
  );
}

export default ScoreEntry;
