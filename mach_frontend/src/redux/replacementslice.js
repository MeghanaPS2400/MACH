import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReplacementData = createAsyncThunk(
  'replacement/fetchReplacementData',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/mach/replacement_finder/?');
    return response.data;
  }
);
//
const replacementSlice = createSlice({
  name: 'replacement',
  initialState: {
    nearestMatches: [],
    filteredMatches: [],
    selectedName: [],
    selectedAccount: [],
    selectedDesignation: [],
    selectedSkills: [],
    skillAvgRatings: {},
    filteredSkills: {},
    ratingFilter: 0,
    dropdownOptions: {
      names: [],
      accounts: [],
      designations: [],
      skills: [],
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedName: (state, action) => {
      state.selectedName = action.payload;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setSelectedDesignation: (state, action) => {
      state.selectedDesignation = action.payload;
    },
    setSelectedSkills: (state, action) => {
      state.selectedSkills = action.payload;
    },
    setRatingFilter: (state, action) => {
      state.ratingFilter = action.payload;
    },
    setFilteredSkills: (state, action) => {
      state.filteredSkills = action.payload;
    },
    setFilteredMatches: (state, action) => {
      state.filteredMatches = action.payload;
    },
    clearAllFilters: (state) => {
      state.selectedName = [];
      state.selectedAccount = [];
      state.selectedDesignation = [];
      state.selectedSkills = [];
      state.ratingFilter = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReplacementData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReplacementData.fulfilled, (state, action) => {
        const { skill_avg_ratings, nearest_matches } = action.payload;
        state.nearestMatches = nearest_matches;
        state.skillAvgRatings = skill_avg_ratings;
        state.status = 'succeeded';

        const designations = Array.from(new Set(nearest_matches.map((item) => item.designation))).sort();
        const names = Array.from(new Set(nearest_matches.map((item) => item.name))).sort();
        const accounts = Array.from(new Set(nearest_matches.map((item) => item.account))).sort();
        const skills = Object.keys(skill_avg_ratings).sort();

        state.dropdownOptions = { designations, names, accounts, skills };
        state.filteredMatches = nearest_matches;
      })
      .addCase(fetchReplacementData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedName,
  setSelectedAccount,
  setSelectedDesignation,
  setSelectedSkills,
  setRatingFilter,
  setFilteredSkills,
  setFilteredMatches,
  clearAllFilters,
} = replacementSlice.actions;

export default replacementSlice.reducer;
