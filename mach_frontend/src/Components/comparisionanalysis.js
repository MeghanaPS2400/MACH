import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsers } from '../redux/talentReducer';
import loading from "../assets/loading.gif";

const ComparisionAnalysis = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [selectedDeliveryLeads, setSelectedDeliveryLeads] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  const getQueryParams = () => {
    return {
      deliveryLeads: selectedDeliveryLeads.map(dl => dl.value).join(','),
      accounts: selectedAccounts.map(ac => ac.value).join(','),
      managers: selectedManagers.map(mgr => mgr.value).join(','),
      skills: selectedSkills.map(skill => skill.value).join(','),
      designations: selectedDesignations.map(des => des.value).join(','),
      sort: sortOption ? sortOption.value : ''
    };
  };

  useEffect(() => {
    const queryParams = getQueryParams();
    dispatch(fetchUsers(queryParams));
  }, [selectedDeliveryLeads, selectedAccounts, selectedManagers, selectedSkills, selectedDesignations, sortOption, dispatch]);

  if (status === 'loading') {
   return <div class="loading"><img  src={loading} alt="Loading"/></div>;
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }

  // Extract unique values for each dropdown
  const deliveryLeads = [...new Set(users.map(user => user.lead))].map(lead => ({ value: lead, label: lead }));
  const accounts = [...new Set(users.map(user => user.account))].map(account => ({ value: account, label: account }));
  const managers = [...new Set(users.map(user => user.manager_name))].map(manager => ({ value: manager, label: manager }));
  const designations = [...new Set(users.map(user => user.designation))].map(designation => ({ value: designation, label: designation }));
  
  // Extract unique skills
  const skills = [...new Set(users.flatMap(user => Object.keys(user.skills[0] || {})))].map(skill => ({ value: skill, label: skill }));

  const clearAllFilters = () => {
    setSelectedDeliveryLeads([]);
    setSelectedAccounts([]);
    setSelectedManagers([]);
    setSelectedSkills([]);
    setSelectedDesignations([]);
    setSortOption(null);
  };


  // sort
  const sortUsers = (users) => {
    if (!sortOption) return users;

    const sortedUsers = [...users];
    if (sortOption.value === 'skillsCount') {
      sortedUsers.sort((a, b) => b.total_skills_rated - a.total_skills_rated);
    } else if (sortOption.value === 'averageRating') {
      sortedUsers.sort((a, b) => b.average_rating - a.average_rating);
    }

    return sortedUsers;
  };

  const filteredUsers = users.filter(user => 
    (selectedDeliveryLeads.length === 0 || selectedDeliveryLeads.some(dl => dl.value === user.lead)) &&
    (selectedAccounts.length === 0 || selectedAccounts.some(ac => ac.value === user.account)) &&
    (selectedManagers.length === 0 || selectedManagers.some(mgr => mgr.value === user.manager_name)) &&
    (selectedDesignations.length === 0 || selectedDesignations.some(des => des.value === user.designation)) &&
    (selectedSkills.length === 0 || selectedSkills.every(skill => Object.keys(user.skills[0] || {}).includes(skill.value)))
  );

  const sortedUsers = sortUsers(filteredUsers);

  return (
    <div className="talent-finder">
      <form className="filters">
        <div className="filter">
          <label htmlFor="deliveryLead">Delivery Lead</label>
          <Select
            id="deliveryLead"
            isMulti
            value={selectedDeliveryLeads}
            options={deliveryLeads}
            onChange={setSelectedDeliveryLeads}
            placeholder="Select delivery leads"
          />
        </div>
        <div className="filter">
          <label htmlFor="account">Account</label>
          <Select
            id="account"
            isMulti
            value={selectedAccounts}
            options={accounts}
            onChange={setSelectedAccounts}
            placeholder="Select accounts"
          />
        </div>
        <div className="filter">
          <label htmlFor="manager">Manager</label>
          <Select
            id="manager"
            isMulti
            value={selectedManagers}
            options={managers}
            onChange={setSelectedManagers}
            placeholder="Select managers"
          />
        </div>
        <div className="filter">
          <label htmlFor="skill">Skills</label>
          <Select
            id="skill"
            isMulti
            value={selectedSkills}
            options={skills}
            onChange={setSelectedSkills}
            placeholder="Select skills"
          />
        </div>
        <div className="filter">
          <label htmlFor="designation">Designation</label>
          <Select
            id="designation"
            isMulti
            value={selectedDesignations}
            options={designations}
            onChange={setSelectedDesignations}
            placeholder="Select designations"
          />
        </div>
        <div className="filter">
          <label htmlFor="sort">Sort By</label>
          <Select
            id="sort"
            value={sortOption}
            options={[
              { value: 'skillsCount', label: 'Number of Skills' },
              { value: 'averageRating', label: 'Average Rating' },
            ]}
            onChange={setSortOption}
            placeholder="Sort by"
          />
        </div>
        <button type="button" className="clear-button" onClick={clearAllFilters}>Clear All</button>
      </form>

        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Delivery Lead</th>
                <th>Account</th>
                <th>Manager</th>
                <th>Skills</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.lead}</td>
                  <td>{user.account}</td>
                  <td>{user.manager_name}</td>
                  <td>
                    {Object.entries(user.skills[0] || {}).map(([skill, level]) => (
                      <div key={skill}>{skill}: {level}</div>
                    ))}
                  </td>
                  <td>{user.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ComparisionAnalysis ;

