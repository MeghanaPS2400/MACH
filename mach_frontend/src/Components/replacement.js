import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
 
import '../styles/sidebar.css';
import FilterSidebar from '../others/sidebar';
import {fetchReplacementData} from '../redux/replacementslice';
import loadingGif from '../assets/loading.gif';
import '../styles/replacement.css';
 
const FilteredCount = ({ count }) => (
  <div className='filtered-count'>
    <h3>Number of People: {count}</h3>
  </div>
);
 
const SkillTable = ({ skills, overallrating }) => (
  <div className="skill-table scrollable">
    <h2>Employee Skills</h2>
    <table>
      <thead>
        <tr>
          <th>Skill</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(skills)
          .filter(([skill, rating]) => rating > 0)
          .map(([skill, rating]) => (
            <tr key={skill}>
              <td>{skill}</td>
              <td>{rating.toFixed(2)}</td>
            </tr>
          ))}
       
      </tbody>
    </table>
    <div className="fixed-total"> 
         <h3>Total rating: {overallrating}</h3>
    </div>
  </div>
);
 
function ReplacementFinder() {
  const dispatch = useDispatch();
  const {
    
    overallrating,
    filteredMatches,
    skillAvgRatings,
    ratingFilter,
    status,
    error,
  } = useSelector((state) => state.replacement);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [],
    skills: [],
    account:[],
    rating:[]
    
  
  });
 
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
 
 
  const sortedFilteredMatches = useMemo(() => {
    if (!sortBy) return filteredMatches;
 
    return [...filteredMatches].sort((a, b) => {
      switch (sortBy) {
        case 'skills_count':
          return sortDirection === 'asc' ? a.skills_count - b.skills_count : b.skills_count - a.skills_count;
        case 'average_rating':
          return sortDirection === 'asc' ? a.average_rating - b.average_rating : b.average_rating - a.average_rating;
        default:
          return 0;
      }
    });
  }, [filteredMatches, sortBy, sortDirection]);
 
  useEffect(() => {
    dispatch(fetchReplacementData());
  }, [dispatch]);
 
  const handleApplyFilters = (selectedFilters) => {
    const queryParams = Object.keys(selectedFilters)
      .filter(key => selectedFilters[key].length > 0)
      .map(key => {
        return selectedFilters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&');
      })
      .join('&');
 
    dispatch(fetchReplacementData(`?${queryParams}`));
    setSidebarVisible(false);
  };
 
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
 
 
 
  const handleSort = (columnName) => {
    if (columnName === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('desc'); // Default to descending order on first click
    }
  };
 
 
 
  if (status === 'loading') {
    return (
      <div className="loading">
        <img src={loadingGif} style={{ width: '80px', height: '80px' }} alt="Loading" />
      </div>
    );
  }
 
  if (status === 'failed') {
    return <p>{error}</p>;
  }
  const filters = [
    {
      name: 'name',
      label: 'Name',
      options: [...new Set(filteredMatches.map(user => user.name))].map(name => ({ value: name, label: name }))
    },
    {
      name: 'designation',
      label: 'Designation',
      options: [...new Set(filteredMatches.map(user => user.designation))].map(designation => ({ value: designation, label: designation }))
    },
   
    {
      name: 'account',
      label: 'Account',
      options: [...new Set(filteredMatches.map(user => user.account))].map(account => ({ value: account, label: account }))
    },
   
    {
      name: 'skills',
      label: 'Skills',
      options: Object.keys(skillAvgRatings).map(skill => ({
        value: skill,
        label: skill // Use skill as both value and label
      }))
    },
    {
      name: 'rating',
      label: 'Rating',
      options: [
        { value: '5', label: 'Master' },
        { value: '4', label: 'Expert' },
        { value: '3', label: 'Advance'},
        { value: '2', label: 'Intermediate'},
        { value: '1', label: 'Beginer'},
      ]
    }
    
    // Add other filters as needed
  ];
 
  return (
    <div className="replacement-finder">
      <h2>REPLACEMENT FINDER</h2>
      <button className="filter-toggle" onMouseOver={toggleSidebar}>
        {isSidebarVisible ? <span>&lt;</span> : <span>&gt;</span>}
      </button>
      <FilterSidebar
        isVisible={isSidebarVisible}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        toggleSidebar={toggleSidebar}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
      />
 
      <FilteredCount count={sortedFilteredMatches.length} />
 
      <div className="high">
        <div className="tables">
         <SkillTable skills={skillAvgRatings} overallrating={overallrating} />
          <div className="employee-table scrollable">
            <h2>Potential Replacements</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Account</th>
                  <th onClick={() => handleSort('skills_count')}>Matching skills</th>
                  <th onClick={() => handleSort('average_rating')}>Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredMatches.length > 0 ? (
                  sortedFilteredMatches.map((item) => (
                    <tr key={item.user_id}>
                      <td>{item.name}</td>
                      <td>{item.designation}</td>
                      <td>{item.account}</td>
                      <td>{item.skills_count}</td>
                      <td>{item.average_rating.toFixed(3)}</td>
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
          
        </div>
      </div>
    </div>
  );
}
 
export default ReplacementFinder;