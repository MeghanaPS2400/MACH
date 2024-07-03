import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/employeeSlice';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/SME.css';
import Navbar from '../others/Navbar';

const EmployeeSkill = () => {
  const dispatch = useDispatch();
  const skillData = useSelector((state) => state.skillData); // Assuming skill data is stored in state.skillData

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    rating:[],
    // Default minimum rating
  });

  useEffect(() => {
    // Fetch initial data on component mount
    dispatch(fetchData('')); // Adjust the query parameters as needed
  }, [dispatch]);

  useEffect(() => {
    // Apply filters whenever selectedFilters change
    handleApplyFilters(selectedFilters);
  }, [selectedFilters]);

  const handleApplyFilters = (filters) => {
    // Construct query parameters based on selected filters
    const queryParams = Object.keys(filters)
      .filter(key => key === 'skills' || key === 'minRating')
      .map(key => {
        if (key === 'skills' && filters[key].length > 0) {
          return `skills=${encodeURIComponent(filters[key].join(','))}`;
        }
        if (key === 'minRating') {
          return `minRating=${encodeURIComponent(filters[key])}`;
        }
        return '';
      })
      .join('&');
    
    // Dispatch action to fetch data with query parameters
    dispatch(fetchData(`?${queryParams}`));
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  if (!skillData) {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }

  const { skillAvgRatings, status, error } = skillData;

  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
  }

  const uniqueSkillCount = skillAvgRatings.length;

  const FilteredCount = ({ count }) => (
    <div className="count-box">
      <h3>Number of Skills:</h3>
      <p>{count}</p>
    </div>
  );

  const handleSkillFilter = (selectedSkill) => {
    const updatedFilters = {
      ...selectedFilters,
      skills: [selectedSkill]
    };
    setSelectedFilters(updatedFilters);
  };

  return (
    <div className="EmployeeSkill-finder">
      <Navbar/>
      <h4 className="page-title">Employee Skill Finder</h4>
      <button className="filter-toggle" onClick={toggleSidebar}>
        {isSidebarVisible ? <span>&lt;</span> : <span>&gt;</span>}
      </button>
      <FilterSidebar
        isVisible={isSidebarVisible}
        // Pass filters and handleApplyFilters function to the sidebar
        // Ensure FilterSidebar component is appropriately implemented
        onApplyFilters={handleApplyFilters}
        toggleSidebar={toggleSidebar}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
      />

      <FilteredCount count={uniqueSkillCount} />
      <table className="skill-table">
        <thead>
          <tr>
            <th className="table-header">Skill Name</th>
            <th className="table-header">Average Rating</th>
            <th className="table-header">Employee Count</th>
          </tr>
        </thead>
        <tbody>
          {skillAvgRatings.map(({ skill_name, average_rating, employee_count }) => (
            <tr key={skill_name} className="table-row">
              <td className="table-data skill" onClick={() => handleSkillFilter(skill_name)}>{skill_name}</td>
              <td className="table-data">{average_rating.toFixed(2)}</td>
              <td className="table-data">{employee_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSkill;
