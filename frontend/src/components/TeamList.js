import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TeamList() {
  const { judgeId } = useParams();  // Assuming you pass the judge ID as a route param
  const [judge, setJudge] = useState(null);

  useEffect(() => {
    const fetchJudgeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/api/judges/${judgeId}`);
        setJudge(response.data);
      } catch (error) {
        console.error('Error fetching judge details:', error);
      }
    };

    fetchJudgeDetails();
  }, [judgeId]);

  if (!judge) {
    return <p>Loading judge details...</p>;
  }

  return (
    <div className="team-list">
      <h1>{judge.name}'s Teams</h1>
      <ul>
        {judge.teams.map(team => (
          <li key={team._id}>
            <h2>{team.name}</h2>
            <p>Team ID: {team._id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
