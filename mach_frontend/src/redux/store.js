import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './smeSlice';
import replacementReducer from './replacementslice.js';
import talentReducer from './talentReducer';
import authReducer from './autorizationslice.js';
import { authapi } from './authorization.js';

const rootReducer = combineReducers({
  users: userReducer,
  replacement: replacementReducer,
  talent: talentReducer,
  auth: authReducer, // Add authReducer here
  [authapi.reducerPath]: authapi.reducer, // Add authapi reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authapi.middleware), // Add authapi middleware
});

export default store;
