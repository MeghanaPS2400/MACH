import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchUsers } from '../redux/talentReducer';
import loading from "../assets/loading.gif";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TalentFinder = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [selectedDeliveryLeads, setSelectedDeliveryLeads] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [sortOption, setSortOption] = useState(null);

   useEffect(() => {
     fetchData(); 
   }, []); 

   const addIt=(e)=>{
       // console.log(e.target);
       e.preventDefault();
        const {name,value}=e.target;
        if (!url.includes(value))
         {
            const newurl=url+name+"="+value+"&";
            setURL(newurl);
         }
     
     
        console.log(url);

   }

   const fetch=(e)=>{
      e.preventDefault();
      fetchData();
   console.log(url)}

   return (
      <div>
            <input type="checkbox" name="designation" value="Analyst" onChange={addIt}/>
            <input type="checkbox" name="designation" value="Associate" onChange={addIt}/>
            <button onClick={fetch}>Apply</button>
       
         {data.map((item, index) => (<div key={item.user_id}>
            <h2 >{item.name}</h2>
            <h2 >{item.designation}</h2>
            <h2 >{item.account}</h2></div>
         ))}
      </div>
   );
}

export default TalentFinder;
