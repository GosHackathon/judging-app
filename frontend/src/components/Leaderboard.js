import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import JudgeSidebar from "../sidebar/JudgeSidebar";
import JudgeNavbar from "../navbar/JudgeNavbar";
import Sidebar from "../sidebar/Sidebar";
import FixedNavbar from "../navbar/FixedNavbar";

import {
  getFinalScores,
  downloadFinalScoreSpreadsheet,
} from "../services/apiService";
import "./Leaderboard.css";

function Leaderboard({ isMainJudge }) {
  const [allScores, setAllScores] = useState([]);
  const [displayedScores, setDisplayedScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [filterJudgeGroup, setFilterJudgeGroup] = useState("");
  const [filterTeamName, setFilterTeamName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const location = useLocation();

  useEffect(() => {
    fetchFinalScores();
  }, []);

  useEffect(() => {
    setDisplayedScores(showAll ? filteredScores : filteredScores.slice(0, 5));
  }, [showAll, filteredScores]);

  useEffect(() => {
    filterScores();
  }, [filterJudgeGroup, filterTeamName, allScores]);

  const fetchFinalScores = async () => {
    try {
      const scores = await getFinalScores();
      setAllScores(scores);
      setFilteredScores(scores);
      setDisplayedScores(scores.slice(0, 5));
    } catch (error) {
      console.error("There was an error fetching the final scores!", error);
      setError("Error fetching final scores.");
    }
  };

  const filterScores = () => {
    const filtered = allScores.filter((score) => {
      return (
        (filterJudgeGroup === "" || score.judgeGroup.toLowerCase().includes(filterJudgeGroup.toLowerCase())) &&
        (filterTeamName === "" || score.teamName.toLowerCase().includes(filterTeamName.toLowerCase()))
      );
    });
    setFilteredScores(filtered);
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

  const handleDownloadSpreadsheet = async () => {
    try {
      await downloadFinalScoreSpreadsheet();
    } catch (error) {
      setError("Error downloading spreadsheet.");
      console.error("Error downloading spreadsheet:", error);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const downloadCSV = () => {
    const headers = ["Group Name", "Team Name", "Score"];
    const csvContent = [
      headers.join(","),
      ...allScores.map((score) => `${score.judgeGroup},${score.teamName},$${Math.round(score.score)}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "leaderboard.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="page-layout">
      {location.pathname === "/main-judge/Leaderboard" ? (
        <>
          <FixedNavbar />
          <div className="main-content">
            <Sidebar />
            <LeaderboardContent />
          </div>
        </>
      ) : (
        <>
          <JudgeNavbar />
          <div className="main-content">
            <JudgeSidebar />
            <LeaderboardContent />
          </div>
        </>
      )}
    </div>
  );

  function LeaderboardContent() {
    return (
      <div className="leaderboard-container">
        <h2>Final Scores</h2>
        {isMainJudge && (
          <button onClick={handleDownloadSpreadsheet} className="btn btn-primary">
            Download Consolidated Spreadsheet
          </button>
        )}
        {error && <div className="error">{error}</div>}

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

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("judgeGroup")}>
                  Group Name {getSortIcon("judgeGroup")}
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
              {displayedScores.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.judgeGroup}</td>
                  <td>{entry.teamName}</td>
                  <td>{Math.round(entry.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-container">
          {filteredScores.length > 5 && (
            <button onClick={toggleShowAll} className="btn btn-secondary">
              {showAll ? "Show Less" : "Show Full List"}
            </button>
          )}
          <button onClick={downloadCSV} className="btn btn-secondary">
            Download Leaderboard
          </button>
        </div>
      </div>
    );
  }
}

export default Leaderboard;