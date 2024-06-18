import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './talentReducer';

const store = configureStore({
  reducer: {
   users: usersReducer
  }
});

export default store;
