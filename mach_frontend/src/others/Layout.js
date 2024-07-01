// src/Components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/wallpaper1.1.jpg';
import '../styles/main.css'; // Create a CSS file for layout styles

const Layout = ({ children }) => {
  return (
    <>
      <header className="fixed-header">
        <img src={logo} alt="logo" />
        <nav>
          <ul className="menu">
            <li>
              <Link to="/Components/executiesummary">Executive Summary</Link>
            </li>
            <li>
              <Link to="/Components/talentfinder">Talent Finder</Link>
            </li>
            <li>
              <Link to="/Components/sme">SME</Link>
            </li>
            <li>
              <Link to="/Components/replacement">Replacement Finder</Link>
            </li>
            <li>
              <Link to="/Components/comparisionanalysis">Comparision Analysis</Link>
            </li>
            <li>
              <Link to="/Components/employeeskill">Employee Skill</Link>
            </li>
            <li>
              <Link to="/Login">Logout</Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <div className="content-container">
        
        {children}
      </div>
    </>
  );
};

export default Layout;
