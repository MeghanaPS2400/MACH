import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsers } from '../redux/talentReducer';

const TalentFinder = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [selectedDeliveryLeads, setSelectedDeliveryLeads] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading...</p>;
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

  // Filter users based on selected values
  const filteredUsers = users.filter(user => 
    (selectedDeliveryLeads.length === 0 || selectedDeliveryLeads.some(dl => dl.value === user.lead)) &&
    (selectedAccounts.length === 0 || selectedAccounts.some(ac => ac.value === user.account)) &&
    (selectedManagers.length === 0 || selectedManagers.some(mgr => mgr.value === user.manager_name)) &&
    (selectedDesignations.length === 0 || selectedDesignations.some(des => des.value === user.designation)) &&
    (selectedSkills.length === 0 || selectedSkills.every(skill => Object.keys(user.skills[0] || {}).includes(skill.value)))
  );

  // Transform filtered users to have a row for each skill, considering the selected skills filter
  const transformedUsers = filteredUsers.flatMap(user =>
    Object.entries(user.skills[0] || {}).map(([skill, level]) => {
      if (selectedSkills.length > 0 && !selectedSkills.some(selectedSkill => selectedSkill.value === skill)) {
        return null;
      }
      return {
        ...user,
        skill,
        level
      };
    }).filter(user => user !== null)
  );

  const clearAllFilters = () => {
    setSelectedDeliveryLeads([]);
    setSelectedAccounts([]);
    setSelectedManagers([]);
    setSelectedSkills([]);
    setSelectedDesignations([]);
  };

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
        <button type="button" className="clear-button" onClick={clearAllFilters}>Clear All</button>
      </form>

      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Account</th>
            <th>Designation</th>
            <th>Skill</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {transformedUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.account}</td>
              <td>{user.designation}</td>
              <td>{user.skill}</td>
              <td>{user.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TalentFinder;
