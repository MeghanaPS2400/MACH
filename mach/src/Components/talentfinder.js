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
   const [url,setURL]=useState("http://127.0.0.1:8000/mach/employees1/?")

   const fetchData = async () => {
      try {
         const response = await axios.get(url);
         console.log(response.data);
         setData(response.data);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
     fetchData(); // Call the fetchData function inside useEffect
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
            <input type="checkbox" name="account" value="Mars" onChange={addIt}/>
            <button onClick={fetch}>Apply</button>
         {/* Map through the data array and return a JSX element for each item */}
         {data.map((item, index) => (<div key={item.user_id}>
            <h2 >{item.name}</h2>
            <h2 >{item.designation}</h2>
            <h2 >{item.account}</h2></div>
         ))}
      </div>
   );
}

export default TalentFinder;
