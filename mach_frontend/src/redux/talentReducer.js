// redux/talentReducer.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AxiosInstance from './axiosInstance';

export const fetchData = createAsyncThunk(
  'users/fetchUsers',
  async (queryParams = '') => {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/mach/talent_finder/${queryParams}`);
    return response.data;
  }
);

const talentSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload; // Update users array with fetched data
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default talentSlice.reducer;
