import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import {
  fetchReplacementData,
  setSelectedName,
  setSelectedAccount,
  setSelectedDesignation,
  setSelectedSkills,
  setFilteredSkills,
  setRatingFilter,
  clearAllFilters,
} from '../redux/replacementslice';
import loadingGif from '../assets/loading.gif';
import '../styles/replacement.css';

const FilteredCount = ({ count }) => (
  <div>
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
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>Total rating: {overallrating}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

function ReplacementFinder() {
  const dispatch = useDispatch();
  const {
    nearestMatches,
    overallrating,
    filteredMatches,
    selectedName,
    selectedAccount,
    selectedDesignation,
    selectedSkills,
    skillAvgRatings,
    filteredSkills,
    dropdownOptions,
    ratingFilter,
    status,
    error,
  } = useSelector((state) => state.replacement);

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const sortedFilteredMatches = useMemo(() => {
    if (!sortBy) return filteredMatches;

    return [...filteredMatches].sort((a, b) => {
      switch (sortBy) {
        case 'matching_skills':
          return sortDirection === 'asc' ? a.matching_skills - b.matching_skills : b.matching_skills - a.matching_skills;
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

  const handleDropdownChange = (selectedOptions, action) => {
    const { name } = action;
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];

    switch (name) {
      case 'names':
        dispatch(setSelectedName(selectedValues));
        break;
      case 'accounts':
        dispatch(setSelectedAccount(selectedValues));
        break;
      case 'designations':
        dispatch(setSelectedDesignation(selectedValues));
        break;
      case 'skills':
        dispatch(setSelectedSkills(selectedValues));
        break;
      default:
        break;
    }
  };

  const handleRatingFilterChange = (rating) => {
    dispatch(setRatingFilter(rating));
  };

  const handleResetFilters = () => {
    dispatch(clearAllFilters());
  };

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const params = {};
    if (selectedName.length > 0) params.name = selectedName.join(',');
    if (selectedAccount.length > 0) params.account = selectedAccount.join(',');
    if (selectedDesignation.length > 0) params.designation = selectedDesignation.join(',');
    if (selectedSkills.length > 0) params.skill_name = selectedSkills.join(',');
    if (ratingFilter > 0) params.rating = ratingFilter;
 
    dispatch(fetchReplacementData(params));
  }, [selectedName, selectedAccount, selectedDesignation, selectedSkills, ratingFilter, dispatch]);

  const handleSort = (columnName) => {
    if (columnName === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('desc'); // Default to descending order on first click
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFilteredMatches.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <div className="replacement-finder">
      <h2>REPLACEMENT FINDER</h2>
      <div className="filters-container">
      {/* <div className="filters-container">
        {['names', 'accounts', 'designations', 'skills'].map((filterName) => (
          <Select
            key={filterName}
            isMulti
            name={filterName}
            placeholder={`Select ${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`}
            options={dropdownOptions[filterName].map((option) => ({ value: option, label: option }))}
            value={eval(`selected${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`).map((item) => ({ value: item, label: item }))}
            onChange={handleDropdownChange}
          /> */}
        <Select
          isMulti
          name="names"
          placeholder="Select Names"
          options={dropdownOptions.names.map((option) => ({ value: option, label: option }))}
          value={selectedName.map((name) => ({ value: name, label: name }))}
          onChange={handleDropdownChange}
        />
        <Select
          isMulti
          name="accounts"
          placeholder="Select Accounts"
          options={dropdownOptions.accounts.map((option) => ({ value: option, label: option }))}
          value={selectedAccount.map((account) => ({ value: account, label: account }))}
          onChange={handleDropdownChange}
        />
        <Select
          isMulti
          name="designations"
          placeholder="Select Designations"
          options={dropdownOptions.designations.map((option) => ({ value: option, label: option }))}
          value={selectedDesignation.map((designation) => ({ value: designation, label: designation }))}
          onChange={handleDropdownChange}
        />
        <Select
          isMulti
          name="skills"
          placeholder="Select Skills"
          options={dropdownOptions.skills.map((option) => ({ value: option, label: option }))}
          value={selectedSkills.map((skill) => ({ value: skill, label: skill }))}
          onChange={handleDropdownChange}
        />
        <div className="buttons">
          <button onClick={() => handleRatingFilterChange(5)}>Master</button>
          <button onClick={() => handleRatingFilterChange(4)}>Expert</button>
          <button onClick={() => handleRatingFilterChange(3)}>Advanced</button>
          <button onClick={() => handleRatingFilterChange(2)}>Intermediate</button>
          <button onClick={() => handleRatingFilterChange(1)}>Beginner</button>
          <button onClick={handleResetFilters} className="clear-button">Reset</button>
          
        </div>
      </div>

      <FilteredCount count={sortedFilteredMatches.length} />

      <div className="high">
        <div className="tables">
          <div className="employee-table scrollable">
            <h2>Potential Replacements</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Account</th>
                  <th onClick={() => handleSort('matching_skills')}>Matching skills</th>
                  <th onClick={() => handleSort('average_rating')}>Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredMatches.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.user_id}>
                      <td>{item.name}</td>
                      <td>{item.designation}</td>
                      <td>{item.account}</td>
                      <td>{item.matching_skills}</td>
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
            {sortedFilteredMatches.length > itemsPerPage && (
              <div className="pagination">
                <button
                  onClick={() => handlePaginationChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                
                <button
                  onClick={() =>
                    handlePaginationChange(
                      currentPage < Math.ceil(sortedFilteredMatches.length / itemsPerPage)
                        ? currentPage + 1
                        : currentPage
                    )
                  }
                  disabled={currentPage === Math.ceil(sortedFilteredMatches.length / itemsPerPage)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <SkillTable skills={Object.keys(filteredSkills).length > 0 ? filteredSkills : skillAvgRatings} overallrating={overallrating} />
        </div>
      </div>
    </div>
  );
}

export default ReplacementFinder;
