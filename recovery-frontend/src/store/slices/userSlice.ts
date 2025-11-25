import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { 
    DsUserLoginRequest, 
    DsUserRegisterRequest, 
    DsUserDTO, 
    DsUpdateUserRequest // <-- Важно: этот тип должен быть импортирован
} from '../../api/Api';

interface UserState {
    user: DsUserDTO | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registerSuccess: boolean;
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
    registerSuccess: false,
};

// --- Thunks ---

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: DsUserLoginRequest, { rejectWithValue }) => {
        try {
            const response = await api.auth.loginCreate(credentials);
            const data = response.data;

            if (data.token) localStorage.setItem('authToken', data.token);
            if (data.user) localStorage.setItem('userInfo', JSON.stringify(data.user));

            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка авторизации');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: DsUserRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCreate(credentials);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка регистрации');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            await api.auth.logoutCreate();
        } catch (e) {
            console.warn('Logout API error', e);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.users.getUsers(); // В Api.ts это getUsers (GET /users/me)
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Ошибка получения профиля');
        }
    }
);

// ВОТ ЭТА ФУНКЦИЯ, КОТОРОЙ НЕ ХВАТАЛО
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: DsUpdateUserRequest, { rejectWithValue }) => {
        try {
            // PUT /users/me
            await api.users.putUsers(data);
            // Возвращаем данные, чтобы обновить стейт
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Ошибка обновления профиля');
        }
    }
);

// --- Slice ---

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        resetRegisterSuccess: (state) => { state.registerSuccess = false; }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token || null;
                state.user = action.payload.user || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Fetch Profile
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // Update Profile (Обработка обновления)
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    // Обновляем локальное состояние
                    if (action.payload.username) state.user.username = action.payload.username;
                    // Обновляем в localStorage
                    localStorage.setItem('userInfo', JSON.stringify(state.user));
                }
            });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;