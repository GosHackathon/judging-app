import React, { useState, useEffect } from 'react';
import { fetchScoreManagementData } from '../services/apiService';
import './ScoreManagement.css';

const ScoreManagement = () => {
  const [scoreData, setScoreData] = useState([]);
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Group currently expanded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchScoreManagementData(); // Call to backend
      
      // Debug: Check the response structure
      console.log("API Response:", response);
      
      const groups = getUniqueGroups(response);
      setJudgeGroups(groups);
      setScoreData(response);
      setLoading(false);

      // Check if all groups are submitted
      checkAllGroupsSubmitted(groups);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const getUniqueGroups = (data) => {
    const groups = {};
    data.forEach(entry => {
      if (!entry.judgeGroupName) {
        console.error("Missing judgeGroupName in entry:", entry);
        return; // Skip if judgeGroupName is missing
      }

      if (!groups[entry.judgeGroupName]) {
        groups[entry.judgeGroupName] = [];
      }
      groups[entry.judgeGroupName].push(entry);
    });

    // Debug: Check the groups object
    console.log("Groups:", groups);
    
    return Object.keys(groups).map(groupName => ({
      groupName,
      entries: groups[groupName],
      status: determineGroupStatus(groups[groupName]),
    }));
  };

  const determineGroupStatus = (entries) => {
    const allSubmitted = entries.every(entry => entry.status.toLowerCase() === 'submitted');
    return allSubmitted ? 'submitted' : 'pending';
  };

  const checkAllGroupsSubmitted = (groups) => {
    const allGroupsSubmitted = groups.every(group => group.status.toLowerCase() === 'submitted');
    if (allGroupsSubmitted) {
      setCompletionMessage('All judges have submitted their scores.');
    } else {
      setCompletionMessage('');
    }
  };

  const handleGroupClick = (groupName) => {
    setSelectedGroup(groupName === selectedGroup ? null : groupName);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="score-management">
      <h1 className="main-header">Score Management</h1>

      {completionMessage && (
        <div className="completion-message">
          {completionMessage}
        </div>
      )}

      {/* Judge Groups List */}
      <div className="group-list">
        <table className="group-table">
          <thead>
            <tr>
              <th>Judge Group Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {judgeGroups.map((group, index) => (
              <React.Fragment key={index}>
                <tr onClick={() => handleGroupClick(group.groupName)}>
                  <td>{group.groupName || 'Unknown Group'}</td>
                  <td>
                    <span className={`status ${group.status.toLowerCase()}`}>
                      {group.status}
                    </span>
                  </td>
                </tr>

                {/* Expandable details */}
                {selectedGroup === group.groupName && (
                  <tr>
                    <td colSpan="2">
                      <table className="detail-table">
                        <thead>
                          <tr>
                            <th>Judge Name</th>
                            <th>Team Name</th>
                            <th>Define the Problem</th>
                            <th>Solution Process</th>
                            <th>Benefits & Innovation</th>
                            <th>Pitch & Prototype</th>
                            <th>Teamwork</th>
                            <th>Total Score</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.entries.map((entry, index) => (
                            <tr key={index} className={entry.status.toLowerCase()}>
                              <td>{entry.judgeName}</td>
                              <td>{entry.teamName}</td>

                              {/* Map through the individual scores */}
                              {entry.scores.map((score, scoreIndex) => (
                                <td key={scoreIndex}>{score !== '-' ? score : '-'}</td>
                              ))}

                              {/* Display total score */}
                              <td>{entry.totalScore !== '-' ? entry.totalScore : '-'}</td>

                              {/* Display status */}
                              <td>
                                <span className={`status ${entry.status.toLowerCase()}`}>
                                  {entry.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreManagement;
