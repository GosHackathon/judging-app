import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { fetchJudges, fetchScoreManagementData } from '../services/apiService';
import './Reports.css'; // Import CSS for styling

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384']; // Colors for pie chart slices

const Report = () => {
  const [judgesData, setJudgesData] = useState([]);
  const [judgeGroups, setJudgeGroups] = useState([]);
  const [teamScores, setTeamScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [judges, scores, teams] = await Promise.all([
          fetchJudges(),
          fetchScoreManagementData(),
          
        ]);

        setJudgesData(judges);
        setJudgeGroups(scores);
        setTeamScores(teams);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Ensure the hook runs when the component mounts

  // Pie chart data for judge assignments
  const judgeAssignmentData = [
    { name: 'Logged in Judges', value: judgesData.filter(judge => judge.teams.length > 0).length },
    { name: 'Signup Judges', value: judgesData.filter(judge => judge.teams.length === 0).length }
  ];

  // Pie chart data for submission status
  const submissionStatusData = [
    { name: 'Submitted Groups', value: judgeGroups.filter(group => group.status === 'submitted').length },
    { name: 'Pending Groups', value: judgeGroups.filter(group => group.status !== 'submitted').length }
  ];

  

  if (loading) return <div className="loading">Loading report...</div>;

  return (
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
        <ChartSection title= "  Score Submission Status">
          <PieChartComponent data={submissionStatusData} />
        </ChartSection>

        
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

export default Report;
