import axios from 'axios';
import { useState, useEffect } from 'react';

function TalentFinder() {
   const [data, setData] = useState([]);
   const [url,setURL]=useState("http://127.0.0.1:8000/mach/employees1/?");

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
