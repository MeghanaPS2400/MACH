// components/Modal.js

import React from 'react';
import '../styles/modal.css';

const Modal = ({ filter, selectedFilters, onSelectChange, onClose }) => {
  const handleOptionClick = (option) => {
    const isSelected = selectedFilters.includes(option.value);
    const updatedFilters = isSelected
      ? selectedFilters.filter(value => value !== option.value)
      : [...selectedFilters, option.value];
    onSelectChange(updatedFilters);
  };

  return (
    <div className="modal open">
      <div className="modal-content">
      <button className="close-button" onClick={onClose}>x</button>
        <h2>{filter.label}</h2>
        <div className="options-container">
          {filter.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedFilters.includes(option.value) ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
