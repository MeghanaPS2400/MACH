import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../others/Navbar';
import FilterSidebar from '../others/sidebar';
import { fetchReplacementData } from '../redux/replacementslice';
import loadingGif from '../assets/loading.gif';
import ReplacementCard from './replacemntcard'; // Assuming you have a ReplacementCard component
import '../styles/sidebar.css';
import '../styles/replacement.css';
import Layout from '../others/Layout';

const FilteredCount = ({ count }) => (
  <div className='filteredCount'>
    <h3>Number of People: {count}</h3>
  </div>
);

const SkillTable = ({ skills, overallrating, selectedName }) => (
  <div className="user-skill">
    <div className='scrollable'>
      <h2>{selectedName ? `${selectedName}'s Skills` : 'Employee Skills'}</h2>
      <table>
        <thead className="tableheader">
          <tr>
            <th>Skill</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody className="table-rowsdata">
          {Object.entries(skills)
            .filter(([skill, rating]) => rating > 0)
            .map(([skill, rating]) => (
              <tr key={skill}>
                <td>{skill}</td>
                <td>{rating.toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    <div className="fixed-total">
      <p>Total rating: {overallrating}</p>
    </div>
  </div>
);

function ReplacementFinder() {
  const dispatch = useDispatch();
  const {
    overallrating,
    filteredMatches,
    skillAvgRatings,
    ratingFilter,
    status,
    error,
  } = useSelector((state) => state.replacement);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [],
    skills: [],
    account: [],
    rating: [],
  });

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedFilteredMatches = useMemo(() => {
    if (!sortBy) return filteredMatches;

    return [...filteredMatches].sort((a, b) => {
      switch (sortBy) {
        case 'matching_skills':
          return sortDirection === 'asc' ? a.matching_skills - b.matching_skills : b.matching_skills - a.matching_skills;
        case 'average_rating':
          return sortDirection === 'asc' ? a.average_rating - b.average_rating : b.average_rating - a.average_rating;
        default:
          return 0;
      }
    });
  }, [filteredMatches, sortBy, sortDirection]);

  useEffect(() => {
    dispatch(fetchReplacementData());
  }, [dispatch]);

  const handleApplyFilters = (selectedFilters) => {
    const queryParams = Object.keys(selectedFilters)
      .filter(key => selectedFilters[key].length > 0)
      .map(key => selectedFilters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&'))
      .join('&');

    dispatch(fetchReplacementData(`?${queryParams}`));
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleSort = (columnName) => {
    if (columnName === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('desc'); // Default to descending order on first click
    }
  };

  const totalPages = Math.ceil(sortedFilteredMatches.length / 6); // Changed to 6 cards per page
  const startIdx = (currentPage - 1) * 8; // Changed to 6 cards per page
  const endIdx = startIdx + 8; // Changed to 6 cards per page
  const currentMatches = sortedFilteredMatches.slice(startIdx, endIdx);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  if (status === 'loading') {
    return (
      <div className="Talentloading">
        <img src={loadingGif} style={{ width: '80px', height: '80px' }} alt="Loading" />
      </div>
    );
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }

  const selectedName = selectedFilters.name.length > 0 ? selectedFilters.name[0] : '';

  const filters = [
    {
      name: 'name',
      label: 'Name',
      options: [...new Set(filteredMatches.map(user => user.name))].map(name => ({ value: name, label: name }))
    },
    {
      name: 'designation',
      label: 'Designation',
      options: [...new Set(filteredMatches.map(user => user.designation))].map(designation => ({ value: designation, label: designation }))
    },
    {
      name: 'account',
      label: 'Account',
      options: [...new Set(filteredMatches.map(user => user.account))].map(account => ({ value: account, label: account }))
    },
    {
      name: 'skills',
      label: 'Skills',
      options: Object.keys(skillAvgRatings).map(skill => ({ value: skill, label: skill }))
    },
    {
      name: 'rating',
      label: 'Rating',
      options: [
        { value: '5', label: 'Master' },
        { value: '4', label: 'Expert' },
        { value: '3', label: 'Advance' },
        { value: '2', label: 'Intermediate' },
        { value: '1', label: 'Beginner' },
      ]
    }
  ];

  return (
    <Layout>
      <div className="replacement-finder">

        <button className="filter-togglebar" onClick={toggleSidebar}>
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
        <div className="tables">
          <SkillTable skills={skillAvgRatings} overallrating={overallrating} selectedName={selectedName} />
          <div className="user-cards">
            <div className="cards-container">
              {currentMatches.length > 0 ? (
                currentMatches.map((item) => (
                  <ReplacementCard key={item.user_id} employee={item} skillAvgRatings={skillAvgRatings} />
                ))
              ) : (
                <p>No matching data found.</p>
              )}
            </div>
          </div>
        </div>
        <div className="paginationr">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>&lt; Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next &gt;</button>
        </div>
      </div>
    </Layout>
  );
}

export default ReplacementFinder;
