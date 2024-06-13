import React from "react"
import {Link} from "react-router-dom";
import executiveImage from "../assets/executiveSummary.png";
import talentImage from "../assets/talentFinder.png";
import smeImage from "../assets/sme.png";
import replacementImage from "../assets/replacementFinder.png";
import comparisionImage from "../assets/comparisionAnalysis.png";
import skillImage from "../assets/employeeSkill.png";
import logo from "../assets/logo.png";

function Home(){
 return(
    <>
        <header>
            <img src={logo} alt="logo"/>
            <h2>MACH</h2>
        </header>
        <div class="home">
           <div class="home-div">
            <Link to="/Components/executiesummary" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={executiveImage} alt="Icon"/><h3>Executive Summary</h3></div></Link><br/>
            <Link to="/Components/talentfinder" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={talentImage} alt="Icon"/><h3>Talent Finder</h3></div></Link><br/>
            <Link to="/Components/sme" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={smeImage} alt="Icon"/><h3>SME</h3></div></Link><br/>
            </div>
            <div class="home-div">
            <Link to="/Components/replacement" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={replacementImage} alt="Icon"/><h3>Replacement Finder</h3></div></Link><br/>
            <Link to="/Components/comparisionanalysis" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={comparisionImage} alt="Icon"/><h3>Comparision Analysis</h3></div></Link><br/>
            <Link to="/Components/employeeskill" style={{ textDecoration: 'none' }}><div class="home-div-card"><img src={skillImage} alt="Icon"/><h3>Employee Skill</h3></div></Link>
            </div>
        </div>
    </>


 )
}
export default Home