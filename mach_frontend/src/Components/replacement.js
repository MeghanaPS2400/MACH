import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import '../styles/replacement.css';
import {
  fetchReplacementData,
  setSelectedName,
  setSelectedAccount,
  setSelectedDesignation,
  setSelectedSkills,
  setRatingFilter,
  setFilteredSkills,
  setFilteredMatches,
  clearAllFilters
} from '../redux/replacementslice.js';
import loadingGif from '../assets/loading-white.gif'; // Import your loading gif

const SkillTable = ({ skills }) => {
  return (
    <div className="skill-table">
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
            .filter(([skill, rating]) => rating > 0) // Exclude skills with rating 0
            .map(([skill, rating]) => (
              <tr key={skill}>
                <td>{skill}</td>
                <td>{rating.toFixed(3)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const FilteredCount = ({ count }) => {
  return (
    <div>
      <h3>Number of People: {count}</h3>
    </div>
  );
};

function ReplacementFinder() {
  const dispatch = useDispatch();
  const {
    nearestMatches,
    filteredMatches,
    selectedName,
    selectedAccount,
    selectedDesignation,
    selectedSkills,
    skillAvgRatings,
    filteredSkills,
    ratingFilter,
    dropdownOptions,
    status,
    error,
  } = useSelector(state => state.replacement);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReplacementData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(setFilteredMatches(applyFilters()));
  }, [selectedName, selectedAccount, selectedDesignation, selectedSkills, ratingFilter, nearestMatches]);

  const getMatchingSkills = (skills1, skills2) => {
    let matchingSkillsCount = 0;
    for (let skill in skills1) {
      if (skills2[skill] !== undefined) {
        matchingSkillsCount++;
      }
    }
    return matchingSkillsCount;
  };

  const applyFilters = () => {
    let filteredResult = [...nearestMatches];

    if (selectedName.length > 0) {
      const selectedEmployee = nearestMatches.find(item => item.name === selectedName[0]);
      if (selectedEmployee) {
        filteredResult = filteredResult
          .filter(item => item.name !== selectedEmployee.name)
          .map(item => ({
            ...item,
            matching_skills: getMatchingSkills(selectedEmployee.skills[0], item.skills[0])
          }));
      }
    }

    if (selectedAccount.length > 0) {
      filteredResult = filteredResult.filter(item => selectedAccount.includes(item.account));
      const filteredEmployee = filteredResult.find(employee => employee.account === selectedAccount[0]);
      dispatch(setFilteredSkills(filteredEmployee ? filteredEmployee.skills[0] : {}));
    }

    if (selectedDesignation.length > 0) {
      filteredResult = filteredResult.filter(item => selectedDesignation.includes(item.designation));
    }

    if (selectedSkills.length > 0) {
      filteredResult = filteredResult.filter(item =>
        selectedSkills.every(skill =>
          item.skills.some(skillObj => Object.keys(skillObj)[0] === skill)
        )
      );
    }

    if (ratingFilter > 0) {
      filteredResult = filteredResult.filter(item =>
        item.skills.some(skillObj => {
          const skill = Object.keys(skillObj)[0];
          const rating = skillObj[skill];
          return rating === ratingFilter;
        })
      );
    }

    return filteredResult.sort((a, b) => b.matching_skills- a.matching_skills);
  };

  const handleDropdownChange = (selectedOptions, action) => {
    const { name } = action;
    const selectedValues = selectedOptions.map(option => option.value);

    switch (name) {
      case 'names':
        dispatch(setSelectedName(selectedValues));
        const selectedEmployee = nearestMatches.find(employee => employee.name === selectedValues[0]);
        dispatch(setFilteredSkills(selectedEmployee ? selectedEmployee.skills[0] : {}));
        break;
      case 'accounts':
        dispatch(setSelectedAccount(selectedValues));
        const filteredEmployee = nearestMatches.find(employee => employee.account === selectedValues[0]);
        dispatch(setFilteredSkills(filteredEmployee ? filteredEmployee.skills[0] : {}));
        break;
      case 'designations':
        dispatch(setSelectedDesignation(selectedValues));
        const newEmployee = nearestMatches.find(employee => employee.account === selectedValues[0]);
        dispatch(setFilteredSkills(newEmployee ? newEmployee.skills[0] : {}));
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

  if (status === 'loading') {
    return (
      <div className="loading">
        <img src={loadingGif} alt="Loading" />
      </div>
    );
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }
  //

  return (
    <div className="replacement-finder">
      <h2>REPLACEMENT FINDER</h2>
      <div className="filters-container">
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

        <div className="buttons">
          <button onClick={() => handleRatingFilterChange(5)}>Master</button>
          <button onClick={() => handleRatingFilterChange(4)}>Expert</button>
          <button onClick={() => handleRatingFilterChange(3)}>Advanced</button>
          <button onClick={() => handleRatingFilterChange(2)}>Intermediate</button>
          <button onClick={() => handleRatingFilterChange(1)}>Beginner</button>
          <button onClick={handleResetFilters} className="clear-button">Reset</button>
        </div>
      </div>

      <FilteredCount count={filteredMatches.length} />
      <div className='high'>
        <div className="tables">
          <div className="employee-table">
            <h2>Potential Replacements</h2>
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
          <SkillTable skills={Object.keys(filteredSkills).length > 0 ? filteredSkills : skillAvgRatings} />
        </div>
      </div>
    </div>
  );
}

export default ReplacementFinder;
