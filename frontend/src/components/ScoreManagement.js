import React, { useState, useEffect } from 'react';
import { fetchScoreManagementData } from '../services/apiService';
import './ScoreManagement.css';

const ScoreManagement = () => {
  // const [scoreData, setScoreData] = useState([]);
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchScoreManagementData();
      const groups = getUniqueGroups(response);
      setJudgeGroups(groups);
      // setScoreData(response);
      setLoading(false);
      checkAllGroupsSubmitted(groups);
    } catch (err) {
      setError('Failed to load data.');
      setLoading(false);
    }
  };

  const getUniqueGroups = (data) => {
    const groups = {};
    data.forEach((entry) => {
      if (entry.judgeGroupName) {
        if (!groups[entry.judgeGroupName]) {
          groups[entry.judgeGroupName] = [];
        }
        groups[entry.judgeGroupName].push(entry);
      }
    });

    return Object.keys(groups).map((groupName) => ({
      groupName,
      entries: groups[groupName],
      status: determineGroupStatus(groups[groupName]),
    }));
  };

  const determineGroupStatus = (entries) => {
    const allSubmitted = entries.every(
      (entry) => entry.status.toLowerCase() === 'submitted'
    );
    return allSubmitted ? 'submitted' : 'pending';
  };

  const checkAllGroupsSubmitted = (groups) => {
    const allGroupsSubmitted = groups.every(
      (group) => group.status === 'submitted'
    );
    setCompletionMessage(
      allGroupsSubmitted ? 'All judges have submitted their scores.' : ''
    );
  };

  const handleGroupClick = (groupName) => {
    setSelectedGroup((prev) => (prev === groupName ? null : groupName));
  };

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    
    <div className="score-management">
      <h1 className="main-header">Score Management</h1>

      {completionMessage && (
        <div className="completion-message">{completionMessage}</div>
      )}
  

      <div className="teams-container">
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
                <tr
                  onClick={() => handleGroupClick(group.groupName)}
                  className={selectedGroup === group.groupName ? 'selected' : ''}
                >
                  <td>{group.groupName || 'Unknown Group'}</td>
                  <td>
                    <span className={`status ${group.status}`}>
                      {group.status}
                    </span>
                  </td>
                </tr>
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
                          {group.entries.map((entry, entryIndex) => (
                            <tr
                              key={entryIndex}
                              className={entry.status.toLowerCase()}
                            >
                              <td>{entry.judgeName}</td>
                              <td>{entry.teamName}</td>
                              {entry.scores.map((score, scoreIndex) => (
                                <td key={scoreIndex}>
                                  {score !== '-' ? score : '-'}
                                </td>
                              ))}
                              <td>
                                {entry.totalScore !== '-'
                                  ? entry.totalScore
                                  : '-'}
                              </td>
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
