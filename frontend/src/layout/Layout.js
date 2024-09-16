import React, { useState } from "react";
import FixedNavbar from "../navbar/FixedNavbar"; // Adjust the path as necessary
import Sidebar from "../sidebar/Sidebar"; // Adjust the path as necessary
import "./Layout.css"; // Optional: Create a CSS file for layout styling

function Layout({ children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`layout ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-content-wrapper">
        <FixedNavbar isCollapsed={isSidebarCollapsed} />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
