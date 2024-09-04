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
        setError('Could not fetch teams');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Assigned Teams</h2>
      {error && <p>{error}</p>}
      <ul>
        {teamNames.map((teamName, index) => (
          <li key={index}>{teamName}</li> // Display only team names
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
