import axios from 'axios';
import { useState, useEffect } from 'react';
import Select from 'react-select';

function SME() {
   const [data, setData] = useState([]);
   const [url, setURL] = useState("http://127.0.0.1:8000/mach/employees1/?");
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [selectedNames, setSelectedNames] = useState([]);
   const [selectedAccounts, setSelectedAccounts] = useState([]);
   const [selectedLead, setSelectedLead] = useState([]);
   const [selectedManager, setSelectedManager] = useState([]);
   const [selectedSkills, setSelectedSkills] = useState([]);
   const [dropdownOptions, setDropdownOptions] = useState({
      designations: [],
      names: [],
      accounts: [],
      lead: [],
      manager_name: [],
      skills: []
   });
   const [filteredData, setFilteredData] = useState([]);

   const fetchData = async () => {
      try {
         const response = await axios.get(url);
         setData(response.data);
         console.log(url);
    
         const designations = Array.from(new Set(response.data.map(item => item.designation)));
         const names = Array.from(new Set(response.data.map(item => item.name)));
         const accounts = Array.from(new Set(response.data.map(item => item.account)));
         const lead = Array.from(new Set(response.data.map(item => item.lead)));
         const manager_name = Array.from(new Set(response.data.map(item => item.manager_name)));
         const skills = Array.from(new Set(response.data.map(item => item.skills )));
         

console.log(skills);


         setDropdownOptions({ designations, names, accounts, lead, manager_name, skills });


         let filteredData = response.data;

         if (selectedDesignations.length > 0) {
            filteredData = filteredData.filter(item => selectedDesignations.includes(item.designation));
         }

         if (selectedNames.length > 0) {
            filteredData = filteredData.filter(item => selectedNames.includes(item.name));
         }

         if (selectedAccounts.length > 0) {
            filteredData = filteredData.filter(item => selectedAccounts.includes(item.account));
         }

         if (selectedLead.length > 0) {
            filteredData = filteredData.filter(item => selectedLead.includes(item.lead));
         }

         if (selectedManager.length > 0) {
            filteredData = filteredData.filter(item => selectedManager.includes(item.manager_name));
         }

         if (selectedSkills.length > 0) {
            filteredData = filteredData.filter(item => selectedSkills.includes(item.skills));
         }

         setFilteredData(filteredData);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   useEffect(() => {
      fetchData();
   }, [url]);

   const handleDropdownChange = (selectedOptions, action) => {
      const { name } = action;
      const selectedValues = selectedOptions.map(option => option.value);

      switch (name) {
         case 'designations':
            setSelectedDesignations(selectedValues);
            break;
         case 'names':
            setSelectedNames(selectedValues);
            break;
         case 'accounts':
            setSelectedAccounts(selectedValues);
            break;
         case 'lead':
            setSelectedLead(selectedValues);
            break;
         case 'manager_name':
            setSelectedManager(selectedValues);
            break;
         case 'skills':
            setSelectedSkills(selectedValues);
            break;
         default:
            break;
      }
   };

   return (
      <div>
         <Select
            isMulti
            name="designations"
            placeholder="Select Designations"
            options={dropdownOptions.designations.map(designation => ({ value: designation, label: designation }))}
            value={selectedDesignations.map(designation => ({ value: designation, label: designation }))}
            onChange={handleDropdownChange}
         />
         <Select
            isMulti
            name="names"
            placeholder="Select Names"
            options={dropdownOptions.names.map(name => ({ value: name, label: name }))}
            value={selectedNames.map(name => ({ value: name, label: name }))}
            onChange={handleDropdownChange}
         />
         <Select
            isMulti
            name="accounts"
            placeholder="Select Accounts"
            options={dropdownOptions.accounts.map(account => ({ value: account, label: account }))}
            value={selectedAccounts.map(account => ({ value: account, label: account }))}
            onChange={handleDropdownChange}
         />
         <Select
            isMulti
            name="lead"
            placeholder="Select Lead"
            options={dropdownOptions.lead.map(lead => ({ value: lead, label: lead }))}
            value={selectedLead.map(lead => ({ value: lead, label: lead }))}
            onChange={handleDropdownChange}
         />
         <Select
            isMulti
            name="manager_name"
            placeholder="Select Manager"
            options={dropdownOptions.manager_name.map(manager => ({ value: manager, label: manager }))}
            value={selectedManager.map(manager => ({ value: manager, label: manager }))}
            onChange={handleDropdownChange}
         />
         <Select
            isMulti
            name="skills"
            placeholder="Select Skills"
            options={dropdownOptions.skills.map(skill => ({ value: skill, label: skill }))}
            value={selectedSkills.map(skill => ({ value: skill, label: skill }))}
            onChange={handleDropdownChange}
         />

         <button onClick={fetchData}>Search</button>

         {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
               <div key={item.user_id}>
                  <h2>{item.name}</h2>
                  <h2>{item.designation}</h2>
                  <h2>{item.account}</h2>
                  <h2>{item.lead}</h2>
                  <h2>{item.manager_name}</h2>
                
               </div>
            ))
         ) : (
            <div>No matching data found.</div>
         )}

      </div>
   );
}

export default SME;





