import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/TalentFinder.css';
import "../styles/table.css";
import Navbar from '../others/Navbar';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TalentFinder = () => {
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
    capabilities:[]
  });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [topRatedPerson, setTopRatedPerson] = useState(null);
  const [view, setView] = useState('graph'); // 'graph' or 'table'
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedChartUser, setSelectedChartUser] = useState(null);

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

  const handleBarClick = (elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const skill = data.labels[index];
      setSelectedSkill(skill);
      const topPerson = users
        .filter(user => skill in user.skills)
        .sort((a, b) => b.skills[skill] - a.skills[skill])[0];
      setTopRatedPerson(topPerson);
      setSelectedChartUser(null); // Clear selected user when chart is clicked
    }
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setSelectedChartUser(null); // Clear selected user when row is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
      name: 'capabilities',
      label: 'capabilities',
      options: [...new Set(users.map(user => user.capabilities))].map(capabilities => ({ value:capabilities, label: capabilities }))
    },
    {
      name: 'function',
      label: 'function',
      options: [...new Set(users.map(user => user.function))].map(functions => ({ value:functions, label: functions }))
    },
    {
      name: 'skills',
      label: 'Skills',
      options: [...new Set(users.flatMap(user => Object.keys(user.skills)))].map(skill => ({ value: skill, label: skill }))
    }
  ];

  // Prepare data for the bar chart
  const skillCounts = users.reduce((acc, user) => {
    Object.keys(user.skills).forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {});

  const averageRatings = users.reduce((acc, user) => {
    Object.keys(user.skills).forEach(skill => {
      if (!acc[skill]) {
        acc[skill] = { total: 0, count: 0 };
      }
      acc[skill].total += user.skills[skill];
      acc[skill].count += 1;
    });
    return acc;
  }, {});

  const averageData = Object.keys(averageRatings).map(skill => {
    return (averageRatings[skill].total / averageRatings[skill].count).toFixed(2);
  });

  const data = {
    labels: Object.keys(skillCounts),
    datasets: [
      {
        type: 'bar',
        label: 'Skill Count',
        data: Object.values(skillCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        type: 'line',
        label: 'Average Rating',
        data: averageData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Skills Count and Average Rating'
      }
    },
    onClick: (event, elements) => handleBarClick(elements),
    scales: {
      y: {
        ticks: {
          stepSize: 1000 // Adjust this value to change the y-axis scale increments
        },
        grid: {
          display: false // Remove the grid
        }
      },
      x: {
        grid: {
          display: false // Remove the grid
        }
      }
    }
  };

  // Sort users based on average rating
  const sortedUsers = [...users].sort((a, b) => b.average_rating - a.average_rating);

  return (
    <div className="talent-finder">
      <Navbar />
      <h1 className='screen-title'>Talent Finder</h1>
      <div className="view-toggle">
        <FontAwesomeIcon
          icon={faChartBar}
          className={`toggle-icon ${view === 'graph' ? 'active' : ''}`}
          onClick={() => setView('graph')}
        />
        <FontAwesomeIcon
          icon={faTable}
          className={`toggle-icon ${view === 'table' ? 'active' : ''}`}
          onClick={() => setView('table')}
        />
      </div>
      <button className="filter-toggle" onClick={toggleSidebar}>
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

      {view === 'graph' && (
        <>
          {selectedSkill && topRatedPerson && (
            <div className="drill-down-info">
              <h2>Top Rated Person for {selectedSkill}</h2>
              <p>Name: {topRatedPerson.name}</p>
              <p>Designation: {topRatedPerson.designation}</p>
              <p>Lead: {topRatedPerson.lead}</p>
              <p>Rating: {topRatedPerson.skills[selectedSkill]}</p>
            </div>
          )}

          <div className="chart-container">
            <div className="chart-scroll">
              <Bar data={data} options={options} />
            </div>
          </div>
        </>
      )}

      {view === 'table' && (
        <div>
          <table className="user-table">
            <thead className="table-header">
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Lead</th>
                <th>Average Rating</th>
              </tr>
            </thead>
            <tbody className="table-rows">
              {sortedUsers.map((user) => (
                <tr key={user.id} onClick={() => handleRowClick(user)}>
                  <td>{user.name}</td>
                  <td>{user.designation}</td>
                  <td>{user.lead}</td>
                  <td>{user.average_rating.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedUser && (
            <div className="modal-overlay drill-down-info">
              <div className="modal">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h2>Skills and Ratings for {selectedUser.name}</h2>
                <table className="user-skills-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(selectedUser.skills).map(skill => (
                      <tr key={skill}>
                        <td>{skill}</td>
                        <td>{selectedUser.skills[skill]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalentFinder;
