import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsers } from '../redux/smeSlice';
 
import loadingGif from '../assets/loading.gif';
import '../styles/SME.css';
 
const LoadingSpinner = () => (
  <div className="smeloading">
    <img src={loadingGif} alt="Loading" />
  </div>
);
 
const FilteredCount = ({ count }) => (
  <div className="count-box">
    <h3>Number of Employees:</h3>
    <p>{count}</p>
  </div>
);
 
const SME = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
 
  const [selectedFilters, setSelectedFilters] = useState({
    designations: [],
    names: [],
    accounts: [],
    lead: [],
    manager_name: [],
    skills: [],
    validatedFilter: 'all',
    ratingFilter: 0,
    selectedSkills: []
  });
 
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
 
  const [dropdownOptions, setDropdownOptions] = useState({
    designations: [],
    names: [],
    accounts: [],
    lead: [],
    manager_name: [],
    skills: []
  });
 
  useEffect(() => {
 
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
 
    if (users.length > 0) {
      const designations = [...new Set(users.map(user => user.designation))].map(designation => ({ value: designation, label: designation })).sort((a, b) => a.label.localeCompare(b.label));
      const names = [...new Set(users.map(user => user.name))].map(name => ({ value: name, label: name })).sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }))
      const accounts = [...new Set(users.map(user => user.account))].map(account => ({ value: account, label: account })).sort((a, b) => a.label.localeCompare(b.label));
      const lead = [...new Set(users.map(user => user.lead))].map(lead => ({ value: lead, label: lead })).sort((a, b) => a.label.localeCompare(b.label));
      const manager_name = [...new Set(users.map(user => user.manager_name))].map(manager => ({ value: manager, label: manager })).sort((a, b) => a.label.localeCompare(b.label));
      const skills = [...new Set(users.flatMap(user => Object.keys(user.skills.reduce((acc, obj) => ({ ...acc, ...obj }), {}))))].map(skill => ({ value: skill, label: skill })).sort((a, b) => a.label.localeCompare(b.label));
 
      setDropdownOptions({ designations, names, accounts, lead, manager_name, skills });
    }
 
 
    filterData();
  }, [status, users, dispatch, selectedFilters]);
 
  const filterData = () => {
    let updatedFilteredData = [...users];
 
    const { designations, names, accounts, lead, manager_name, validatedFilter, ratingFilter, selectedSkills } = selectedFilters;
 
    if (designations.length > 0) {
      updatedFilteredData = updatedFilteredData.filter(user => designations.some(des => des.value === user.designation));
    }
 
    if (names.length > 0) {
      updatedFilteredData = updatedFilteredData.filter(user => names.some(name => name.value === user.name));
    }
 
    if (accounts.length > 0) {
      updatedFilteredData = updatedFilteredData.filter(user => accounts.some(ac => ac.value === user.account));
    }
 
    if (lead.length > 0) {
      updatedFilteredData = updatedFilteredData.filter(user => lead.some(lead => lead.value === user.lead));
    }
 
    if (manager_name.length > 0) {
      updatedFilteredData = updatedFilteredData.filter(user => manager_name.some(manager => manager.value === user.manager_name));
    }
 
    if (validatedFilter === 'validated') {
      updatedFilteredData = updatedFilteredData.filter(user => user.validated === 'yes');
    } else if (validatedFilter === 'not_validated') {
      updatedFilteredData = updatedFilteredData.filter(user => user.validated === 'no');
    }
 
    updatedFilteredData.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
 
 
    const transformedUsers = updatedFilteredData.flatMap(user =>
      user.skills.flatMap(skillObj =>
        Object.entries(skillObj).map(([skill, rating]) => ({
          ...user,
          skill,
          rating
        }))
      )
    );
 
 
    let filteredUsers = transformedUsers;
    if (ratingFilter > 0) {
      filteredUsers = filteredUsers.filter(item => item.rating === ratingFilter);
    }
    if (selectedSkills.length > 0) {
      filteredUsers = filteredUsers.filter(item => selectedSkills.some(skill => skill.value === item.skill));
    }
 
    setFilteredData(filteredUsers);
    setCurrentPage(1);
  };
 
  const handleDropdownChange = (selectedOptions, action) => {
    const { name } = action;
    const selectedValues = selectedOptions.map(option => ({ value: option.value, label: option.label }));
 
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [name]: selectedValues
    }));
  };
 
  const handleValidatedFilterChange = filter => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      validatedFilter: filter
    }));
  };
 
  const handleRatingFilterChange = rating => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      ratingFilter: rating
    }));
  };
 
  const handleResetFilters = () => {
    setSelectedFilters({
      designations: [],
      names: [],
      accounts: [],
      lead: [],
      manager_name: [],
      skills: [],
      validatedFilter: 'all',
      ratingFilter: 0,
      selectedSkills: []
    });
  };
 
  const handleSkillChange = selectedOptions => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      selectedSkills: selectedOptions || []
    }));
  };
 
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
 
  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
 
  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };
  const uniqueEmployeeCount = [...new Set(filteredData.map(item => item.name))].length;
 
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
 
  if (status === 'failed') {
    return <p>{error}</p>;
  }
 
  return (
    <div className="container">
      <h2 className="title">SUBJECT MATTER EXPERT</h2>
      <div className="filters">
        <div className="dropdown">
          <label className="filter-label">Designations</label>
          <Select
            className="select"
            isMulti
            name="designations"
            placeholder="Select Designations"
            options={dropdownOptions.designations}
            value={selectedFilters.designations}
            onChange={handleDropdownChange}
          />
        </div>
 
        <div className="dropdown">
          <label className="filter-label">Names</label>
          <Select
            className="select"
            isMulti
            name="names"
            placeholder="Select Names"
            options={dropdownOptions.names}
            value={selectedFilters.names}
            onChange={handleDropdownChange}
          />
        </div>
 
        <div className="dropdown">
          <label className="filter-label">Accounts</label>
          <Select
            className="select"
            isMulti
            name="accounts"
            placeholder="Select Accounts"
            options={dropdownOptions.accounts}
            value={selectedFilters.accounts}
            onChange={handleDropdownChange}
          />
        </div>
 
        <div className="dropdown">
          <label className="filter-label">Lead</label>
          <Select
            className="select"
            isMulti
            name="lead"
            placeholder="Select Lead"
            options={dropdownOptions.lead}
            value={selectedFilters.lead}
            onChange={handleDropdownChange}
          />
        </div>
 
        <div className="dropdown">
          <label className="filter-label">Manager</label>
          <Select
            className="select"
            isMulti
            name="manager_name"
            placeholder="Select Manager"
            options={dropdownOptions.manager_name}
            value={selectedFilters.manager_name}
            onChange={handleDropdownChange}
          />
        </div>
 
        <div className="dropdown">
          <label className="filter-label">Skills</label>
          <Select
            className="select"
            isMulti
            name="skills"
            placeholder="Select Skills"
            options={dropdownOptions.skills.map(skill => ({
              value: skill.value,
              label: skill.label,
              clearIndicator: true
            }))}
            value={selectedFilters.selectedSkills}
            onChange={handleSkillChange}
          />
        </div>
      </div>
 
      <div className="filter-buttons">
        <button className="filter-button" onClick={() => handleRatingFilterChange(5)}>Master</button>
        <button className="filter-button" onClick={() => handleRatingFilterChange(4)}>Expert</button>
        <button className="filter-button" onClick={() => handleRatingFilterChange(3)}>Advanced</button>
        <button className="filter-button" onClick={() => handleRatingFilterChange(2)}>Intermediate</button>
        <button className="filter-button" onClick={() => handleRatingFilterChange(1)}>Beginner</button>
        <button className="filter-button" onClick={handleResetFilters}>Reset</button>
      </div>
 
      <div className="filter-buttons-rating">
        <button className="filter-button" onClick={() => handleValidatedFilterChange('validated')}>Validated</button>
        <button className="filter-button" onClick={() => handleValidatedFilterChange('not_validated')}>Non Validated</button>
      </div>
 
 
      <FilteredCount count={uniqueEmployeeCount} />
 
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Account</th>
            <th>Lead</th>
            <th>Manager</th>
            <th>Skill</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="7">No Data Found</td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name || 'null'}</td>
                <td>{item.designation || 'null'}</td>
                <td>{item.account || 'null'}</td>
                <td>{item.lead || 'null'}</td>
                <td>{item.manager_name || 'null'}</td>
                <td>{item.skill || 'null'}</td>
                <td>{item.rating || 'null'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
 
      <div className="pagination">
        <button className="page-button" onClick={handlePrevPage} disabled={currentPage === 1}> Previous </button>
        <button
          className="page-button" onClick={handleNextPage} disabled={currentPage === totalPages} > Next</button>
      </div>
    </div>
  );
};
 
export default SME;