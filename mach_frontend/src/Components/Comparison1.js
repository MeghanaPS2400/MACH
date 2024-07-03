import React, { useState, useEffect,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComparison1Data } from "../redux/ComparisonReducer";
import FilterSidebar from '../others/sidebar';
import loading from "../assets/loading.gif";
import '../styles/sidebar.css';
import '../styles/table.css';



const Comparison1 = () => {
  const dispatch = useDispatch();
  const { users1, status, error } = useSelector((state) => state.comparison.comparison1);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    designation: [],
    lead: [],
    skills: [],
    account: [],
    manager_name: []
  });

  useEffect(() => {
    dispatch(fetchComparison1Data());
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }
 
  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
  }

  const handleApplyFilters = () => {
    const queryParams = Object.keys(selectedFilters)
      .filter(key => selectedFilters[key].length > 0)
      .map(key => {
        return selectedFilters[key].map(value => `${key}=${encodeURIComponent(value)}`).join('&');
      })
      .join('&');

    dispatch(fetchComparison1Data(`?${queryParams}`));
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const filters = [
    {
      name: 'name',
      label: 'Name',
      options: [...new Set(users1.map(user => user.name))].map(name => ({ value: name, label: name }))
    },
    {
      name: 'designation',
      label: 'Designation',
      options: [...new Set(users1.map(user => user.designation))].map(designation => ({ value: designation, label: designation }))
    },
    {
      name: 'lead',
      label: 'Lead',
      options: [...new Set(users1.map(user => user.lead))].map(lead => ({ value: lead, label: lead }))
    },
    {
      name: 'account',
      label: 'Account',
      options: [...new Set(users1.map(user => user.account))].map(account => ({ value: account, label: account }))
    },
    {
      name: 'manager_name',
      label: 'Manager',
      options: [...new Set(users1.map(user => user.manager_name))].map(manager_name => ({ value: manager_name, label: manager_name }))
    }
  ];

  return (
    <div className="comparison">
      <button className="filter-togglebar-comparison" onClick={toggleSidebar}>
        {isSidebarVisible ? <span>&lt;</span> : <h3 class="transform-text">Filter1</h3>}
      </button>
      <FilterSidebar
        isVisible={isSidebarVisible}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        toggleSidebar={toggleSidebar}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
      />
    </div>
  );
};

export default Comparison1;



  