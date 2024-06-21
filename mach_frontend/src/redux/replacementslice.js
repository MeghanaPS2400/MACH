// replacementSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReplacementData = createAsyncThunk(
  'replacement/fetchReplacementData',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/mach/replacement_finder/?', {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch replacement data');
    }
  }
);

const initialState = {
  overallrating:[],
  nearestMatches: [],
  filteredMatches: [],
  selectedName: [],
  selectedAccount: [],
  selectedDesignation: [],
  selectedSkills: [],
  skillAvgRatings: {},
  filteredSkills: {},
  dropdownOptions: {
    names: [],
    accounts: [],
    designations: [],
    skills: [],
  },
  ratingFilter: 0,
  status: 'idle',
  error: null,
};

const replacementSlice = createSlice({
  name: 'replacement',
  initialState,
  reducers: {
    setSelectedName(state, action) {
      state.selectedName = action.payload;
    },
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
    setSelectedDesignation(state, action) {
      state.selectedDesignation = action.payload;
    },
    setSelectedSkills(state, action) {
      state.selectedSkills = action.payload;
    },
    setFilteredSkills(state, action) {
      state.filteredSkills = action.payload;
    },
    setRatingFilter(state, action) {
      state.ratingFilter = action.payload;
    },
    clearAllFilters(state) {
      state.selectedName = [];
      state.selectedAccount = [];
      state.selectedDesignation = [];
      state.selectedSkills = [];
      state.filteredSkills = {};
      state.filteredMatches = state.nearestMatches;
      state.ratingFilter = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReplacementData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReplacementData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nearestMatches = action.payload.nearest_matches;
        state.filteredMatches = action.payload.nearest_matches;
        state.skillAvgRatings = action.payload.skill_avg_ratings;
        state.overallrating = action.payload.overall_average_rating;

        const designations = Array.from(new Set(state.nearestMatches.map((item) => item.designation))).sort();
        const names = Array.from(new Set(state.nearestMatches.map((item) => item.name))).sort();
        const accounts = Array.from(new Set(state.nearestMatches.map((item) => item.account))).sort();
        const skills = Object.keys(state.skillAvgRatings).sort();

        state.dropdownOptions = { designations, names, accounts, skills };
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
