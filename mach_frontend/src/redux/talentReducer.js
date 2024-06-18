import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 
const initialState = {
  users: [],
  status: 'idle',
  error: null
};
 
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://127.0.0.1:8000/mach/talent_finder/?');
  return response.data;
});
 
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});
 
export default userSlice.reducer;
 