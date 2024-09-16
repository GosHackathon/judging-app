import React, { useEffect, useState } from 'react';
import { fetchJudgeAndTeams } from '../services/apiService';
import './TeamList.css'; // Import the CSS file

function TeamList() {
  const [teamNames, setTeamNames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJudgeAndTeams();
        setTeamNames(data);
      } catch (error) {
        setError('Could not fetch teams at this time.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="team-list-container">
      <h1 className="big-heading">Assigned Teams</h1> {/* Use h1 for big heading */}
      {error && <p>{error}</p>}
      <ul className="team-list">
        {teamNames.length > 0 ? (
          teamNames.map((teamName, index) => (
            <li key={index} className="team-item">
              <span>{teamName}</span> {/* Display team names in circular elements */}
            </li>
          ))
        ) : (
          !error && <p>No teams assigned yet.</p>
        )}
      </ul>
    </div>
  );
}

export default TeamList;
