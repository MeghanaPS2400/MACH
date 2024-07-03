import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "axios";
import AxiosInstance from "./axiosInstance";

export const FetchSummarydata= createAsyncThunk(
    'summary/fetchSummarydata',
    async (queryParams = '', { rejectWithValue }) => {
        try {
          const response = await AxiosInstance.get(`/mach/employee_statistics/${queryParams}`);
          return response.data;
        } catch (error) {
          return rejectWithValue('Failed to fetch replacement data');
        }
      }
);

const initialState={
     status:'idle',
     error:'null',
}

const Summaryslice= createSlice({
    name:'summary',
    initialState,
    reducers:{},

    extraReducers: (builder)=>{
        builder
        .addCase(FetchSummarydata.pending, (state)=>{
            state.status='loading';
        })

        .addCase(FetchSummarydata.fulfilled, (state)=>{
            state.status='succedded';
        })
        .addCase(FetchSummarydata.rejected,(state)=>{
            state.status='failed';
           
        })
    }
})

export default Summaryslice.reducer;