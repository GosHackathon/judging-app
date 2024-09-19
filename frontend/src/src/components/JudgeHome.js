import React, { useState, useEffect } from "react";
import { getUserData } from "../services/apiService";
import "./JudgeHome.css"; // Import the CSS file
import JudgeSidebar from "../sidebar/JudgeSidebar";
import JudgeNavbar from "../navbar/JudgeNavbar";

function JudgeHome() {

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUserData();
        if (userResponse) {
          setUser(userResponse);
        }
      } catch (error) {
        setError("Error fetching user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);


  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }


  return (
    <div className="main-container">
      <JudgeSidebar />
      <JudgeNavbar />
      <main className="content">
        <section className="intro">
        <h1>Welcome, {user.name}!</h1>
          <h2>GoSHACKATHON</h2>
          <h2>WESTERN AUSTRALIA</h2>
          <p>Bend and break barriers at GoSH!</p>
          <p>
            Technology brings the world together, and we are bringing the best
            from the West to GoSHackathon 2024!
          </p>
          <p>
            This epic creative hub will see youth, disruptors, and innovators
            immersed in live demonstrations, listen to expert panelists, be
            inspired by opportunities presented by industry at Day One GoSH24,
            and finally, partake in the major GoSHackathon Day Two hackathon
            event that will be open to teams from across Western Australia.
          </p>
        
        </section>
      </main>
    </div>
  );
}

export default JudgeHome;