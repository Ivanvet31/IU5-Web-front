import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';
import type { DsRequestDTO, DsUpdateRequestDetailsRequest, DsUpdateRequestStrategyRequest } from '../../api/Api';

interface RequestState {
    list: DsRequestDTO[];                 
    currentRequest: DsRequestDTO | null;  
    loading: boolean;
    error: string | null;
    operationSuccess: boolean;            
}

const initialState: RequestState = {
    list: [],
    currentRequest: null,
    loading: false,
    error: null,
    operationSuccess: false,
};

// 1. Получение списка
export const fetchRequestsList = createAsyncThunk(
    'requests/fetchList',
    async (filters: { status?: string; from?: string; to?: string } = {}, { rejectWithValue }) => {
        try {
            const response = await api.recoveryRequests.recoveryRequestsList(filters);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка загрузки списка');
        }
    }
);

// 2. Получение заявки по ID
export const fetchRequestById = createAsyncThunk(
    'requests/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.recoveryRequests.recoveryRequestsDetail(id);
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Не удалось загрузить заявку');
        }
    }
);

// 3. Обновление параметров заявки
export const updateRequestDetails = createAsyncThunk(
    'requests/updateDetails',
    async ({ id, data }: { id: number; data: DsUpdateRequestDetailsRequest }, { rejectWithValue }) => {
        try {
            await api.recoveryRequests.recoveryRequestsUpdate(id, data);
            return data;
        } catch (err: any) {
            return rejectWithValue('Ошибка сохранения данных');
        }
    }
);

// 4. Обновление параметров стратегии
export const updateRequestStrategy = createAsyncThunk(
    'requests/updateStrategy',
    async ({ requestId, strategyId, data }: { requestId: number; strategyId: number; data: DsUpdateRequestStrategyRequest }, { rejectWithValue }) => {
        try {
            await api.recoveryRequests.strategiesUpdate(requestId, strategyId, data);
            return { strategyId, ...data };
        } catch (err) {
            return rejectWithValue('Не удалось обновить параметры стратегии');
        }
    }
);

// 5. Удаление стратегии из заявки
export const removeStrategyFromRequest = createAsyncThunk(
    'requests/removeStrategy',
    async ({ requestId, strategyId }: { requestId: number; strategyId: number }, { rejectWithValue }) => {
        try {
            await api.recoveryRequests.strategiesDelete(requestId, strategyId);
            return strategyId;
        } catch (err) {
            return rejectWithValue('Ошибка удаления стратегии');
        }
    }
);

// 6. Сформировать заявку
export const submitRequest = createAsyncThunk(
    'requests/submit',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.recoveryRequests.formUpdate(id);
            return id;
        } catch (err: any) {
            return rejectWithValue('Ошибка формирования');
        }
    }
);

// 7. Удалить заявку
export const deleteRequest = createAsyncThunk(
    'requests/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.recoveryRequests.recoveryRequestsDelete(id);
            return id;
        } catch (err) {
            return rejectWithValue('Ошибка удаления');
        }
    }
);

// 8. Резолюция заявки (Одобрить/Отклонить) - НОВОЕ
export const resolveRequest = createAsyncThunk(
    'requests/resolve',
    async ({ id, action }: { id: number; action: string }, { rejectWithValue }) => {
        try {
            // action: "complete" или "reject"
            // Метод resolveUpdate должен появиться в Api.ts после генерации
            await api.recoveryRequests.resolveUpdate(id, { action });
            return { id, status: action === 'complete' ? 'completed' : 'rejected' };
        } catch (err: any) {
            return rejectWithValue('Ошибка при изменении статуса заявки');
        }
    }
);

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        resetOperationSuccess: (state) => {
            state.operationSuccess = false;
        },
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestsList.pending, (state) => { 
                // Не ставим loading=true при каждом поллинге, чтобы список не моргал
                if (state.list.length === 0) state.loading = true; 
            })
            .addCase(fetchRequestsList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || [];
            })
            .addCase(fetchRequestById.pending, (state) => { 
                state.loading = true; 
                state.currentRequest = null; 
                state.error = null;
            })
            .addCase(fetchRequestById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRequest = action.payload;
            })
            .addCase(fetchRequestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка загрузки';
            })
            .addCase(updateRequestDetails.fulfilled, (state, action) => {
                if (state.currentRequest) {
                    Object.assign(state.currentRequest, action.payload);
                }
            })
            .addCase(removeStrategyFromRequest.fulfilled, (state, action) => {
                if (state.currentRequest && state.currentRequest.strategies) {
                    state.currentRequest.strategies = state.currentRequest.strategies.filter(s => s.id !== action.payload);
                }
            })
            .addCase(submitRequest.fulfilled, (state) => { state.operationSuccess = true; })
            .addCase(deleteRequest.fulfilled, (state) => { state.operationSuccess = true; })
            
            // Обработка резолюции
            .addCase(resolveRequest.fulfilled, (state, action) => {
                const req = state.list.find(r => r.id === action.payload.id);
                if (req) {
                    req.status = action.payload.status;
                    // Если одобрено, сбрасываем время, чтобы показать спиннер ожидания
                    if (action.payload.status === 'completed') {
                        req.calculated_recovery_time_hours = undefined; 
                    }
                }
            })

            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export const { resetOperationSuccess, clearCurrentRequest } = requestSlice.actions;
export default requestSlice.reducer;