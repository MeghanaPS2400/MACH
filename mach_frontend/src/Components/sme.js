import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import Layout from '../others/Layout';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '../others/pagination';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faTable } from '@fortawesome/free-solid-svg-icons';
import '../styles/SME.css';
import '../styles/table.css';

const Sme = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: ['Senior Associate', 'Associate Principal', 'Manager', 'Principal'],
    lead: [],
    skills: [],
    account: [],
    manager_name: [],
    validated: [],
    rating: ['4', '5'],
    tenure: [],
    iteration: [],
    serviceline_name: [],
    functions: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(selectedFilters);
  const [view, setView] = useState('table'); // State to manage view (graph or table)

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  useEffect(() => {
    fetchDataWithFilters(appliedFilters);
  }, [appliedFilters, page, rowsPerPage]); // Include page and rowsPerPage in dependencies to fetch data on pagination change

  const fetchDataWithFilters = (filters) => {
    const queryParams = Object.keys(filters)
      .filter((key) => filters[key].length > 0)
      .map((key) => filters[key].map((value) => `${key}=${encodeURIComponent(value)}`).join('&'))
      .join('&');

    dispatch(fetchData(`?${queryParams}&_page=${page + 1}&_limit=${rowsPerPage}`)); // Adjusted to include pagination parameters
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleFilterClick = (type, value) => {
    if (type === 'skills') {
      // Toggle selection for skills
      const updatedSkills = selectedFilters.skills.includes(value)
        ? selectedFilters.skills.filter(skill => skill !== value)
        : [...selectedFilters.skills, value];
      
      const updatedFilters = {
        ...selectedFilters,
        skills: updatedSkills,
      };
      setSelectedFilters(updatedFilters);
    } 
  };
  
  const applyFilters = () => {
    setAppliedFilters(selectedFilters);
    setPage(0); // Reset page to 0 when filters are applied, including skill filters
    toggleSidebar(); // Close sidebar after applying filters
  };
  
  if (status === 'loading') {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }

  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
  }

  // Flatten skills for each user into an array of objects
  const userSkills = users.flatMap(
    ({ id, name, designation, account, skills, tenure, iteration, serviceline_name, functions }) =>
      Object.entries(skills).map(([skill, rating]) => ({
        id,
        name,
        designation,
        account,
        skill,
        rating,
        tenure,
        iteration,
        serviceline_name,
        functions,
      }))
  );

  // Calculate unique employee count based on filtered user skills
  const filteredUserSkills = userSkills.filter(({ skill }) => appliedFilters.skills.length === 0 || appliedFilters.skills.includes(skill));
  const uniqueEmployeeCount = [...new Set(filteredUserSkills.map((item) => item.name))].length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const value = (rating) => {
    return rating === 4 ? "Expert" : "Master";
  };

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
        { value: 'Validated', label: 'Validated' },
        { value: 'Non-Validated', label: 'Not Validated' }
      ]
    },
    {
      name: 'rating',
      label: 'Rating',
      options: [
        { value: '5', label: 'Master' },
        { value: '4', label: 'Expert' }
      ]
    },
    {
      name: 'tenure',
      label: 'Tenure',
      options: users ? [...new Set(users.map(({ tenure }) => tenure))].map(tenure => ({ value: tenure, label: tenure })) : []
    },
    {
      name: 'iteration',
      label: 'Iteration',
      options: users ? [...new Set(users.map(({ iteration }) => iteration))].map(iteration => ({ value: iteration, label: iteration })) : []
    },
    {
      name: 'serviceline_name',
      label: 'Service Line',
      options: users ? [...new Set(users.map(({ serviceline_name }) => serviceline_name))].map(serviceline_name => ({ value: serviceline_name, label: serviceline_name })) : []
    },
    {
      name: 'functions',
      label: 'Functions',
      options: users ? [...new Set(users.map(({ functions }) => functions))].map(functions => ({ value: functions, label: functions })) : []
    },
  ];

  const getSkillDistribution = (users) => {
    const skillCounts = {};
  
    users.forEach(({ skills }) => {
      Object.keys(skills).forEach((skill) => {
        if (skillCounts[skill]) {
          skillCounts[skill]++;
        } else {
          skillCounts[skill] = 1;
        }
      });
    });
  
    const labels = Object.keys(skillCounts);
    const data = Object.values(skillCounts);
  
    // Gradient colors based on provided color variables
    const colors = [
      '#edf6fd',
      '#daedfb',
      '#c2e0f8',
      '#a2cff5',
      '#71b5f0',
      '#2f91ea',
      '#1471c9',
      '#0f5496',
      '#0b3d6d',
      '#082c4d',
    ];

    const gradientColors = colors.map((color, index) => {
      return {
        offset: Math.round(index * (100 / colors.length)) + '%',
        color,
      };
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: gradientColors.map((color) => color.color),
        },
      ],
    };
  };

  // Prepare data for the Doughnut chart
  const skillDistribution = getSkillDistribution(users);

  return (
    <>
      <Layout />
      <div className="sme-finder">
        <h4 className="screen-title">Subject Matter Expert</h4>
        <button className="filter-togglebar" onClick={toggleSidebar}>
         {isSidebarVisible ? <span>&lt;</span> : <span>&gt;</span>}
        </button>
        <div className="toggle-icons">
          
          <FontAwesomeIcon
            icon={faTable}
            className={`toggle-icon ${view === 'table' ? 'active' : ''}`}
            onClick={() => setView('table')}
          />
          <FontAwesomeIcon
            icon={faChartPie}
            className={`toggle-icon ${view === 'graph' ? 'active' : ''}`}
            onClick={() => setView('graph')}
          />
        </div>

        <div className="count-box">
          <h3>Number of Employees:</h3>
          <p>{uniqueEmployeeCount}</p>
        </div>

        {view === 'graph' && (
          <div className="chart-container">
            <h3 className='skillclass'>Skills Distribution</h3>
            <div className="chart-center">
              <Doughnut data={skillDistribution} />
            </div>
          </div>
        )}

        {view === 'table' && (
          <>
          <TableContainer className='table-container' component={Paper} sx={{ maxHeight: 390 }}>
            <Table stickyHeader aria-label="sticky table" className='user-table'>
              <TableHead className='table-header'>
                <TableRow className='table-rows-data'>
                  <TableCell>Name</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Service Line</TableCell>
                  <TableCell>Tenure</TableCell>
                  <TableCell>Iteration</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUserSkills
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ id, name, designation, account, skill, rating, tenure, iteration, serviceline_name }) => (
                    <TableRow key={`${id}-${skill}`} className="table-rows-data">
                      <TableCell>{name}</TableCell>
                      <TableCell>{designation}</TableCell>
                      <TableCell>{account}</TableCell>
                      <TableCell>{serviceline_name}</TableCell>
                      <TableCell>{tenure}</TableCell>
                      <TableCell>{iteration}</TableCell>
                      <TableCell onClick={() => handleFilterClick('skills', skill)} className="clickable-cell">{skill}</TableCell>
                      <TableCell onClick={() => handleFilterClick('rating', rating.toString())} className="clickable-cell">{value(rating)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
          component="div"
          count={uniqueEmployeeCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
          </>
        )}

        <FilterSidebar
          isVisible={isSidebarVisible}
          filters={filters}
          onApplyFilters={applyFilters} // Use applyFilters instead of fetchDataWithFilters
          toggleSidebar={toggleSidebar}
          setSelectedFilters={setSelectedFilters}
          selectedFilters={selectedFilters}
        />
       
      </div>
    </>
  );
};

export default Sme;
