import { Route,Routes} from 'react-router-dom';
import './App.css';
import Home from './Components/home';
import ExecutiveSummary from './Components/executiesummary';
import TalentFinder from './Components/talentfinder';
import SME from './Components/sme';
import ReplacementFinder from './Components/replacement';
import ComparisionAnalysis from './Components/comparisionanalysis';
import Employeeskill from './Components/employeeskill';
// 

function App() {
  return (
    <div className="App">
      <h1>
        MACH
      </h1>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Components/executiesummary" element={<ExecutiveSummary/>}></Route>
      <Route path="/Components/talentfinder" element={<TalentFinder/>}></Route>
      <Route path="/Components/sme" element={<SME/>}></Route>
      <Route path="/Components/replacement" element={<ReplacementFinder/>}></Route>
      <Route path="/Components/comparisionanalysis" element={<ComparisionAnalysis/>}></Route>
      <Route path="/Components/employeeskill" element={<Employeeskill/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
