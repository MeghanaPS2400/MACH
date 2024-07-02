import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import logo from '../assets/logo.png';
import '../styles/main.css'; 
import { useLazyLogoutQuery } from "../redux/authorization.js";
 
const Layout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation(); // Get current location from React Router
  const [logout] = useLazyLogoutQuery();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const logoutHandler = () => {
    logout();
  
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  return (
    <>
      <header className="fixed-header">
        <img src={logo} alt="logo" />
        <nav>
          <ul className="menu">
            <li className={location.pathname === '/Components/executiesummary' ? 'active' : ''}>
              <Link to="/Components/executiesummary">Executive Summary</Link>
            </li>
            <li className={location.pathname === '/Components/talentfinder' ? 'active' : ''}>
              <Link to="/Components/talentfinder">Talent Finder</Link>
            </li>
            <li className={location.pathname === '/Components/sme' ? 'active' : ''}>
              <Link to="/Components/sme">SME</Link>
            </li>
            <li className={location.pathname === '/Components/replacement' ? 'active' : ''}>
              <Link to="/Components/replacement">Replacement Finder</Link>
            </li>
            <li className={location.pathname === '/Components/comparisionanalysis' ? 'active' : ''}>
              <Link to="/Components/comparisionanalysis">Comparison Analysis</Link>
            </li>
            <li className={location.pathname === '/Components/employeeskill' ? 'active' : ''}>
              <Link to="/Components/employeeskill">Employee Skill</Link>
            </li>
            <li
              onMouseEnter={handleMenuOpen}
              onMouseLeave={handleMenuClose}
              id="profile-menu"
              className={location.pathname === '/Login' ? 'active' : ''}
            >
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                className="profile-icon"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom', // Adjusted to align menu below icon
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose }}
                className="menu-class" // Added class for styling
              >
                <MenuItem onClick={handleMenuClose} className="profile-class">
                  <PersonIcon sx={{ marginRight: 1 }} />
                  <Link to="/Profile">Profile</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} className="admin-class">
                  <SupervisorAccountIcon sx={{ marginRight: 1 }} />
                  <Link to="/admin/userlist">Admin</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} className="logoutt-class">
                  <ExitToAppIcon sx={{ marginRight: 1 }} />
                  <Link to="/Login">Logout</Link>
                </MenuItem>
              </Menu>
            </li>
          </ul>
        </nav>
      </header>
     
      <div className="content-container">
        {children}
      </div>
    </>
  );
};
 
export default Layout;
 
