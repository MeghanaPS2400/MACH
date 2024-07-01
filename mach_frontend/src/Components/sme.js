// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchData } from '../redux/talentReducer';
// import FilterSidebar from '../others/sidebar';
// import loading from "../assets/loading.gif";
// import '../styles/sidebar.css';
// import '../styles/SME.css';
// import Navbar from '../others/Navbar';
// import Pagination from '../others/pagination';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Layout from '../others/Layout';

// const Sme = () => {
//   const dispatch = useDispatch();
//   const { users, status, error } = useSelector((state) => state.users);
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(7);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedFilters, setSelectedFilters] = useState({
//     name: [],
//     designation: [
//       'Senior Associate',
//       'Associate Principal',
//       'Senior Associate - Developer',
//       'Principal - Codx',
//       'Senior Associate - Delivery',
//       'Partner-Cogito',
//       'Senior Associate - Innovation',
//       'Senior Associate - Codx',
//       'Associate Principal - Codx',
//       'Principal - Engineering'
//     ],
//     lead: [],
//     skills: [],
//     account: [],
//     manager_name: [],
//     validated: [],
//     rating: ['4', '5']
//   });

//   useEffect(() => {
//     handleApplyFilters(selectedFilters);
//   }, [dispatch, selectedFilters]);

//   useEffect(() => {
//     const filteredSkills = users.reduce((acc, user) => {
//       const skills = Object.entries(user.skills);
//       skills.forEach(([skill, rating]) => {
//         acc.push({ ...user, skill, rating });
//       });
//       return acc;
//     }, []).filter((value, index, self) =>
//       index === self.findIndex((t) => (
//         t.name === value.name && t.skill === value.skill && t.rating === value.rating
//       ))
//     );

//     setFilteredUsers(filteredSkills);
//   }, [users, selectedFilters]);

//   const handleApplyFilters = (filters) => {
//     const queryParams = Object.keys(filters)
//       .filter(key => filters[key].length > 0)
//       .map(key => filters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&'))
//       .join('&');

//     dispatch(fetchData(`?${queryParams}`));
//     setSidebarVisible(false);
//     setPage(0);
//   };

//   const toggleSidebar = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };

//   const handleFilterClick = (type, value) => {
//     const updatedFilters = {
//       ...selectedFilters,
//       [type]: [value]
//     };
//     setSelectedFilters(updatedFilters);
//     handleApplyFilters(updatedFilters);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (status === 'loading') {
//     return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
//   }

//   if (status === 'failed') {
//     return <p className="Talentloading">{error}</p>;
//   }

//   const filters = [
//     {
//       name: 'name',
//       label: 'Name',
//       options: [...new Set(users.map(({ name }) => name))].map(name => ({ value: name, label: name }))
//     },
//     {
//       name: 'designation',
//       label: 'Designation',
//       options: [...new Set(users.map(({ designation }) => designation))].map(designation => ({ value: designation, label: designation }))
//     },
//     {
//       name: 'lead',
//       label: 'Lead',
//       options: [...new Set(users.map(({ lead }) => lead))].map(lead => ({ value: lead, label: lead }))
//     },
//     {
//       name: 'account',
//       label: 'Account',
//       options: [...new Set(users.map(({ account }) => account))].map(account => ({ value: account, label: account }))
//     },
//     {
//       name: 'manager_name',
//       label: 'Manager',
//       options: [...new Set(users.map(({ manager_name }) => manager_name))].map(manager_name => ({ value: manager_name, label: manager_name }))
//     },
//     {
//       name: 'skills',
//       label: 'Skills',
//       options: [...new Set(users.flatMap(({ skills }) => Object.keys(skills)))].map(skill => ({ value: skill, label: skill }))
//     },
//     {
//       name: 'validated',
//       label: 'Validated',
//       options: [
//         { value: 'yes', label: 'Validated' },
//         { value: 'no', label: 'Not Validated' }
//       ]
//     },
//     {
//       name: 'rating',
//       label: 'Rating',
//       options: [
//         { value: '5', label: 'Master' },
//         { value: '4', label: 'Expert' }
//       ]
//     }
//   ];

//   const uniqueEmployeeCount = filteredUsers.length;

//   const FilteredCount = ({ count }) => (
//     <div className="count-box">
//       <h3>Number of Employees:</h3>
//       <p>{count}</p>
//     </div>
//   );

//   const value = (rating) => {
//     return rating === 4 ? "Expert" : "Master";
//   };

//   const paginatedUserSkills = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (

//     <div className="sme-finder">
//      <Layout>
//       <h4 className="screen-title">Subject Matter Expert</h4>
//       <button className="filter-toggle" onClick={toggleSidebar}>
//         {isSidebarVisible ? <span>&lt;</span> : <span>&gt;</span>}
//       </button>
//       <FilterSidebar
//         isVisible={isSidebarVisible}
//         filters={filters}
//         onApplyFilters={handleApplyFilters}
//         toggleSidebar={toggleSidebar}
//         setSelectedFilters={setSelectedFilters}
//         selectedFilters={selectedFilters}
//       />

//       <FilteredCount count={uniqueEmployeeCount} />
//       <TableContainer component={Paper} sx={{ maxHeight: 320 }} className='table-container'>
//         <Table stickyHeader aria-label="sticky table" className='user-table'>
//           <TableHead className='table-header'>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Designation</TableCell>
//               <TableCell>Lead</TableCell>
//               <TableCell>Account</TableCell>
//               <TableCell>Skill</TableCell>
//               <TableCell>Rating</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedUserSkills.map(({ id, name, designation, lead, account, skill, rating }) => (
//               <TableRow key={`${id}-${skill}`}>
//                 <TableCell>{name}</TableCell>
//                 <TableCell>{designation}</TableCell>
//                 <TableCell>{lead}</TableCell>
//                 <TableCell>{account}</TableCell>
//                 <TableCell onClick={() => handleFilterClick('skills', skill)}>{skill}</TableCell>
//                 <TableCell onClick={() => handleFilterClick('rating', rating.toString())}>{value(rating)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Pagination
//         count={filteredUsers.length}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//       </Layout>
//     </div>
//   );
// };

// export default Sme;








import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/SME.css';
import Pagination from '../others/pagination';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Layout from '../others/Layout';

const Sme = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [
      'Senior Associate',
      'Associate Principal',
      'Manager'
    ],
    lead: [],
    skills: [],
    account: [],
    manager_name: [],
    validated: [],
    rating: ['4', '5'],
    tenure: [],
    iteration: [],
   
    serviceline_name:[],
  functions:[]
  });

  useEffect(() => {
    handleApplyFilters(selectedFilters);
  }, [dispatch, selectedFilters]);

  useEffect(() => {
    const filteredSkills = users.reduce((acc, user) => {
      const skills = Object.entries(user.skills);
      skills.forEach(([skill, rating]) => {
        acc.push({ ...user, skill, rating });
      });
      return acc;
    }, []).filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name && t.skill === value.skill && t.rating === value.rating
      ))
    );

    setFilteredUsers(filteredSkills);
  }, [users, selectedFilters]);

  const handleApplyFilters = (filters) => {
    const queryParams = Object.keys(filters)
      .filter(key => filters[key].length > 0)
      .map(key => filters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&'))
      .join('&');

    dispatch(fetchData(`?${queryParams}`));
    setSidebarVisible(false);
    setPage(0);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleFilterClick = (type, value) => {
    const updatedFilters = {
      ...selectedFilters,
      [type]: [value]
    };
    setSelectedFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
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
      options: users ? [...new Set(users.map(({ name }) => name))].map(name => ({ value: name, label: name })) : []
    },
    {
      name: 'designation',
      label: 'Designation',
      options: users ? [...new Set(users.map(({ designation }) => designation))].map(designation => ({ value: designation, label: designation })) : []
    },
    {
      name: 'lead',
      label: 'Lead',
      options: users ? [...new Set(users.map(({ lead }) => lead))].map(lead => ({ value: lead, label: lead })) : []
    },
    {
      name: 'account',
      label: 'Account',
      options: users ? [...new Set(users.map(({ account }) => account))].map(account => ({ value: account, label: account })) : []
    },
    {
      name: 'manager_name',
      label: 'Manager',
      options: users ? [...new Set(users.map(({ manager_name }) => manager_name))].map(manager_name => ({ value: manager_name, label: manager_name })) : []
    },
    {
      name: 'skills',
      label: 'Skills',
      options: users ? [...new Set(users.flatMap(({ skills }) => Object.keys(skills)))].map(skill => ({ value: skill, label: skill })) : []
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

  const uniqueEmployeeCount = filteredUsers.length;

  const FilteredCount = ({ count }) => (
    <div className="filteredCount">
      <h3>Number of Employees: {count}</h3>
    </div>
  );

  const value = (rating) => {
    return rating === 4 ? "Expert" : "Master";
  };

  const paginatedUserSkills = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="sme-finder">
      <Layout>
        <h4 className="screen-title">Subject Matter Expert</h4>
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

        <FilteredCount count={uniqueEmployeeCount} />
        <TableContainer component={Paper} sx={{ maxHeight: 320 }} className='table-container'>
          <Table stickyHeader aria-label="sticky table" className='user-table'>
            <TableHead className='table-header'>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Tenure</TableCell>
                <TableCell>Iteration</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Capabilities</TableCell>
                <TableCell>Service Line</TableCell>
                
                <TableCell>Skills Count</TableCell>
                <TableCell>Average Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUserSkills.map(({ id, name, designation, lead, account, manager_name, tenure, iteration, skills, rating, capabilities, serviceline_name, func, skills_count, average_rating }) => (
                <TableRow key={`${id}-${skills}`}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{designation}</TableCell>
                  <TableCell>{lead}</TableCell>
                  <TableCell>{account}</TableCell>
                  <TableCell>{manager_name}</TableCell>
                  <TableCell>{tenure}</TableCell>
                  <TableCell>{iteration}</TableCell>
                  <TableCell>{Object.keys(skills).map(skill => `${skill}: ${skills[skill]}`).join(', ')}</TableCell>
                  <TableCell>{value(rating)}</TableCell>
                  <TableCell>{capabilities}</TableCell>
                  <TableCell>{serviceline_name}</TableCell>
                  
                  <TableCell>{skills_count}</TableCell>
                  <TableCell>{average_rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          rowsPerPageOptions={[7, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Layout>
    </div>
  );
};

export default Sme;
