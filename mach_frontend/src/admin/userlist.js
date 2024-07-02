import React, { useState } from "react";
import { useGetAdminUsersQuery } from "../redux/authorization.js";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
import Navbar from '../others/Navbar';
import "./userlist.css"; // Import your CSS file
import Layout from "../others/Layout.js";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Update filtered users whenever data changes or search term changes
  React.useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filteredData);
    }
  }, [data, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const renderUsers = () => {
    const usersToRender = searchTerm ? filteredUsers : data;
    return usersToRender?.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.first_name}</TableCell>
        <TableCell>{user.surname}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell style={{ width:'15px'}}>
          <Link to={`/admin/users/${user.id}`} className="btn btn-outline-primary">
            <i className="fa fa-pencil fa-lg" >edit</i>
          </Link>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Layout>
    <div className="adminLayout">

      <div className="searchContainer">

        <Paper>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton disabled>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </div>
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderUsers()}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
    </Layout>
  );
};

export default ListUsers;
