import React, { useState, useEffect } from 'react';
import { fetchScoreManagementData } from '../services/apiService';
import './ScoreManagement.css';
import * as XLSX from 'xlsx';

const ScoreManagement = () => {
  const [scoreData, setScoreData] = useState([]);
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchScoreManagementData();
      console.log("API Response:", response);
      
      const groups = getUniqueGroups(response);
      setJudgeGroups(groups);
      setScoreData(response);
      setLoading(false);

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
        return;
      }

      if (!groups[entry.judgeGroupName]) {
        groups[entry.judgeGroupName] = [];
      }
      groups[entry.judgeGroupName].push(entry);
    });
    
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
      setShowDownloadButton(true);
    } else {
      setCompletionMessage('');
      setShowDownloadButton(false);
    }
  };

  const handleGroupClick = (groupName) => {
    setSelectedGroup(groupName === selectedGroup ? null : groupName);
  };

  const downloadScoresSheet = () => {
    const flattenedData = judgeGroups.flatMap(group => 
      group.entries.map(entry => ({
        'Judge Group Name': group.groupName,
        'Judge Name': entry.judgeName,
        'Team Name': entry.teamName,
        'Define the Problem': entry.scores[0],
        'Solution Process': entry.scores[1],
        'Benefits & Innovation': entry.scores[2],
        'Pitch & Prototype': entry.scores[3],
        'Teamwork': entry.scores[4],
        'Total Score': entry.totalScore
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");

    // Generate binary string
    const excelBinaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to ArrayBuffer
    const buffer = new ArrayBuffer(excelBinaryString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelBinaryString.length; i++) {
      view[i] = excelBinaryString.charCodeAt(i) & 0xFF;
    }

    // Create Blob
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ScoresSheet.xlsx';
    document.body.appendChild(link); // Needed for Firefox
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
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

      {showDownloadButton && (
        <button onClick={downloadScoresSheet} className="download-button">
          Download Scores Sheet
        </button>
      )}

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
                              {entry.scores.map((score, scoreIndex) => (
                                <td key={scoreIndex}>{score !== '-' ? score : '-'}</td>
                              ))}
                              <td>{entry.totalScore !== '-' ? entry.totalScore : '-'}</td>
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