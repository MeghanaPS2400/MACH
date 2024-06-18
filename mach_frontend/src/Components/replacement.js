import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
//import './ReplacementFinder.css'; // Make sure to create and import this CSS file
 
const FilteredCount = ({ count }) => {
  return (
<div className="filtered-count">
<h3>Number of People: {count}</h3>
</div>
  );
};
 
const SkillTable = ({ skills }) => {
  return (
<div className="skill-table">
<h2>Skill Ratings</h2>
<table>
<thead>
<tr>
<th>Skill</th>
<th>Rating</th>
</tr>
</thead>
<tbody>
          {Object.entries(skills).map(([skill, rating]) => (
<tr key={skill}>
<td>{skill}</td>
<td>{rating}</td>
</tr>
          ))}
</tbody>
</table>
</div>
  );
};
 
function ReplacementFinder() {
  const [nearestMatches, setNearestMatches] = useState([]); // To hold the nearest matches data
  const [filteredMatches, setFilteredMatches] = useState([]); // To hold the filtered matches data
  const [selectedName, setSelectedName] = useState([]); // Selected name for filtering
  const [selectedAccount, setSelectedAccount] = useState([]); // Selected account for filtering
  const [selectedDesignation, setSelectedDesignation] = useState([]); // Selected designation for filtering
  const [selectedSkills, setSelectedSkills] = useState([]); // Selected skills for filtering
  const [skillAvgRatings, setSkillAvgRatings] = useState({}); // Skill average ratings
  const [filteredSkills, setFilteredSkills] = useState({}); // Skills of the selected employee
 
  const [dropdownOptions, setDropdownOptions] = useState({
    names: [],
    accounts: [],
    designations: [],
    skills: [],
  });
 
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
 
  // Function to fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/mach/replacement_finder/?");
      const { skill_avg_ratings, nearest_matches } = response.data;
 
      setNearestMatches(nearest_matches);
 
      // Initialize dropdown options based on skill_avg_ratings keys
      const designations = Array.from(new Set(nearest_matches.map(item => item.designation))).sort();
      const names = Array.from(new Set(nearest_matches.map(item => item.name))).sort();
      const accounts = Array.from(new Set(nearest_matches.map(item => item.account))).sort();
      const skills = Object.keys(skill_avg_ratings).sort();
 
      setDropdownOptions({ designations, names, accounts, skills });
      setFilteredMatches(nearest_matches);
      setSkillAvgRatings(skill_avg_ratings); // Store skill average ratings
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  const applyFilters = () => {
    let filteredResult = [...nearestMatches]; // Start with all nearest matches
    // Apply name filter
    if (selectedName.length > 0) {
      filteredResult = filteredResult.filter(item => selectedName.includes(item.name));
    }
 
    // Apply account filter
    if (selectedAccount.length > 0) {
      filteredResult = filteredResult.filter(item => selectedAccount.includes(item.account));
    }
 
    // Apply designation filter
    if (selectedDesignation.length > 0) {
      filteredResult = filteredResult.filter(item => selectedDesignation.includes(item.designation));
    }
 
    // Apply skill filter
    if (selectedSkills.length > 0) {
      filteredResult = filteredResult.filter(item =>
        selectedSkills.every(skill =>
          item.skills.some(skillObj => Object.keys(skillObj)[0] === skill)
        )
      );
    }
 
    filteredResult.sort((a, b) => b.average_rating - a.average_rating); // Sort by average rating in descending order
 
    setFilteredMatches(filteredResult); // Update filtered matches state
  };
 
  const handleDropdownChange = (selectedOptions, action) => {
    const { name } = action;
    const selectedValues = selectedOptions.map(option => option.value);
    switch (name) {
      case 'names':
        setSelectedName(selectedValues);
        if (selectedValues.length === 1) {
          const selectedEmployee = nearestMatches.find(employee => employee.name === selectedValues[0]);
          setFilteredSkills(selectedEmployee ? selectedEmployee.skills[0] : {});
        } else {
          setFilteredSkills({});
        }
        break;
      case 'accounts':
        setSelectedAccount(selectedValues);
        break;
      case 'designations':
        setSelectedDesignation(selectedValues);
        break;
      case 'skills':
        setSelectedSkills(selectedValues);
        break;
      default:
        break;
    }
  };
 
  useEffect(() => {
    applyFilters();
  }, [selectedName, selectedAccount, selectedDesignation, selectedSkills]);
 
  return (
<div className="replacement-finder">
      {/* Dropdowns for filters */}
<div className="filters">
<Select
          isMulti
          name="names"
          placeholder="Select Names"
          options={dropdownOptions.names.map(name => ({ value: name, label: name }))}
          value={selectedName.map(name => ({ value: name, label: name }))}
          onChange={handleDropdownChange}
        />
<Select
          isMulti
          name="accounts"
          placeholder="Select Accounts"
          options={dropdownOptions.accounts.map(account => ({ value: account, label: account }))}
          value={selectedAccount.map(account => ({ value: account, label: account }))}
          onChange={handleDropdownChange}
        />
<Select
          isMulti
          name="designations"
          placeholder="Select Designations"
          options={dropdownOptions.designations.map(designation => ({ value: designation, label: designation }))}
          value={selectedDesignation.map(designation => ({ value: designation, label: designation }))}
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
</div>
 
      {/* Display filtered count */}
<FilteredCount count={filteredMatches.length} />
 
      {/* Display filtered results in a table */}
<div className="results-table">
<table>
<thead>
<tr>
<th>Name</th>
<th>Designation</th>
<th>Account</th>
<th>Matching skills</th>
<th>Average Rating</th>
</tr>
</thead>
<tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map(item => (
<tr key={item.user_id}>
<td>{item.name}</td>
<td>{item.designation}</td>
<td>{item.account}</td>
<td>{item.matching_skills}</td>
<td>{item.average_rating}</td>
</tr>
              ))
            ) : (
<tr>
<td colSpan="5">No matching data found.</td>
</tr>
            )}
</tbody>
</table>
</div>
 
      {/* Display skills table */}
<SkillTable skills={Object.keys(filteredSkills).length > 0 ? filteredSkills : skillAvgRatings} />
</div>
  );
}
 
export default ReplacementFinder;