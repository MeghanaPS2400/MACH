// store.js
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './smeSlice';
import replacementReducer from './replacementslice.js';
import talentReducer from './talentReducer';

const rootReducer = combineReducers({
  users: userReducer,
  replacement: replacementReducer,
  talent: talentReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
