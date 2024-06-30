import React from 'react';
import '../styles/replacement.css';

const ReplacementCard = ({ employee }) => (
  <div className="replacement-card">
    <h3>{employee.name}</h3>
    <p>Designation: {employee.designation}</p>
    <p>Account: {employee.account}</p>
    <p>Matching Skills: {employee.skills_count}</p>
    <p>Average Rating: {employee.average_rating.toFixed(3)}</p>
  </div>
);

export default ReplacementCard;
