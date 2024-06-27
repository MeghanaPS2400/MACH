import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/SME.css';
import "../styles/table.css";
import Navbar from '../others/Navbar';

 
const Sme = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [],
    lead: [],
    skills: [],
    account: [],
    manager_name: [],
    validated: [], // For validated status filter
    rating: ['4', '5'] // For rating filter, default to 4 and 5
  });
 
  useEffect(() => {
    handleApplyFilters(selectedFilters);
  }, [dispatch]);
 
  const handleApplyFilters = (filters) => {
    const queryParams = Object.keys(filters)
      .filter(key => filters[key].length > 0)
      .map(key => filters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&'))
      .join('&');
 
    dispatch(fetchData(`?${queryParams}`));
    setSidebarVisible(false);
  };
 
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
 
  if (status === 'loading') {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }
 
  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
  }
 
  const filters = [
    {
      name: 'name',
      label: 'Name',
      options: [...new Set(users.map(({ name }) => name))].map(name => ({ value: name, label: name }))
    },
    {
      name: 'designation',
      label: 'Designation',
      options: [...new Set(users.map(({ designation }) => designation))].map(designation => ({ value: designation, label: designation }))
    },
    {
      name: 'lead',
      label: 'Lead',
      options: [...new Set(users.map(({ lead }) => lead))].map(lead => ({ value: lead, label: lead }))
    },
    {
      name: 'account',
      label: 'Account',
      options: [...new Set(users.map(({ account }) => account))].map(account => ({ value: account, label: account }))
    },
    {
      name: 'manager_name',
      label: 'Manager',
      options: [...new Set(users.map(({ manager_name }) => manager_name))].map(manager_name => ({ value: manager_name, label: manager_name }))
    },
    {
      name: 'skills',
      label: 'Skills',
      options: [...new Set(users.flatMap(({ skills }) => Object.keys(skills)))].map(skill => ({ value: skill, label: skill }))
    },
    {
      name: 'validated',
      label: 'Validated',
      options: [
        { value: 'yes', label: 'Validated' },
        { value: 'no', label: 'Not Validated' }
      ]
    },
    {
      name: 'rating',
      label: 'Rating',
      options: [
        { value: '5', label: 'Master' },
        { value: '4', label: 'Expert' }
      ]
    }
  ];
 
  const userSkills = users.flatMap(({ id, name, designation, lead, account, skills }) =>
    Object.entries(skills)
      .filter(([skill, rating]) => {
        return (rating >= 4 && rating <= 5)
          && (selectedFilters.skills.length === 0 || selectedFilters.skills.includes(skill))
          && (selectedFilters.rating.length === 0 || selectedFilters.rating.includes(rating.toString()));
      })
      .map(([skill, rating]) => ({
        id,
        name,
        designation,
        lead,
        account,
        skill,
        rating
      }))
  );
 
  const uniqueEmployeeCount = [...new Set(userSkills.map(item => item.name))].length;
 
  const FilteredCount = ({ count }) => (
    <div className="filteredCount">
      <h3>Number of Employees: {count}</h3>
    </div>
  );
 
  const handleSkillFilter = (selectedSkill) => {
    const updatedFilters = {
      ...selectedFilters,
      skills: [selectedSkill]
    };
    setSelectedFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };
 
  const value = (rating) => {
    return rating === 4 ? "Expert" : "Master";
  }
 
  return (
    <div className="sme-finder">
      <Navbar/>
      <h4 className="screen-title">Subject Matter Expert</h4>
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
 
      <FilteredCount count={uniqueEmployeeCount} />
      <div className='table-div'>
      <table className="user-table">
        <thead className="table-header">
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Lead</th>
            <th>Account</th>
            <th>Skill</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {userSkills.map(({ id, name, designation, lead, account, skill, rating }) => (
            <tr key={`${id}-${skill}`} className="table-rows-data">
              <td >{name}</td>
              <td >{designation}</td>
              <td >{lead}</td>
              <td >{account}</td>
              <td  onClick={() => handleSkillFilter(skill)}>{skill}</td>
              <td >{value(rating)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
 
export default Sme;
 