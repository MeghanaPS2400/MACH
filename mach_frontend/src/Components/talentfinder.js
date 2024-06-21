import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchData } from '../redux/talentReducer';
import loading from "../assets/loading.gif";
import "../styles/TalentFinder.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement,Title, Tooltip, Legend);

const TalentFinder = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [selectedDeliveryLeads, setSelectedDeliveryLeads] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFilteredUsers();
  }, []);

  const fetchFilteredUsers = () => {
    const queryParams = new URLSearchParams();

    selectedDeliveryLeads.forEach((lead) => queryParams.append('lead', lead.value));
    selectedAccounts.forEach((account) => queryParams.append('account', account.value));
    selectedManagers.forEach((manager) => queryParams.append('manager_name', manager.value));
    selectedSkills.forEach((skill) => queryParams.append('skills', skill.value));
    selectedDesignations.forEach((designation) => queryParams.append('designation', designation.value));
    queryParams.append('page', currentPage);
    queryParams.append('per_page', itemsPerPage);
    console.log(queryParams);
    dispatch(fetchData(`?${queryParams.toString()}`));
  };

  if (status === 'loading') {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }

  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
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
    dispatch(fetchData(`?`));
  };

  const sortOptions = [
    { value: 'skillsCount', label: 'Number of Skills' },
    { value: 'averageRating', label: 'Average Rating' }
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const skillLevels = {};
  users.forEach(user => {
    Object.entries(user.skills[0] || {}).forEach(([skill, rating]) => {
      if (skillLevels[skill]) {
        skillLevels[skill].count += 1;
        skillLevels[skill].total += rating;
      } else {
        skillLevels[skill] = { count: 1, total: rating };
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

  const sortData = (data) => {
    if (!sortOption) return data;

    return [...data].sort((a, b) => {
      if (sortOption.value === 'skillsCount') {
        return b.total_skills_rated - a.total_skills_rated;
      }
      if (sortOption.value === 'averageRating') {
        return b.average_rating - a.average_rating;
      }
      return 0;
    });
  };

  const sortedUsers = sortData(users);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="talent-finder">
      <h2>TALENT FINDER</h2>
      <div className="Talentfilters">
        <div className="filter">
          <label htmlFor="deliveryLead">Delivery Lead</label>
          <Select
            id="deliveryLead"
            isMulti
            value={selectedDeliveryLeads}
            options={deliveryLeads}
            onChange={setSelectedDeliveryLeads}
            placeholder="Select"
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
            placeholder="Select"
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
            placeholder="Select"
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
            placeholder="Select"
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
            placeholder="Select"
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
        <button type="button" className="clear-button" onClick={fetchFilteredUsers}>Apply</button>
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
              {paginatedUsers.map((user, index) => (
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
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TalentFinder;
