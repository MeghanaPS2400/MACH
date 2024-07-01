import React from 'react';
import TablePagination from '@mui/material/TablePagination';

const Pagination = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default Pagination;
