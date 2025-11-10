import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getStrategies } from '../../api/strategiesApi';
import type { IStrategy } from '../../types';

interface StrategiesState {
  items: IStrategy[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: StrategiesState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
};

// Async thunk для загрузки стратегий
export const fetchStrategies = createAsyncThunk(
  'strategies/fetchStrategies',
  async (searchQuery: string = '') => {
    const response = await getStrategies(searchQuery);
    return response.items;
  }
);

const strategiesSlice = createSlice({
  name: 'strategies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearStrategies: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch strategies';
      });
  },
});

export const { setSearchQuery, clearStrategies } = strategiesSlice.actions;
export default strategiesSlice.reducer;
