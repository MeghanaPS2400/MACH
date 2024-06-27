// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css'

function Navbar() {
  const [navVisible, setNavVisible] = useState(false); // Initially hidden
  const location = useLocation();

  useEffect(() => {
    setNavVisible(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    setNavVisible(true);
  };

  const handleMouseLeave = () => {
    setNavVisible(false);
  };

  return (
    <>
      <header 
        className={navVisible ? "nav-visible" : "nav-hidden"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
              <Link to="/Components/comparisonanalysis">Comparison Analysis</Link>
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

      <button
        className="toggle-nav-button"
        onMouseEnter={handleMouseEnter}
      >
        <FontAwesomeIcon icon={faCaretUp} />
      </button>
    </>
  );
}

export default Navbar;
