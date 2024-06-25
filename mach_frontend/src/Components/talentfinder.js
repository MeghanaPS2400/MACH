import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css'; 
import '../styles/TalentFinder.css';

const TalentFinder = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [],
    lead: [],
    skills: [],
    account:[],
    manager_name:[]
    // Add other filters as needed
  });
  
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleApplyFilters = (selectedFilters) => {
    const queryParams = Object.keys(selectedFilters)
      .filter(key => selectedFilters[key].length > 0)
      .map(key => {
        return selectedFilters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&');
      })
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
      options: [...new Set(users.map(user => user.name))].map(name => ({ value: name, label: name }))
    },
    {
      name: 'designation',
      label: 'Designation',
      options: [...new Set(users.map(user => user.designation))].map(designation => ({ value: designation, label: designation }))
    },
    {
      name: 'lead', 
      label: 'Lead',
      options: [...new Set(users.map(user => user.lead))].map(lead => ({ value: lead, label: lead }))
    },
    {
      name: 'account', 
      label: 'Account',
      options: [...new Set(users.map(user => user.account))].map(account => ({ value: account, label: account }))
    },
    {
      name: 'manager_name', 
      label: 'Manager',
      options: [...new Set(users.map(user => user.manager_name))].map(manager_name => ({ value: manager_name, label: manager_name }))
    },
    {
      name: 'skills',
      label: 'Skills',
      options: [...new Set(users.flatMap(user => Object.keys(user.skills)))].map(skill => ({ value: skill, label: skill }))
    }
    // Add other filters as needed
  ];

  return (
    <div className="talent-finder">
      <h1>Talent Finder</h1>
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

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Lead</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.designation}</td>
              <td>{user.lead}</td>
              <td>
                {Object.entries(user.skills).map(([skill, rating]) => (
                  <div key={skill}>{`${skill} (${rating})`}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TalentFinder;
