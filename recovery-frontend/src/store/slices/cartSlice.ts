import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';

interface CartState {
    requestId: number | null; // ID черновика
    count: number;            // Количество услуг в корзине
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    requestId: null,
    count: 0,
    loading: false,
    error: null,
};

// Получение бейджика (количество товаров в корзине)
export const fetchCartBadge = createAsyncThunk(
    'cart/fetchBadge',
    async (_, { rejectWithValue }) => {
        try {
            // ИСПРАВЛЕНО: используем правильный путь из сгенерированного Api.ts
            const response = await api.recoveryRequests.cartList();
            return response.data;
        } catch (error) {
            // Если 401 или другая ошибка - просто игнорируем, корзина пуста
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

// Добавление стратегии в черновик
export const addStrategyToDraft = createAsyncThunk(
    'cart/addStrategy',
    async (strategyId: number, { dispatch, rejectWithValue }) => {
        try {
            // ИСПРАВЛЕНО: используем правильный путь из сгенерированного Api.ts
            await api.recoveryRequests.draftStrategiesCreate(strategyId);
            
            // После успешного добавления обновляем бейджик
            dispatch(fetchCartBadge());
            return strategyId;
        } catch (error: any) {
            const msg = error.response?.data?.error || "Ошибка при добавлении стратегии";
            alert(msg); 
            return rejectWithValue(msg);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartBadge.fulfilled, (state, action) => {
                state.count = action.payload.count || 0;
                state.requestId = action.payload.request_id || null;
            })
            .addCase(fetchCartBadge.rejected, (state) => {
                state.count = 0;
                state.requestId = null;
            })
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export default cartSlice.reducer;