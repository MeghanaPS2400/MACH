//talent finder screen

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchUsers } from '../redux/talentReducer';
import loading from "../assets/loading.gif";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TalentFinder = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [selectedDeliveryLeads, setSelectedDeliveryLeads] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="loading"><img src={loading} alt="Loading" /></div>;
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }

  const deliveryLeads = [...new Set(users.map(user => user.lead))].map(lead => ({ value: lead, label: lead }));
  const accounts = [...new Set(users.map(user => user.account))].map(account => ({ value: account, label: account }));
  const managers = [...new Set(users.map(user => user.manager_name))].map(manager => ({ value: manager, label: manager }));
  const designations = [...new Set(users.map(user => user.designation))].map(designation => ({ value: designation, label: designation }));

  const skills = [...new Set(users.flatMap(user => Object.keys(user.skills[0] || {})))].map(skill => ({ value: skill, label: skill }));

  const clearAllFilters = () => {
    setSelectedDeliveryLeads([]);
    setSelectedAccounts([]);
    setSelectedManagers([]);
    setSelectedSkills([]);
    setSelectedDesignations([]);
  };

  const matchesCriteria = (user, selectedValues, key) => {
    return selectedValues.length === 0 || selectedValues.some(selected => selected.value === user[key]);
  };

  const matchesSkills = (user, selectedSkills) => {
    return selectedSkills.length === 0 || selectedSkills.every(skill => Object.keys(user.skills[0] || {}).includes(skill.value));
  };

  const filteredUsers = users.filter(user =>
    matchesCriteria(user, selectedDeliveryLeads, 'lead') &&
    matchesCriteria(user, selectedAccounts, 'account') &&
    matchesCriteria(user, selectedManagers, 'manager_name') &&
    matchesCriteria(user, selectedDesignations, 'designation') &&
    matchesSkills(user, selectedSkills)
  );

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

  const sortedUsers = sortUsers(filteredUsers);

  const skillLevels = {};
  filteredUsers.forEach(user => {
    Object.entries(user.skills[0] || {}).forEach(([skill, level]) => {
      if (skillLevels[skill]) {
        skillLevels[skill].count += 1;
        skillLevels[skill].total += level;
      } else {
        skillLevels[skill] = { count: 1, total: level };
      }
    });
  });

  const chartData = {
    labels: Object.keys(skillLevels),
    datasets: [
      {
        type: 'bar',
        label: 'Count of EMP ID',
        data: Object.values(skillLevels).map(skill => skill.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'Average Skill Level',
        data: Object.values(skillLevels).map(skill => (skill.total / skill.count).toFixed(2)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        yAxisID: 'y-axis-2',
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
      'y-axis-2': {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const sortOptions = [
    { value: 'skillsCount', label: 'Number of Skills' },
    { value: 'averageRating', label: 'Average Rating' }
  ];

  return (
    <div className="talent-finder">
      <div className="filters">
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
            options={sortOptions}
            onChange={setSortOption}
            placeholder="Sort by"
          />
        </div>
        <button type="button" className="clear-button" onClick={clearAllFilters}>Clear All</button>
      </div>

      <div className="content">
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account</th>
                <th>Designation</th>
                <th>Skills</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.account}</td>
                  <td>{user.designation}</td>
                  <td>{user.total_skills_rated}</td>
                  <td>{user.average_rating.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TalentFinder;
