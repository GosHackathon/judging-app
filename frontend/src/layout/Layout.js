import React from "react";
import FixedNavbar from "../navbar/FixedNavbar"; // Adjust the path as necessary
import Sidebar from "../sidebar/Sidebar"; // Adjust the path as necessary
import "./Layout.css"; // Optional: Create a CSS file for layout styling

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <FixedNavbar />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
