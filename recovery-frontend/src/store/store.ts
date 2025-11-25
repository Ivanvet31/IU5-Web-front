import { configureStore } from '@reduxjs/toolkit';
import strategiesReducer from './slices/strategiesSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';       // Добавлено
import requestReducer from './slices/requestSlice'; // Добавлено

export const store = configureStore({
  reducer: {
    strategies: strategiesReducer,
    user: userReducer,
    cart: cartReducer,       // Добавлено
    requests: requestReducer // Добавлено
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;