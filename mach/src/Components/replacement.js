import { useState } from "react";
import axios from "axios";

function ReplacementFinder(){
  const [data,setdata]=useState([]);
  const [url,seturl]=useState("http://127.0.0.1:8000/mach/employees1/?")

  const fetchdata=async()=>{
   try {
      const response = await axios.get(url);
      console.log(response.data);
      setdata(response.data);
   } catch (error) {
      console.error('Error fetching data:', error);
   }
};
  
  const handlechange=(e)=>{
   e.preventDefault();
   const {name,value}=e.target;
   if(!url.includes.value)
      {
         const newurl=url+name+"="+value+"&";
         seturl(newurl);
      }
      console.log(url)
  }
  const applyb=(e)=>{
   fetchdata();
  }

    return(
      <div >
         <h1>REPLACEMENT FINDER</h1>
      <div className="replacement-filters">
      <select  className="input" id="type" name="name" onChange={handlechange} required>
      <option value="">NAME</option>
      <option value="MathCo EMP - 1">Emp1</option>
      <option value="MathCo EMP - 2">Emp2</option>
  </select>
  <button onClick={applyb}>Apply</button>
  </div>
  {data.map((item, index) => (<div key={item.user_id}>
            <h2 >{item.name}</h2>
            <h2 >{item.designation}</h2>
            <h2 >{item.account}</h2>
            <h2>{item.manager_name}</h2>
            <h2>{item.user_id}</h2></div>))}
  
  </div>
    )
}
   export default ReplacementFinder;