import { Api } from './Api';
import { getApiBase } from '../config';

export const api = new Api({
  baseURL: getApiBase(),
});

// Добавляем токен авторизации ко всем запросам
api.instance.interceptors.request.use((config) => {
  // Читаем из localStorage
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка истечения токена (401)
api.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        if (!window.location.pathname.includes('/login')) {
            // Если токен невалиден — чистим всё и редиректим
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
  }
);