// replacementSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const fetchReplacementData = createAsyncThunk(
  'replacement/fetchReplacementData',
  async (queryParams = '',{ rejectWithValue }) => {
    try{
    const response = await axios.get(`http://127.0.0.1:8000/mach/replacement_finder/${queryParams}`);
    return response.data;
    }
    catch (error) {
      return rejectWithValue('Failed to fetch replacement data');
    }
  }
);

const initialState = {
  overallrating:[],
 
  filteredMatches: [],
  
  skillAvgRatings: {},

  
  ratingFilter: 0,
  status: 'idle',
  error: null,
};

const replacementSlice = createSlice({
  name: 'replacement',
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReplacementData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReplacementData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        state.filteredMatches = action.payload.nearest_matches;
        state.skillAvgRatings = action.payload.skill_avg_ratings;
        state.overallrating = action.payload.overall_average_rating;

       
      })
      .addCase(fetchReplacementData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedName,
  setSelectedAccount,
  setSelectedDesignation,
  setSelectedSkills,
  setFilteredSkills,
  setRatingFilter,
  clearAllFilters,
} = replacementSlice.actions;

export default replacementSlice.reducer;
