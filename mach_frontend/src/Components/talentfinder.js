import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/TalentFinder.css';
import "../styles/table.css";
import Navbar from '../others/Navbar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [topRatedPerson, setTopRatedPerson] = useState(null);

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
    }
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
  ];

  // Prepare data for the bar chart
  const skillCounts = users.reduce((acc, user) => {
    Object.keys(user.skills).forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {});

  const data = {
    labels: Object.keys(skillCounts),
    datasets: [
      {
        label: 'Skill Count',
        data: Object.values(skillCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
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
        text: 'Skills Count'
      }
    },
    onClick: (event, elements) => handleBarClick(elements)
  };

  return (
    <div className="talent-finder">
      <Navbar/>
      <h1 className='screen-title'>Talent Finder</h1>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.designation}</td>
              <td>{user.lead}</td>
              <td>{user.average_rating.toFixed(2)}</td>
              {/* <td>
                {Object.entries(user.skills).map(([skill, rating]) => (
                  <div key={skill}>{`${skill} (${rating})`}</div>
                ))}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

   
    </div>
  );
};

export default TalentFinder;
