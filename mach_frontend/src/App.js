import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles/App.css';
import './styles/main.css';
import { Toaster } from 'react-hot-toast';
import Layout from  '../src/others/Layout';
import ExecutiveSummary from './Components/executiesummary';
import TalentFinder from './Components/talentfinder';
import SME from './Components/sme';
import ReplacementFinder from './Components/replacement';
import ComparisionAnalysis from './Components/comparisionanalysis';
import Employeeskill from './Components/employeeskill';
import Login from './Components/login';
import Register from './Components/registration';
import Main from './Components/main';
import ListUsers from './admin/userlist';
import UpdateUserRole from './admin/updateuser';

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />

      {/* Wrap all routes with the Layout component */}
     
     
        <Routes>
              
        <Route path="/main" element={<Main />} /> 
          <Route path="/" element={<Login />} />
         

          <Route path="/Login" element={<Login />} />
          <Route path="/Components/executiesummary" element={<ExecutiveSummary />} />
          <Route path="/Components/talentfinder" element={<TalentFinder />} />
          <Route path="/Components/sme" element={<SME />} />
          <Route path="/Components/replacement" element={<ReplacementFinder />} />
          <Route path="/Components/comparisionanalysis" element={<ComparisionAnalysis />} />
          <Route path="/Components/employeeskill" element={<Employeeskill />} />
          <Route path="/Components/registration" element={<Register />} />
          <Route path="/admin/userlist" element={<ListUsers/>}></Route>
          <Route path="/admin/users/:id" element={<UpdateUserRole/>} />
        </Routes>
     
     
    </div>
  );
}

export default App;
