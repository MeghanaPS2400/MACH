import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/talentReducer';
import loading from "../assets/loading.gif";
import '../styles/SME.css'; 
import Navbar from '../others/Navbar';

const EmployeeSkill = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const [skillData, setSkillData] = useState([]);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      const skillsMap = users.reduce((acc, user) => {
        Object.entries(user.skills).forEach(([skill, rating]) => {
          if (!acc[skill]) {
            acc[skill] = { totalRating: 0, count: 0 };
          }
          acc[skill].totalRating += rating;
          acc[skill].count += 1;
        });
        return acc;
      }, {});

      const skillDataArray = Object.entries(skillsMap).map(([skill, { totalRating, count }]) => ({
        skill,
        averageRating: (totalRating / count).toFixed(2),
        employeeCount: count,
      }));

      setSkillData(skillDataArray);
    }
  }, [users]);

  if (status === 'loading') {
    return <div className="Talentloading"><img src={loading} alt="Loading" /></div>;
  }

  if (status === 'failed') {
    return <p className="Talentloading">{error}</p>;
  }

  return (
    <div className="employee-skill">
      <Navbar />
      <h1>Employee Skills</h1>
      <table className="skill-table">
        <thead>
          <tr>
            <th>Skill</th>
            <th>Average Rating</th>
            <th>Number of Employees</th>
          </tr>
        </thead>
        <tbody>
          {skillData.map(({ skill, averageRating, employeeCount }) => (
            <tr key={skill}>
              <td>{skill}</td>
              <td>{averageRating}</td>
              <td>{employeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSkill;
