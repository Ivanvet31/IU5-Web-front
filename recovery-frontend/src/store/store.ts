import { configureStore } from '@reduxjs/toolkit';
import strategiesReducer from './slices/strategiesSlice';

export const store = configureStore({
  reducer: {
    strategies: strategiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
