import { Api } from './Api';
import { getApiBase } from '../config';

export const api = new Api({
  baseURL: getApiBase(),
});

// Добавляем токен авторизации ко всем запросам
api.instance.interceptors.request.use((config) => {
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
        // Если не на странице логина, чистим и редиректим
        if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            // Жесткая перезагрузка на логин
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
  }
);