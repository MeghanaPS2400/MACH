import React from "react";
import { Link } from "react-router-dom";
import executiveImage from "../assets/executiveSummary.png";
import talentImage from "../assets/talentFinder.png";
import smeImage from "../assets/sme.png";
import replacementImage from "../assets/replacementFinder.png";
import comparisionImage from "../assets/comparisionAnalysis.png";
import skillImage from "../assets/employeeSkill.png";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/wallpaper1.1.jpg"; 
import Layout from "../others/Layout";
// import logout from "../assets/logout.png"
function Main() {

  const containerStyle = {
    position: 'relative',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    height: '545px', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <>
   <Layout>
      <div style={containerStyle}>
        <div style={overlayStyle}>
        <Link to="/Components/replacement" style={{ textDecoration: 'none' }}><img id="replacement" class="icons" src={replacementImage} alt="Icon" title="Replacement Finder"/>
        </Link><br/>
            <Link to="/Components/comparisionanalysis" style={{ textDecoration: 'none' }}><img id="comparision" class="icons" src={comparisionImage} alt="Icon" title="Comparision Analysis"/></Link><br/>
            <Link to="/Components/employeeskill" style={{ textDecoration: 'none' }}><img id="skills" class="icons" src={skillImage} alt="Icon" title="Employee Skill"/></Link>
          <h1 class="heading">MACH</h1>
             <Link to="/Components/executiesummary" style={{ textDecoration: 'none' }}><img id="executive" class="icons" src={executiveImage} alt="Icon" title="Executive Summary"/></Link>
             <Link to="/Components/talentfinder" style={{ textDecoration: 'none' }}><img id="talent" class="icons" src={talentImage} alt="Icon" title="Talent Finder"/></Link>
             <Link to="/Components/sme" style={{ textDecoration: 'none' }}><img id="sme" class="icons" src={smeImage} alt="Icon" title="SME"/></Link>
        </div>
      </div>
      </Layout>
    </>
  );
}

export default Main;
