import React from "react"
import {Link} from "react-router-dom";

function Home(){
 return(
    <div>
        <h1>Home</h1>
        <Link to="/Components/executiesummary">ExecutiveSummary</Link><br/>
        <Link to="/Components/talentfinder">talentfinder</Link><br/>
        <Link to="/Components/sme">SME</Link><br/>
        <Link to="/Components/replacement">ReplacementFinder</Link><br/>
        <Link to="/Components/comparisionanalysis">ComparisionAnalysis</Link><br/>
        <Link to="/Components/employeeskill">Employeeskill</Link>
    </div>
    


 )
}
export default Home