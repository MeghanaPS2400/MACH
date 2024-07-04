/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/TalentFinder.css';
import "../styles/table.css";
import Navbar from '../others/Navbar';
import Pagination from '../others/pagination';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Layout from '../others/Layout';
import HeatMap from '../Components/TalentFinderMap';

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
    capabilities: []
  });
  const [view, setView] = useState('graph'); // 'graph' or 'table'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      label: 'Capabilities',
      options: [...new Set(users.map(user => user.capabilities))].map(capabilities => ({ value: capabilities, label: capabilities }))
    },
    {
      name: 'functions',
      label: 'Functions',
      options: [...new Set(users.map(user => user.functions))].map(functions => ({ value: functions, label: functions }))
    },
    {
      name: 'skills',
      label: 'Skills',
      options: [...new Set(users.flatMap(user => Object.keys(user.skills)))].map(skill => ({ value: skill, label: skill }))
    }
  ];

  const sortedUsers = users.map(user => {
    const totalRatings = Object.values(user.skills).reduce((acc, rating) => acc + rating, 0);
    const numSkills = Object.keys(user.skills).length;
    const avgRating = totalRatings / numSkills;
    return { ...user, avgRating };
  }).sort((a, b) => b.avgRating - a.avgRating);

  const paginatedUserSkills = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => ({
    name: user.name,
    skills: Object.entries(user.skills).sort((a, b) => b[1] - a[1])
  }));

  return (
    <Layout>
      <Navbar />
      <div className="TalentFinder">
        <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
          <FilterSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            onApplyFilters={handleApplyFilters}
          />
        </div>
        <div className="TalentFinder-content">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarVisible ? 'Hide Filters' : 'Show Filters'}
          </button>
          <div className="view-toggle">
            <button onClick={() => setView('graph')}>Graph View</button>
            <button onClick={() => setView('table')}>Table View</button>
          </div>
          {view === 'graph' && <HeatMap users={users} />}
          {view === 'table' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Skills</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUserSkills.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        {user.skills.map(([skill, rating], idx) => (
                          <div key={idx}>{skill}: {rating}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TalentFinder;*/


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
import Pagination from '../others/pagination';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Layout from '../others/Layout';
import GaugeChart from 'react-gauge-chart';
 
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
 
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
 
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Average Rating',
        data: averageData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1'
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Skill Count'
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1000 // Adjust this value to change the y-axis scale increments
        },
        grid: {
          display: false // Remove the grid
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Average Rating'
        },
        ticks: {
          beginAtZero: true,
          precision: 2
        },
        grid: {
          display: false // Remove the grid
        },
        suggestedMax: 5 // Adjust this value based on your data range
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
 
  const paginatedUserSkills = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (<>
    <Layout/>
    <div className="talent-finder">
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
      <button className="filter-togglebar" onClick={toggleSidebar}>
        {isSidebarVisible ? <span class="fa-solid fa-ellipsis-vertical"></span> : <span>&gt;</span>}
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
        <div className="talent-table-container">
        <TableContainer component={Paper} sx={{ maxHeight: 320 }} className='table-container'>
          <Table stickyHeader aria-label="sticky table" className='user-table'>
            <TableHead className='table-header'>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Skills Count</TableCell>
                <TableCell>Average Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUserSkills.map((user) => (
                <TableRow key={user.user_id} onClick={() => handleRowClick(user)}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.designation}</TableCell>
                  <TableCell>{user.account}</TableCell>
                  <TableCell>{user.skills_count}</TableCell>
                  <TableCell>{user.average_rating.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          rowsPerPageOptions={[7, 10, 25]}
          component="div"
          count={sortedUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
 
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
    </>
  );
};
 
export default TalentFinder;

