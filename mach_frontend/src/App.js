import { Route,Routes} from 'react-router-dom';
import './styles/App.css';
import "./styles/main.css";
import { Toaster } from 'react-hot-toast';
//import Home from './Components/home';
import Main from './Components/main';
import ExecutiveSummary from './Components/executiesummary';
import TalentFinder from './Components/talentfinder';
import SME from './Components/sme';
import ReplacementFinder from './Components/replacement';
import ComparisionAnalysis from './Components/comparisionanalysis';
import Employeeskill from './Components/employeeskill';
import Login from './Components/login';
import Register from './Components/registration';
//base url: http://127.0.0.1:8000/mach/employees1/?

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
    <Routes>
      
    <Route path="/" element={<Login/>}></Route>
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Components/executiesummary" element={<ExecutiveSummary/>}></Route>
      <Route path="/Components/talentfinder" element={<TalentFinder/>}></Route>
      <Route path="/Components/sme" element={<SME/>}></Route>
      <Route path="/Components/replacement" element={<ReplacementFinder/>}></Route>
      <Route path="/Components/comparisionanalysis" element={<ComparisionAnalysis/>}></Route>
      <Route path="/Components/employeeskill" element={<Employeeskill/>}></Route>
      <Route path="/Components/registration" element={<Register/>}></Route>
      <Route path="/main" element={<Main/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
