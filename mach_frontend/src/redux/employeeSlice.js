// employeeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from './axiosInstance';

// Create async thunk for fetching data
export const fetchData = createAsyncThunk(
  'users/fetchUsers',
  async (queryParams = '') => {
    try {
      const response = await AxiosInstance.get(`http://127.0.0.1:8000/mach/employees_skill_screen/${queryParams}`);
      console.log('fetching')
      console.log('Data fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      throw Error(error.response.data.message); // Throw specific error message if Axios request fails
    }
  }
);

const employeeSlice = createSlice({
  name: 'users',
  initialState: {
    users: [], // Ensure users is initialized as an empty array
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
        
        state.error = null; // Clear any previous errors when starting to fetch data
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming action.payload is structured correctly as an array
        state.users = action.payload;
        state.error = null; // Clear any previous errors upon successful data fetch
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Set error message if data fetch fails
      });
  },
});

export default employeeSlice.reducer;
