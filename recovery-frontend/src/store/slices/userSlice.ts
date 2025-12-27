import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { 
    DsUserLoginRequest, 
    DsUserRegisterRequest, 
    DsUserDTO, 
    DsUpdateUserRequest
} from '../../api/Api';

interface UserState {
    user: DsUserDTO | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registerSuccess: boolean;
}

// 1. Читаем данные из браузера при запуске
const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: UserState = {
    // Если данные есть, сразу восстанавливаем их в стейт
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

            if (data.token) {
                // 2. Сохраняем токен и данные юзера
                localStorage.setItem('authToken', data.token);
                if (data.user) {
                    localStorage.setItem('userInfo', JSON.stringify(data.user));
                }
            }
            
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
            // 3. Чистим всё при выходе
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.users.getUsers();
            // Обновляем данные в сторадже, если они изменились на сервере
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return response.data;
        } catch (err: any) {
            return rejectWithValue('Ошибка получения профиля');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: DsUpdateUserRequest, { rejectWithValue, getState }) => {
        try {
            await api.users.putUsers(data);
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
                state.isAuthenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                // Если токен протух, чистим данные
                state.isAuthenticated = false;
                state.token = null;
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
            })
            // Update Profile
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    if (action.payload.username) state.user.username = action.payload.username;
                    // 4. Обновляем userInfo в localStorage при изменении данных
                    localStorage.setItem('userInfo', JSON.stringify(state.user));
                }
            });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;