import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { fetchJudges, fetchScoreManagementData } from '../services/apiService';
import './ReportPage.css'; // Import CSS for styling
import Sidebar from "../sidebar/Sidebar"; // Import the Sidebar component
import FixedNavbar from "../navbar/FixedNavbar";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384']; // Colors for pie chart slices

const ReportPage = () => {
  const [judgesData, setJudgesData] = useState([]);
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [judges, scores] = await Promise.all([
          fetchJudges(),
          fetchScoreManagementData(),
        ]);

        setJudgesData(judges);
        setJudgeGroups(scores);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Ensure the hook runs when the component mounts

  // Aggregate scores by group
  const aggregateScores = () => {
    const groupMap = new Map();

    // Create a map where key is groupName and value is an object containing judges and submission statuses
    judgeGroups.forEach(entry => {
      const { groupName, judgeName, status } = entry;

      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, { judges: new Set(), submittedJudges: new Set() });
      }

      const groupData = groupMap.get(groupName);
      groupData.judges.add(judgeName);

      if (status.toLowerCase() === 'submitted') {
        groupData.submittedJudges.add(judgeName);
      }
    });

    // Determine the final status of each group
    return Array.from(groupMap.entries()).map(([groupName, groupData]) => {
      const totalJudges = groupData.judges.size;
      const submittedJudges = groupData.submittedJudges.size;
      return { name: groupName, status: submittedJudges === totalJudges ? 'Submitted' : 'Pending' };
    });
  };

  // Count the number of submitted and pending groups
  const getGroupCounts = (status) => {
    const statusCount = aggregateScores().filter(group => group.status === status).length;
    return statusCount;
  };

  const judgeAssignmentData = [
    { name: 'Logged in Judges', value: judgesData.filter(judge => judge.teams.length > 0).length },
    { name: 'Signup Judges', value: judgesData.filter(judge => judge.teams.length === 0).length }
  ];

  const submissionStatusData = [
    { name: 'Submitted Groups', value: getGroupCounts('Submitted') },
    { name: 'Pending Groups', value: getGroupCounts('Pending') }
  ];

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="main-container">
      <Sidebar /> {/* Sidebar component included */}
      <FixedNavbar />
    <div className="report-container">
      <header className="header">
        <h1><b>Judges Report</b></h1>
      </header>

      <div className="chart-container">
        {/* Judge Assignment Pie Chart */}
        <ChartSection title="Judge Assignment">
          <PieChartComponent data={judgeAssignmentData} />
        </ChartSection>

        {/* Score Submission Status Pie Chart */}
        <ChartSection title="Score Submission Status">
          <PieChartComponent data={submissionStatusData} />
        </ChartSection>
      </div>
    </div>
    </div>
  );
};

// Reusable PieChart component
const PieChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// Reusable ChartSection component for consistent layout
const ChartSection = ({ title, children }) => (
  <div className="chart-section">
    <h2>{title}</h2>
    {children}
  </div>
);

export default ReportPage;
