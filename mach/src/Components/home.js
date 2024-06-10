import React from "react"
import {Link} from "react-router-dom";

function Home(){
 return(
    <div>
        <div class="home">
           <div class="home-div">
            <Link to="/Components/executiesummary" style={{ textDecoration: 'none' }}><div class="executive">ExecutiveSummary</div></Link><br/>
            <Link to="/Components/talentfinder" style={{ textDecoration: 'none' }}><div class="talent">talentfinder</div></Link><br/>
            <Link to="/Components/sme" style={{ textDecoration: 'none' }}><div class="sme">SME</div></Link><br/>
            </div>
            <div class="home-div">
            <Link to="/Components/replacement" style={{ textDecoration: 'none' }}><div class="replacement">ReplacementFinder</div></Link><br/>
            <Link to="/Components/comparisionanalysis" style={{ textDecoration: 'none' }}><div>ComparisionAnalysis</div></Link><br/>
            <Link to="/Components/employeeskill" style={{ textDecoration: 'none' }}><div>Employeeskill</div></Link>
            </div>
        </div>
    </div>
    


 )
}
export default Home