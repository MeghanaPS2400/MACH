import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './smeSlice';
import replacementReducer from './replacementslice.js';
import talentReducer from './talentReducer';
import authReducer from './autorizationslice.js';
import { authapi } from './authorization.js';
import employeeSlice from './employeeSlice.js'; // Make sure this imports correctly

const rootReducer = combineReducers({
  users: userReducer,
  replacement: replacementReducer,
  talent: talentReducer,
  employee: employeeSlice, 
  auth: authReducer,
  [authapi.reducerPath]: authapi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authapi.middleware),
});

export default store;
