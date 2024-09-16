import React, { useState, useEffect } from 'react';
import { fetchJudges, fetchTeams} from '../services/apiService'; // Import the service function
import './JudgeList.css'; // Import the CSS file

function JudgeList() {
  const [judges, setJudges] = useState([]);
  const [teams, setTeams] = useState([]);

  const [sortCriteria, setSortCriteria] = useState('name'); // Default sort by name
  const [selectedTeam, setSelectedTeam] = useState(''); // State for filtering by team
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [assignedFilter, setAssignedFilter] = useState('all'); // State for assigned/unassigned filter

  useEffect(() => {
    // Fetch the judges list when the component mounts
    const fetchData = async () => {
      try {
        const data = await fetchJudges();
        const teams = await fetchTeams();
        setTeams(teams)
        console.log('Fetched judges:', data); // Log the fetched data
        setJudges(data);
      } catch (error) {
        console.error('Error fetching judges:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Handle team filtering change
  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Handle assigned/unassigned filter change
  const handleAssignedFilterChange = (e) => {
    setAssignedFilter(e.target.value);
  };

  // Filter judges based on the selected team, search term, and assigned/unassigned filter
  const filteredJudges = judges.filter(judge => {
    const matchesTeam = selectedTeam === '' || judge.teams.includes(selectedTeam);
    const matchesSearch = judge.name.toLowerCase().includes(searchTerm);
    const matchesAssignedFilter = assignedFilter === 'all' ||
      (assignedFilter === 'assigned' && judge.teams.length > 0) ||
      (assignedFilter === 'unassigned' && judge.teams.length === 0);
    return matchesTeam && matchesSearch && matchesAssignedFilter;
  });

  // Sort judges based on the selected criteria
  const sortedJudges = [...filteredJudges].sort((a, b) => {
    if (sortCriteria === 'name') {
      return a.name.localeCompare(b.name); // Sort by name (A-Z)
    } else if (sortCriteria === 'teams') {
      return b.teams.length - a.teams.length; // Sort by number of teams (descending)
    }
    return 0;
  });

  // Calculate the total number of assigned and unassigned judges
  const totalAssignedJudges = judges.filter(judge => judge.teams.length > 0).length;
  const totalUnassignedJudges = judges.filter(judge => judge.teams.length === 0).length;

  return (
    <div className="layout">
      {/* <FixedNavbar /> */}

      {/* <Sidebar  */}
      <div className="judge-container">
        <header className="header">
          <h1><b>JUDGES</b></h1>
        </header>

        {/* Display total counts */}
        <div className="judge-counts">
          <p>Total Assigned Judges: <b>{totalAssignedJudges}</b></p>
          <p>Total Unassigned Judges: <b>{totalUnassignedJudges}</b></p>
        </div>

        <div className="options">
          <div className="sort-options">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortCriteria} onChange={handleSortChange}>
              <option value="name">Name (A-Z)</option>
              <option value="teams">Teams</option>
            </select>
          </div>

          <div className="team-filter">
            <label htmlFor="team">Filter by Team:</label>
            <select id="team" value={selectedTeam} onChange={handleTeamChange}>
              <option value="">All Teams</option>
              {/* Dynamically add team options here */}
              {teams.map(team => {
                return <option value={team._id}>{team.teamName}</option>
              })}
              
              {/* Add more teams as needed */}
            </select>
          </div>

          <div className="assigned-filter">
            <label htmlFor="assigned">Show:</label>
            <select id="assigned" value={assignedFilter} onChange={handleAssignedFilterChange}>
              <option value="all">All Judges</option>
              <option value="assigned">Judges Assigned</option>
              <option value="unassigned">Judges Unassigned</option>
            </select>
          </div>

          <div className="search-bar-1">
            <label htmlFor="search">Search by Name:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by judge's name"
            />
          </div>
        </div>

        {/* Judge List Table */}
        <div className="judge-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Teams</th>
              </tr>
            </thead>
            <tbody>
              {sortedJudges.length === 0 ? (
                <tr>
                  <td colSpan="3">No judges found.</td>
                </tr>
              ) : (
                sortedJudges.map((judge) => (
                  <tr key={judge._id}>
                    <td>{judge.name}</td>
                    <td>{judge.email}</td>
                    <td>{judge.teams.length}</td> {/* Display team count */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JudgeList;
