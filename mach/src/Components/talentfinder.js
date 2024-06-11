/*import axios from 'axios';
import {useState,useEffect} from 'react';

function TalentFinder(){
   const [data,setData]=useState([]);
   const get=async()=>{
      const r=await axios.get(`http://127.0.0.1:8000/mach/employees1/?designation=Analyst&account=Mars&lead=Himanshu%20Misra`);
      console.log(r.data);
      setData(r.data);
   }
   useEffect(()=>get,[]);
    return(
       <h1>{data.map((i)=>(<h2>{i}</h2>))}</h1>
    )
   }
   export default TalentFinder;*/


   import axios from 'axios';
import { useState, useEffect } from 'react';

function TalentFinder() {
   const [data, setData] = useState([]);

   const fetchData = async () => {
      try {
         const response = await axios.get(`http://127.0.0.1:8000/mach/employees1/?designation=Analyst&account=Mars&lead=Himanshu%20Misra`);
         console.log(response.data);
         setData(response.data);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
      fetchData(); // Call the fetchData function inside useEffect
   }, []); // Empty dependency array to execute only once

   return (
      <div>
         {/* Map through the data array and return a JSX element for each item */}
         {data.map((item, index) => (<>
            <h2 key={index}>{item.designation}</h2>
            <h2 key={index}>{item.account}</h2></>
         ))}
      </div>
   );
}

export default TalentFinder;
