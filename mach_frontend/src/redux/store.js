import { configureStore } from '@reduxjs/toolkit';
import replacementReducer from './replacementslice.js';

const store = configureStore({
  reducer: {
    replacement: replacementReducer,
  },
});

export default store;
