import React, { useState, useEffect } from 'react';
import { fetchJudgeGroups, fetchJudgesAndTeams, fetchTeamScores, submitScores } from '../services/apiService';
import './AddFinalScore.css';

const JudgeGroupSelector = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [judges, setJudges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});

  const criteriaOptions = ['Indigenous', 'Girls', 'Others'];

  useEffect(() => {
    const getGroups = async () => {
      try {
        const data = await fetchJudgeGroups();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching judge groups:", error.message);
      }
    };
    getGroups();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedGroup) {
        try {
          const results = await fetchJudgesAndTeams(selectedGroup);
          setJudges(results.judges);
          setTeams(results.teams);

          const teamScores = await fetchTeamScores(selectedGroup);
          const scoresMap = teamScores.reduce((acc, score) => ({
            ...acc,
            [score.teamName]: {
              obtainedScore: score.averageScore || 0,
              criteria1: 'Indigenous',
              criteria1Text: '',
              criteria1Score: 0,
              criteria2: 'Girls',
              criteria2Text: '',
              criteria2Score: 0,
              totalScore: score.averageScore || 0
            }
          }), {});
          setScores(scoresMap);
        } catch (error) {
          console.error("Error fetching judges, teams or scores:", error.message);
        }
      }
    };
    
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [selectedGroup]);

  const handleGroupChange = async (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
  };

  const handleCriteriaChange = (teamName, criteria, value) => {
    setScores(prevScores => ({
      ...prevScores,
      [teamName]: {
        ...prevScores[teamName],
        [criteria]: value
      }
    }));
  };

  const handleCriteriaTextChange = (teamName, criteria, value) => {
    setScores(prevScores => ({
      ...prevScores[teamName],
      [criteria]: value,
      totalScore: calculateTotalScore(prevScores[teamName])
    }));
  };

  const handleScoreChange = (teamName, criteriaScore, value) => {
    setScores(prevScores => ({
      ...prevScores,
      [teamName]: {
        ...prevScores[teamName],
        [criteriaScore]: Number(value),
        totalScore: calculateTotalScore({...prevScores[teamName], [criteriaScore]: Number(value)})
      }
    }));
  };

  const calculateTotalScore = (teamScores) => {
    return (teamScores.obtainedScore || 0) + (teamScores.criteria1Score || 0) + (teamScores.criteria2Score || 0);
  };

  const handleSubmitScores = async () => {
    try {
      const scoresToSubmit = Object.entries(scores).map(([teamName, teamScores]) => ({
        teamName,
        obtainedScore: teamScores.obtainedScore,
        criteria1: teamScores.criteria1,
        criteria1Score: teamScores.criteria1Score,
        criteria2: teamScores.criteria2,
        criteria2Score: teamScores.criteria2Score,
        totalScore: teamScores.totalScore
      }));

      await submitScores(selectedGroup, scoresToSubmit);
      alert("Scores submitted successfully!");
    } catch (error) {
      console.error("Error submitting scores:", error.message);
      alert("Failed to submit scores.");
    }
  };

  return (
    <div className="judge-group-selector">
      <div className="container">
        <h1>Select Judge Group</h1>
        <select onChange={handleGroupChange} value={selectedGroup}>
          <option value="">Select a group</option>
          {groups.map(group => (
            <option key={group._id} value={group._id}>{group.groupName}</option>
          ))}
        </select>

        {selectedGroup && (
          <div>
            <h2>Judges</h2>
            <ul>
              {judges.map(judge => (
                <li key={judge._id}>{judge.name}</li>
              ))}
            </ul>

            <h2>Teams</h2>
            <table>
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Obtained Score</th>
                  <th>Criteria 1</th>
                  <th>Criteria 1 Score</th>
                  <th>Criteria 2</th>
                  <th>Criteria 2 Score</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => {
                  const teamScore = scores[team.teamName] || {};
                  return (
                    <tr key={team._id}>
                      <td>{team.teamName}</td>
                      <td>{teamScore.obtainedScore || 0}</td>
                      <td>
                        <select 
                          value={teamScore.criteria1 || 'Indigenous'}
                          onChange={(e) => handleCriteriaChange(team.teamName, 'criteria1', e.target.value)}
                        >
                          {criteriaOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {teamScore.criteria1 === 'Others' && (
                          <input
                            type="text"
                            placeholder="Enter criteria"
                            value={teamScore.criteria1Text || ''}
                            onChange={(e) => handleCriteriaTextChange(team.teamName, 'criteria1Text', e.target.value)}
                          />
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={teamScore.criteria1Score || 0}
                          onChange={(e) => handleScoreChange(team.teamName, 'criteria1Score', e.target.value)}
                        />
                      </td>
                      <td>
                        <select 
                          value={teamScore.criteria2 || 'Girls'}
                          onChange={(e) => handleCriteriaChange(team.teamName, 'criteria2', e.target.value)}
                        >
                          {criteriaOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {teamScore.criteria2 === 'Others' && (
                          <input
                            type="text"
                            placeholder="Enter criteria"
                            value={teamScore.criteria2Text || ''}
                            onChange={(e) => handleCriteriaTextChange(team.teamName, 'criteria2Text', e.target.value)}
                          />
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={teamScore.criteria2Score || 0}
                          onChange={(e) => handleScoreChange(team.teamName, 'criteria2Score', e.target.value)}
                        />
                      </td>
                      <td>{teamScore.totalScore || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button onClick={handleSubmitScores}>Submit Scores</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeGroupSelector;
