import React, { useState, useEffect } from "react";
import {
  postScores,
  downloadConsolidatedSpreadsheet,
  uploadUpdatedSpreadsheet,
} from "../services/apiService";
import "./Form.css"; // Import your CSS file for styling

const Form = ({ judgeId, isMainJudge }) => {
  const categories = [
    "Explain the Problem",
    "Solution Benefits",
    "Application of STEM",
    "Presentation",
  ];
  const ratings = ["Not OK", "Just OK", "Alright", "Pretty Good", "Great"];

  const [numOrganizations, setNumOrganizations] = useState(2);
  const [organizations, setOrganizations] = useState(
    Array.from({ length: numOrganizations }, (_, i) => `Organization ${i + 1}`)
  );
  const [formState, setFormState] = useState(
    Array.from(
      { length: numOrganizations },
      (_, i) => `Organization ${i + 1}`
    ).reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {})
  );

  const [error, setError] = useState("");

  useEffect(() => {
    // Additional logic for Main Judge (if required)
  }, []);

  const handleNumOrganizationsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumOrganizations(count);

    const newOrganizations = Array.from(
      { length: count },
      (_, i) => `Organization ${i + 1}`
    );
    setOrganizations(newOrganizations);

    const newFormState = newOrganizations.reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {});

    setFormState(newFormState);
  };

  const handleOrganizationChange = (index, newName) => {
    const updatedOrganizations = [...organizations];
    updatedOrganizations[index] = newName;
    setOrganizations(updatedOrganizations);

    const newFormState = updatedOrganizations.reduce((orgAcc, org) => {
      orgAcc[org] = categories.reduce((catAcc, category) => {
        catAcc[category] = "";
        return catAcc;
      }, {});
      return orgAcc;
    }, {});

    setFormState(newFormState);
  };

  const handleRadioChange = (org, category, rating) => {
    setFormState((prevState) => ({
      ...prevState,
      [org]: {
        ...prevState[org],
        [category]: rating,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scores = Object.entries(formState).flatMap(([org, categories]) =>
      Object.entries(categories).map(([category, rating]) => ({
        judge: judgeId,
        entry: org,
        criteria: category,
        score: rating,
      }))
    );

    try {
      console.log("Submitting scores:", scores); // Debugging: Log scores before sending
      const response = await postScores(scores);
      console.log("Scores submitted successfully:", response);
      // Optionally clear the form or show a success message
    } catch (err) {
      console.error(
        "Error posting scores:",
        err.response ? err.response.data : err.message
      );
      setError("Error posting scores");
    }
  };

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadConsolidatedSpreadsheet();
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  const handleUploadSpreadsheet = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadUpdatedSpreadsheet(file);
        // Handle successful upload (e.g., display a success message)
      } catch (error) {
        setError("Error uploading updated spreadsheet.");
        console.error("Error uploading updated spreadsheet:", error);
      }
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Judging Form</h1>
      <div className="form-header">
        <label>
          Number of Organizations:
          <input
            type="number"
            value={numOrganizations}
            onChange={handleNumOrganizationsChange}
            min="1"
            className="num-org-input"
          />
        </label>
      </div>
      <form onSubmit={handleSubmit} className="form-content">
        {organizations.map((org, orgIndex) => (
          <div key={orgIndex} className="organization-section">
            <h2 className="organization-title">
              <input
                type="text"
                value={org}
                onChange={(e) =>
                  handleOrganizationChange(orgIndex, e.target.value)
                }
                placeholder={`Organization ${orgIndex + 1}`}
                className="org-input"
              />
            </h2>
            <table className="form-table">
              <thead>
                <tr>
                  <th>Categories</th>
                  {ratings.map((rating, ratingIndex) => (
                    <th key={ratingIndex}>{rating}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, categoryIndex) => (
                  <tr key={categoryIndex}>
                    <td className="category-cell">{category}</td>
                    {ratings.map((rating, ratingIndex) => (
                      <td key={ratingIndex} className="rating-cell">
                        <input
                          type="radio"
                          id={`${org}-${category}-${rating}`}
                          name={`${org}-${category}`}
                          value={rating}
                          checked={formState[org][category] === rating}
                          onChange={() =>
                            handleRadioChange(org, category, rating)
                          }
                          className="radio-input"
                        />
                        <label htmlFor={`${org}-${category}-${rating}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      {/* Additional functionality for Main Judge */}
      {isMainJudge && (
        <div className="main-judge-actions">
          <button
            onClick={handleDownloadSpreadsheet}
            className="btn btn-primary"
          >
            Download Consolidated Spreadsheet
          </button>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleUploadSpreadsheet}
            className="upload-input"
          />
        </div>
      )}

      {/* Display error messages */}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Form;
