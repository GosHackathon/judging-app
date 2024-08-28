import React from "react";
import "./JudgeHome.css"; // Import the CSS file
import Sidebar from "../sidebar/Sidebar";

function JudgeHome() {
  return (
    <div className="main-container">
      {/* Include the Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <main className="content">
        <section className="intro">
          <h1>GoSHACKATHON</h1>
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
