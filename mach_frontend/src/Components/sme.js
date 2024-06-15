import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';


const FilteredCount = ({ count }) => {
   return (
      <div>
         <h3>Number of People:</h3>
         <p>{count}</p>
      </div>
   );
};

function SME() {
   const [data, setData] = useState([]);
   const [url, setURL] = useState("http://127.0.0.1:8000/mach/sme_finder/?");
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [selectedNames, setSelectedNames] = useState([]);
   const [selectedAccounts, setSelectedAccounts] = useState([]);
   const [selectedLead, setSelectedLead] = useState([]);
   const [selectedManager, setSelectedManager] = useState([]);
   const [selectedSkills, setSelectedSkills] = useState([]);
   const [validatedFilter, setValidatedFilter] = useState("all"); // all, validated, not_validated
   const [ratingFilter, setRatingFilter] = useState(0); // 0 means no filter by rating
   const [dropdownOptions, setDropdownOptions] = useState({
      designations: [],
      names: [],
      accounts: [],
      lead: [],
      manager_name: [],
      skills: []
   });
   const [filteredData, setFilteredData] = useState([]);

   useEffect(() => {
      fetchData();
   }, [url]);

   const fetchData = async () => {
      try {
         const response = await axios.get(url);
         setData(response.data);

         const designations = Array.from(new Set(response.data.map(item => item.designation))).sort();
         const names = Array.from(new Set(response.data.map(item => item.name))).sort();
         const accounts = Array.from(new Set(response.data.map(item => item.account))).sort();
         const lead = Array.from(new Set(response.data.map(item => item.lead))).sort();
         const manager_name = Array.from(new Set(response.data.map(item => item.manager_name))).sort();
         const skills = Array.from(new Set(response.data.flatMap(item => {
            if (Array.isArray(item.skills)) {
               return item.skills.map(skill => Object.keys(skill)[0]);
            }
            return [];
         }))).sort();

         setDropdownOptions({ designations, names, accounts, lead, manager_name, skills });
         setFilteredData(response.data);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   const filterData = () => {
      let filteredData = [...data];

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

      if (validatedFilter === "validated") {
         filteredData = filteredData.filter(item => item.validated === "yes");
      } else if (validatedFilter === "not_validated") {
         filteredData = filteredData.filter(item => item.validated === "no");
      }


      if (ratingFilter > 0) {
         filteredData = filteredData.filter(item =>
            item.skills.some(skillObj => {
               const skill = Object.keys(skillObj)[0];
               const rating = skillObj[skill];
               return rating === ratingFilter;
            })
         );
      }


      if (selectedSkills.length > 0) {
         filteredData = filteredData.filter(item =>
            selectedSkills.some(skill => {
               if (Array.isArray(item.skills)) {
                  return item.skills.some(obj => Object.keys(obj)[0] === skill);
               }
               return false;
            })
         );
      }
      filteredData.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredData(filteredData);
   };
   // useEffect(() => {
   //    fetchData();
   // }, [url]);


   useEffect(() => {
      filterData();
   }, [selectedDesignations, selectedNames, selectedAccounts, selectedLead, selectedManager, selectedSkills, validatedFilter, ratingFilter]);

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

   const handleValidatedFilterChange = (filter) => {
      setValidatedFilter(filter);
   };

   const handleRatingFilterChange = (rating) => {
      setRatingFilter(rating);
   };

   const handleResetFilters = () => {
      setSelectedDesignations([]);
      setSelectedNames([]);
      setSelectedAccounts([]);
      setSelectedLead([]);
      setSelectedManager([]);
      setSelectedSkills([]);
      setValidatedFilter("All");
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


         <div>
            <button onClick={() => handleValidatedFilterChange("All")}>All</button>
            <button onClick={() => handleValidatedFilterChange("validated")}>Validated</button>
            <button onClick={() => handleValidatedFilterChange("not_validated")}>Not Validated</button>
         </div>

         <div>
            <button onClick={() => handleRatingFilterChange(5)}>Master</button>
            <button onClick={() => handleRatingFilterChange(4)}>Expert</button>
            <button onClick={() => handleRatingFilterChange(3)}>Advanced</button>
            <button onClick={() => handleRatingFilterChange(2)}>Intermediate</button>
            <button onClick={() => handleRatingFilterChange(1)}>Beginner</button>
            <button onClick={handleResetFilters}>Reset</button>
         </div>

       
         <FilteredCount count={filteredData.length} />

         {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
               <div key={item.user_id}>
                  <h2>{item.name}</h2>
                  <h2>{item.designation}</h2>
                  <h2>{item.account}</h2>
                  <h2>{item.lead}</h2>
                  <h2>{item.manager_name}</h2>
                  <div>
                     <h3>Skills:</h3>
                     {Array.isArray(item.skills) && item.skills.length > 0 ? (
                        item.skills.map(skillObj => {
                           const skill = Object.keys(skillObj)[0];
                           const rating = skillObj[skill];
                           return (
                              <div key={skill}>
                                 <p>{skill}</p>
                                 <p>{rating}</p>
                              </div>
                           );
                        })
                     ) : (
                        <p>No skills data available</p>
                     )}
                  </div>
               </div>
            ))
         ) : (
            <div>No matching data found.</div>
         )}
      </div>
   );
};

export default SME;
