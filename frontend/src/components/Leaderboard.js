import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { getFinalScores, downloadFinalScoreSpreadsheet } from "../services/apiService";
import "./Leaderboard.css";

function Leaderboard({ isMainJudge }) {
  const [finalScores, setFinalScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterJudgeGroup, setFilterJudgeGroup] = useState("");
  const [filterTeamName, setFilterTeamName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinalScores = async () => {
      try {
        const response = await getFinalScores();
        setFinalScores(response.data);
        setFilteredScores(response.data); // Initialize filteredScores
      } catch (error) {
        console.error("There was an error fetching the final scores!", error);
        setError("Error fetching final scores.");
      }
    };

    fetchFinalScores();
  }, []);

  useEffect(() => {
    const filterScores = () => {
      const filtered = finalScores.filter((score) => {
        return (
          (filterJudgeGroup === "" || score.judgeGroup.toLowerCase().includes(filterJudgeGroup.toLowerCase())) &&
          (filterTeamName === "" || score.teamName.toLowerCase().includes(filterTeamName.toLowerCase()))
        );
      });
      setFilteredScores(filtered);
    };

    filterScores(); // Filter scores whenever filter criteria changes
  }, [filterJudgeGroup, filterTeamName, finalScores]); // Now it includes finalScores and both filters in the dependency array

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadFinalScoreSpreadsheet();
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredScores].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setFilteredScores(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <>
          <FontAwesomeIcon icon={faSortUp} />
          <FontAwesomeIcon icon={faSortDown} style={{ color: "lightgray" }} />
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faSortUp} style={{ color: "lightgray" }} />
          <FontAwesomeIcon icon={faSortDown} />
        </>
      );
    } else {
      return (
        <>
          <FontAwesomeIcon icon={faSortUp} style={{ color: "lightgray" }} />
          <FontAwesomeIcon icon={faSortDown} style={{ color: "lightgray" }} />
        </>
      );
    }
  };

  return (
    <div className="page-layout">
      <div className="main-content">
        <div className="leaderboard-container">
          <h2>Final Scores</h2>
          {isMainJudge && (
            <button onClick={handleDownloadSpreadsheet} className="btn btn-primary">
              Download Consolidated Spreadsheet
            </button>
          )}
          {error && <div className="error">{error}</div>}

          {/* Filter inputs */}
          <div className="filter-container">
            <input
              type="text"
              placeholder="Filter by Judge Group"
              value={filterJudgeGroup}
              onChange={(e) => setFilterJudgeGroup(e.target.value)}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Filter by Team Name"
              value={filterTeamName}
              onChange={(e) => setFilterTeamName(e.target.value)}
              className="filter-input"
            />
          </div>

          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("judgeGroup")}>
                  Judge Group {getSortIcon("judgeGroup")}
                </th>
                <th onClick={() => handleSort("teamName")}>
                  Team Name {getSortIcon("teamName")}
                </th>
                <th onClick={() => handleSort("score")}>
                  Score {getSortIcon("score")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.judgeGroup}</td>
                  <td>{entry.teamName}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
