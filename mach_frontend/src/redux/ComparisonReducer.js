// redux/comparisonReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from './axiosInstance';

export const fetchComparison1Data = createAsyncThunk(
  'comparison/fetchComparison1Data',
  async (queryParams = '') => {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/mach/talent_finder/${queryParams}`);
    return response.data;
  }
);

export const fetchComparison2Data = createAsyncThunk(
  'comparison/fetchComparison2Data',
  async (queryParams = '') => {
    const response = await AxiosInstance.get(`http://127.0.0.1:8000/mach/talent_finder/${queryParams}`);
    return response.data;
  }
);

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    comparison1: {
      users1: [],
      status: 'idle',
      error: null,
    },
    comparison2: {
      users2: [],
      status: 'idle',
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComparison1Data.pending, (state) => {
        state.comparison1.status = 'loading';
      })
      .addCase(fetchComparison1Data.fulfilled, (state, action) => {
        state.comparison1.status = 'succeeded';
        state.comparison1.users1 = action.payload; // Ensure users1 is assigned
      })
      .addCase(fetchComparison1Data.rejected, (state, action) => {
        state.comparison1.status = 'failed';
        state.comparison1.error = action.error.message;
      })
      .addCase(fetchComparison2Data.pending, (state) => {
        state.comparison2.status = 'loading';
      })
      .addCase(fetchComparison2Data.fulfilled, (state, action) => {
        state.comparison2.status = 'succeeded';
        state.comparison2.users2 = action.payload; // Ensure users2 is assigned
      })
      .addCase(fetchComparison2Data.rejected, (state, action) => {
        state.comparison2.status = 'failed';
        state.comparison2.error = action.error.message;
      });
  },
});

export default comparisonSlice.reducer;
