import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JudgeSidebar from "../sidebar/JudgeSidebar";
import JudgeNavbar from "../navbar/JudgeNavbar";
import {
  postScores,
  fetchJudgeAndTeams,
  getUserData,
  clearPreviousScores,
  getExistingScores,
  checkSubmittedScores,
} from "../services/apiService";
import "./Form.css";

const Form = () => {
  const categories = [
    {
      name: "Define the Problem",
      
      ratings: {
        "Missed Out": "Did not state the problem.",
        "OK": "Can restate the problem but does not give any further information.",
        "Good": "Restated the problem with some understanding of the issue (no evidence of research beyond what was provided within the GoSH comic).",
        "Great": "Restated and/or defined the problem demonstrating a clear understanding of the issue with evidence of additional research.",
        "Beyond Expect": "Defined the problem in their own words, demonstrated clear understanding of the issue and the impact on multiple stakeholders and/or short- & long-term impact, AND provided additional information on the issues."
      }
    },
    {
      name: "Solution Process",
      description: "*Process relates to multiple steps provided in GoSH comic, OR team documents the steps of their alternative process to reaching their solution. Using one prompt for an AI solution is not a complete process, but AI assisting multiple or all steps towards the solution is a solution process.",
      ratings: {
        "Missed Out": "No solution produced   OR solution produced not related to chosen problem.",
        "OK": "Solution unclear OR solution stated but no evidence of processes used to reach solution look for evidence of documented solution and/or steps taken, as team may have done this but unable to explain verbally.",
        "Good": "Solution clear with evidence of some processes used.",
        "Great": "Solution clear and able to demonstrate how the process and/or methods used led to team solution. Might discuss problems faced during the process but do not show how these were overcome and/or how they impacted end solution.",
        "Beyond Expect": "Solution (or stage finished on) clear with evidence of each step of the process leading to the next step. AND can clearly identify challenges faced throughout process and how these were overcome to impact end solution and/or end stage."
      }
    },
    {
      name: "Benefits & Innovation",
      description: "Innovation is doing something differently or better. At GoSH, unique perspectives & creative approaches to solutions are rewarded in this category",
      ratings: {
        "Missed Out": "Did not discuss or document the benefits of their solution   AND/OR      A copy of something already in place without any meaningful changes (e.g. renaming, changing colour are not adding value to existing solutions).",
        "OK": "Brief explanation of benefits with no evidence of research    AND/OR   Good idea generated on the day, but group unaware that innovation/ technology already exists (did not research existing solutions).",
        "Good": "Adequately explains the benefits with evidence of research (can be from comic) OR as per following without research    AND/OR   A well thought out solution, but little innovation (e.g. a new idea that uses green energy such as solar, but in the same way it is being used now).",
        "Great": "Explains the benefits for multiple stakeholders, and/or discusses long term impact. Evidence of research.   AND/OR    Solution is innovative or incorporates features that are innovative (e.g. uses solar energy but considers future methods for capturing and processing it).",
        "Beyond Expect": "Uses data to quantify the benefits, and/or project the benefits. (If achieved this, contenders for data and AI award)        AND/OR    Solution is *complex in that multiple (2 or more) innovative ideas and/or systems have been applied for purpose (e.g. well-considered, not tech for sake of tech) If achieved this, contenders for innovation award."
      }
    },
    {
      name: "Pitch & Prototype",
    
      ratings: {
        "Missed Out": "No prototype completed or preparation given to pitch.",
        "OK": "Unlikely that pitch strategy has been discussed, but some effort made on prototype.",
        "Good": "Pitch identifies problem and solution, OR a reasonable prototype demonstrated.",
        "Great": "Pitch identifies problem, solution, and relates to SDGs, and/OR a good prototype.",
        "Beyond Expect": "Pitch identifies problem, solution, and relates to SDGs AND an impressive prototype presented."
      }
    },
    {
      name: "Teamwork",
      description: "evidence of what team members contributed can be in the form of whiteboarding, post it notes, and/or planning",
      ratings: {
        "Missed Out": "Did not work as a team (remember, independent workers can still be a team – check what role each is doing before assuming no teamwork).",
        "OK": "Evidence of collaboration but unable to identify team roles.",
        "Good": "Able to identify most roles, and/or demonstrate work completed by most teammates (e.g. if one is not contributing, team can still score 2).",
        "Great": "Clear roles for all team members & can demonstrate work completed by some of team (e.g. one or more team members may not have documented their contribution) .",
        "Beyond Expect": "Clear roles, documented output from each team member (can be notes/planning), and evidence of members supporting each other."
      }
    },
  ];

  const ratingValues = {
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
  const [formErrors, setFormErrors] = useState({});
  const [finishError, setFinishError] = useState("");
  const [finishMessage, setFinishMessage] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await fetchJudgeAndTeams();
        setTeamNames(data);

        const initialFormState = data.reduce((acc, team) => {
          acc[team] = categories.reduce((catAcc, category) => {
            catAcc[category.name] = { ratingText: "", ratingValue: null };
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
        setJudgeId(userData.judgeId);
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
        [category]: { ratingText, ratingValue: ratingValues[ratingText] },
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
      setFormErrors((prevErrors) => ({ ...prevErrors, [team]: "" }));
      setSuccessMessage((prevSuccess) => ({ ...prevSuccess, [team]: "" }));
      
      const response = await getExistingScores(judgeName, team);
      const { msg, scores } = response;

      if (scores) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [team]: msg,
        }));
        return;
      }

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

      setSuccessMessage((prevSuccess) => ({
        ...prevSuccess,
        [team]: `Scores submitted for ${team}`,
      }));

      setSubmittedTeams((prevState) => new Set(prevState).add(team));

      setFormState((prevState) => ({
        ...prevState,
        [team]: categories.reduce((catAcc, category) => {
          catAcc[category.name] = { ratingText: "", ratingValue: null };
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
        catAcc[category.name] = { ratingText: "", ratingValue: null };
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
      await clearPreviousScores(judgeId, team);
      setFormState((prevState) => ({
        ...prevState,
        [team]: categories.reduce((catAcc, category) => {
          catAcc[category.name] = { ratingText: "", ratingValue: null };
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

  const handleFinishScoring = async () => {
    if (!judgeId) {
      setFinishError("Unable to verify judge. Please try again.");
      setFinishMessage("");
      return;
    }

    try {
      const response = await checkSubmittedScores(judgeId, teamNames);
      const unsubmittedTeams = response.unsubmittedTeams;

      if (unsubmittedTeams.length === 0) {
        setFinishError(""); // Clear any existing error message
        setFinishMessage("All scores submitted successfully. Redirecting to judge home page...");
        setTimeout(() => {
          navigate("/judge/home");
        }, 3000);
      } else {
        setFinishMessage(""); // Clear any existing success message
        setFinishError(`Scores haven't been submitted for: ${unsubmittedTeams.join(", ")}`);
      }
    } catch (error) {
      setFinishMessage(""); // Clear any existing success message
      setFinishError("Error checking submitted scores. Please try again.");
    }
  };

  return (
    <div className="page-layout">
    <div className="main-content">
      <JudgeSidebar />
      <JudgeNavbar />
    <div className="form-container">
      {teamNames.length > 0 ? (
        teamNames.map((team, teamIndex) => (
          <div key={teamIndex} className="team-section">
            {formErrors[team] && (
              <div className="message-container-inline error-inline">
                {formErrors[team]}
              </div>
            )}
            {successMessage[team] && (
              <div className="message-container-inline success-message-inline">
                {successMessage[team]}
              </div>
            )}
  
            <h2 className="team-title">{team}</h2>
  
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(team);
              }}
              className="form-content"
            >
              <table className="form-table">
                <thead>
                  <tr>
                    <th>Categories</th>
                    {Object.keys(ratingValues).map((ratingText, ratingIndex) => (
                      <th key={ratingIndex}>{ratingText}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(({ name, description, ratings }, categoryIndex) => (
                    <tr key={categoryIndex}>
                      <td className="category-cell">
                        <div className="description-container">
                          <span>{name}</span>
                          <div className="description-text">{description}</div>
                        </div>
                      </td>
                      {Object.entries(ratings).map(([ratingText, ratingDescription], ratingIndex) => (
                        <td key={ratingIndex} className="rating-cell">
                          <div className="description-container">
                            <input
                              type="radio"
                              id={`${team}-${name}-${ratingText}`}
                              name={`${team}-${name}`}
                              value={ratingText}
                              checked={formState[team][name]?.ratingText === ratingText}
                              onChange={() => handleRadioChange(team, name, ratingText)}
                              className="radio-input"
                            />
                            <label htmlFor={`${team}-${name}-${ratingText}`} />
                            <div className="description-text">{ratingDescription}</div>
                          </div>
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
  
      <div className="finish-scoring-section">
        {finishError && <div className="error-message">{finishError}</div>}
        {finishMessage && <div className="success-message">{finishMessage}</div>}
        <button onClick={handleFinishScoring} className="finish-scoring-button">
          Finish Scoring
        </button>
      </div>
    </div>
    </div>
    </div>
  );
}; 
export default Form;