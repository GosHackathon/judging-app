import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JudgeGroups.css'; // Import your CSS file for styling

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5003/api";

const JudgeGroup = () => {
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJudgeGroups = async () => {
      try {
        const response = await axios.get(`${API_URL}/team-management/view`);
        setJudgeGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching judge groups.');
        setLoading(false);
        console.error('Error fetching judge groups:', err);
      }
    };

    fetchJudgeGroups();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="judge-group-container">
      <h2>Judge Groups</h2>
      <table className="judge-group-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Judge Name</th>
            <th>Judge Email</th>
            <th>Team Name</th>
          </tr>
        </thead>
        <tbody>
          {judgeGroups.map((group) =>
            group.teams.map((team, teamIndex) => (
              <tr key={`${group._id}-${teamIndex}`}>
                <td>{group.groupName}</td>
                <td>{group.judges[teamIndex]?.name || "N/A"}</td>
                <td>{group.judges[teamIndex]?.email || "N/A"}</td>
                <td>{team.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JudgeGroup;
