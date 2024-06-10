import React from "react"
import {Link} from "react-router-dom";

function Home(){
 return(
    <div>
        <div class="home">
           <div class="home-div">
            <Link to="/Components/executiesummary"><div class="executive">ExecutiveSummary</div></Link><br/>
            <Link to="/Components/talentfinder"><div class="talent">talentfinder</div></Link><br/>
            <Link to="/Components/sme"><div class="sme">SME</div></Link><br/>
            </div>
            <div class="home-div">
            <Link to="/Components/replacement"><div class="replacement">ReplacementFinder</div></Link><br/>
            <Link to="/Components/comparisionanalysis"><div>ComparisionAnalysis</div></Link><br/>
            <Link to="/Components/employeeskill"><div>Employeeskill</div></Link>
            </div>
        </div>
    </div>
    


 )
}
export default Home