import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { DsStrategyDTO, DsCreateStrategyRequest, DsUpdateStrategyRequest } from '../../api/Api';

interface StrategiesState {
  items: DsStrategyDTO[];
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

// 1. Получение списка (уже было)
export const fetchStrategies = createAsyncThunk(
  'strategies/fetchStrategies',
  async (searchQuery: string = '', { rejectWithValue }) => {
    try {
      const response = await api.strategies.strategiesList({ title: searchQuery });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Не удалось загрузить стратегии');
    }
  }
);

// 2. Создание стратегии (НОВОЕ)
export const createStrategy = createAsyncThunk(
    'strategies/create',
    async (data: DsCreateStrategyRequest, { rejectWithValue }) => {
        try {
            const response = await api.strategies.strategiesCreate(data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка создания');
        }
    }
);

// 3. Обновление стратегии (НОВОЕ)
export const updateStrategy = createAsyncThunk(
    'strategies/update',
    async ({ id, data }: { id: number, data: DsUpdateStrategyRequest }, { rejectWithValue }) => {
        try {
            const response = await api.strategies.strategiesUpdate(id, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка обновления');
        }
    }
);

// 4. Удаление стратегии (НОВОЕ)
export const deleteStrategy = createAsyncThunk(
    'strategies/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.strategies.strategiesDelete(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка удаления');
        }
    }
);

// 5. Загрузка изображения (НОВОЕ)
export const uploadStrategyImage = createAsyncThunk(
    'strategies/uploadImage',
    async ({ id, file }: { id: number, file: File }, { rejectWithValue }) => {
        try {
            const response = await api.strategies.imageCreate(id, { file });
            // Сервер возвращает { image_url: string } (см. бэкенд)
            // Нам нужно обновить конкретную стратегию в стейте
            return { id, imageUrl: (response.data as any).image_url };
        } catch (err: any) {
            return rejectWithValue('Ошибка загрузки изображения');
        }
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
      // Fetch
      .addCase(fetchStrategies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createStrategy.fulfilled, (state, action) => {
          state.items.push(action.payload);
      })
      // Update
      .addCase(updateStrategy.fulfilled, (state, action) => {
          const index = state.items.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      // Delete
      .addCase(deleteStrategy.fulfilled, (state, action) => {
          state.items = state.items.filter(s => s.id !== action.payload);
      })
      // Image Upload Update
      .addCase(uploadStrategyImage.fulfilled, (state, action) => {
          const item = state.items.find(s => s.id === action.payload.id);
          if (item) {
              item.image_url = action.payload.imageUrl;
          }
      });
  },
});

export const { setSearchQuery, clearStrategies } = strategiesSlice.actions;
export default strategiesSlice.reducer;