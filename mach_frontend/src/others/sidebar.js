import React, { useState } from 'react';
import Modal from '../others/modal';
import '../styles/sidebar.css';

const FilterSidebar = ({ isVisible, filters, onApplyFilters, toggleSidebar, setSelectedFilters, selectedFilters }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // State to track selected option

  const sidebarClass = isVisible ? 'sidebar visible' : 'sidebar';

  const handleFilterChange = (filterName, filterValue) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({
      name: [],
      designation: [],
      lead: [],
      skills: []
      // Add other filters as needed
    });
    onApplyFilters(selectedFilters);
    toggleSidebar();
  };

  const handleFilterButtonClick = (filter) => {
    setCurrentFilter(filter);
    setModalVisible(true);
  };

  const handleSelectChange = (selectedOptions, filterName) => {
    handleFilterChange(filterName, selectedOptions);
    setModalVisible(false);
  };

  const handleRemoveFilter = (filterName, valueToRemove) => {
    const updatedFilters = selectedFilters[filterName].filter(value => value !== valueToRemove);
    handleFilterChange(filterName, updatedFilters);
  };

  const selectedFilterItems = Object.keys(selectedFilters).reduce((items, key) => {
    if (selectedFilters[key].length > 0) {
      items.push(...selectedFilters[key].map(value => ({ key, value })));
    }
    return items;
  }, []);

  const handleOptionClick = (filter, option) => {
    setSelectedOption(option); // Set the selected option
    handleFilterButtonClick(filter); // Open the modal or perform other actions
  };

  return (
    <div className={sidebarClass} onMouseLeave={() => { toggleSidebar(); setModalVisible(false) }}>
      {filters.map((filter, index) => (
        <div key={index} className="filter-option">
          <button
            className={`sidebar-filter-options ${selectedOption === filter.label ? 'selected' : ''}`} // Apply 'selected' class if this option is selected
            onClick={() => handleOptionClick(filter, filter.label)} // Pass the filter and label as parameters
          >
            {filter.label}
          </button>
        </div>
      ))}
      <div className="sidebar-buttons" onMouseLeave={() => setModalVisible(false)}>
        <button onClick={() => onApplyFilters(selectedFilters)}>Apply Filters</button>
        <button onClick={handleClearAllFilters}>Clear All</button>
      </div>
      <div className="selected-filters-wrapper-div">Selected Filters:</div><br />
      <div className="selected-filters">
        {selectedFilterItems.length > 0 && (
          <div className="selected-filters-wrapper">
            {selectedFilterItems.map((item, index) => (
              <div key={index} className="selected-filter-item">
                <div>{`${item.value}`}</div>
                <button className="filter-select-button" onClick={() => handleRemoveFilter(item.key, item.value)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalVisible && currentFilter && (
        <Modal
          filter={currentFilter}
          selectedFilters={selectedFilters[currentFilter.name]}
          onSelectChange={(selectedOptions) => handleSelectChange(selectedOptions, currentFilter.name)}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default FilterSidebar;
