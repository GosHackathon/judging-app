import React, { useState, useEffect } from "react";
import {
  postScores,
  fetchJudgeAndTeams,
  getUserData,
  clearPreviousScores,
  getExistingScores,
} from "../services/apiService";
import "./Form.css"; // Import your CSS file for styling

const Form = () => {
  const categories = [
    "Define the Problem",
    "Solution Process",
    "Benefits & Innovation",
    "Pitch & Prototype",
    "Teamwork",
  ];

  const ratings = {
    "Missed Out": 0,
    "OK": 1,
    "Good": 2,
    "Great": 3,
    "Beyond Expect": 4,
  };

  const [teamNames, setTeamNames] = useState([]);
  const [formState, setFormState] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [judgeId, setJudgeId] = useState(null);
  const [judgeName, setJudgeName] = useState("");
  const [judgeGroup, setJudgeGroup] = useState("");
  const [submittedTeams, setSubmittedTeams] = useState(new Set());
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // Track errors for each team
  

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await fetchJudgeAndTeams();
        setTeamNames(data);

        const initialFormState = data.reduce((acc, team) => {
          acc[team] = categories.reduce((catAcc, category) => {
            catAcc[category] = { ratingText: "", ratingValue: null };
            return catAcc;
          }, {});
          return acc;
        }, {});

        setFormState(initialFormState);
      } catch (error) {
        setError("Could not fetch teams.");
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setJudgeId(userData.id);
        setJudgeName(userData.name);
        setJudgeGroup(userData.judgeGroup);
      } catch (error) {
        setError("Error fetching user data.");
      }
    };

    fetchTeams();
    fetchUser();
  }, []);

  const handleRadioChange = (team, category, ratingText) => {
    setFormState((prevState) => ({
      ...prevState,
      [team]: {
        ...prevState[team],
        [category]: { ratingText, ratingValue: ratings[ratingText] },
      },
    }));
  };

  const handleSubmit = async (team) => {
    if (judgeId === null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [team]: "Judge ID is not available.",
      }));
      return;
    }

    try {
      setFormErrors((prevErrors) => ({ ...prevErrors, [team]: "" })); // Clear previous errors for this team
      setSuccessMessage((prevSuccess) => ({ ...prevSuccess, [team]: "" }));
      
      // Check if scores for this team and judge already exist in the database
      const response = await getExistingScores(judgeName, team);
      const { msg, scores } = response;

      if (scores) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [team]: msg,
        }));
        return;
      }

      // Convert form state to an array of scores
      const teamScores = Object.entries(formState[team]).map(
        ([category, { ratingText, ratingValue }]) => ({
          judge: judgeId,
          judgeName: judgeName,
          judgeGroup: judgeGroup,
          entry: team,
          criteria: category,
          ratingText,
          score: ratingValue,
        })
      );

      const totalScore = teamScores.reduce((sum, { score }) => sum + score, 0);
      const missingScores = teamScores.some((score) => score.score === null);

      if (missingScores) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [team]: `All categories must be rated for ${team}.`,
        }));
        return;
      }

      await postScores({
        judgeId,
        judgeName,
        judgeGroup,
        team,
        teamScores,
        totalScore,
      });

      // Set success message for this team
      setSuccessMessage((prevSuccess) => ({
        ...prevSuccess,
        [team]: `Scores submitted for ${team}`,
      }));


      setSubmittedTeams((prevState) => {
        const newMap = new Map(prevState);
        if (!newMap.has(judgeName)) {
          newMap.set(judgeName, []);
        }
        newMap.get(judgeName).push(team);
        return newMap;
      });

      if (submittedTeams.size + 1 === teamNames.length) {
        setShowFinishButton(true);
      }

      setFormState((prevState) => ({
        ...prevState,
        [team]: categories.reduce((catAcc, category) => {
          catAcc[category] = { ratingText: "", ratingValue: null };
          return catAcc;
        }, {}),
      }));
    } catch (error) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [team]: `Error submitting scores for ${team}: ${error.message}`,
      }));
    }
  };

  const handleClearForm = (team) => {
    setFormState((prevState) => ({
      ...prevState,
      [team]: categories.reduce((catAcc, category) => {
        catAcc[category] = { ratingText: "", ratingValue: null };
        return catAcc;
      }, {}),
    }));
    setSuccessMessage("");
  };

  const handleClearPreviousScore = async (team) => {
    if (judgeId === null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [team]: "Judge ID is not available.",
      }));
      return;
    }
  
    try {
      await clearPreviousScores(judgeName, team);
      setFormState((prevState) => ({
        ...prevState,
        [team]: categories.reduce((catAcc, category) => {
          catAcc[category] = { ratingText: "", ratingValue: null };
          return catAcc;
        }, {}),
      }));
      setSuccessMessage((prevSuccess) => ({
        ...prevSuccess,
        [team]: `Previous scores cleared for ${team}`,
      }));
    } catch (error) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [team]: `Error clearing previous scores for ${team}.`,
      }));
    }
  };
  
  const handleFinish = () => {
    setShowConfirmation(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmation(false);
  };

  const handleCancelFinish = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="form-container">
      {teamNames.length > 0 ? (
        teamNames.map((team, teamIndex) => (
          <div key={teamIndex} className="team-section">
            {/* Display error message only for this team */}
            {formErrors[team] && (
              <div className="message-container-inline error-inline">
                {formErrors[team]}
              </div>
            )}
            {/* Display success message only for this team */}
            {successMessage[team] && (
              <div className="message-container-inline success-message-inline">
                {successMessage[team]}
              </div>
            )}
  
            <h2 className="team-title">{team}</h2>
  
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(team); // Pass team name to the submit handler
              }}
              className="form-content"
            >
              <table className="form-table">
                <thead>
                  <tr>
                    <th>Categories</th>
                    {Object.keys(ratings).map((ratingText, ratingIndex) => (
                      <th key={ratingIndex}>{ratingText}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, categoryIndex) => (
                    <tr key={categoryIndex}>
                      <td className="category-cell">{category}</td>
                      {Object.keys(ratings).map((ratingText, ratingIndex) => (
                        <td key={ratingIndex} className="rating-cell">
                          <input
                            type="radio"
                            id={`${team}-${category}-${ratingText}`}
                            name={`${team}-${category}`}
                            value={ratingText}
                            checked={
                              formState[team][category].ratingText === ratingText
                            }
                            onChange={() =>
                              handleRadioChange(team, category, ratingText)
                            }
                            className="radio-input"
                          />
                          <label htmlFor={`${team}-${category}-${ratingText}`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
  
              <div className="button-container">
                <button
                  type="button"
                  onClick={() => handleClearPreviousScore(team)}
                  className="clear-previous-button"
                >
                  Clear Previous Score
                </button>
                <button
                  type="button"
                  onClick={() => handleClearForm(team)}
                  className="clear-button"
                >
                  Clear Form
                </button>
                <button type="submit" className="submit-button">
                  Submit Scores for {team}
                </button>
              </div>
            </form>
          </div>
        ))
      ) : (
        <p>Loading teams...</p>
      )}
  
      {showFinishButton && (
        <div className="finish-section">
          <button onClick={handleFinish} className="finish-button">
            Finish
          </button>
        </div>
      )}
  
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to finish and submit all the scores?</p>
          <button onClick={handleConfirmFinish} className="confirm-button">
            Yes
          </button>
          <button onClick={handleCancelFinish} className="cancel-button">
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
