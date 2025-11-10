// src/config.ts

// IP вашего Go бэкенда. Убедитесь, что он доступен.
const BACKEND_IP = 'http://localhost:8080';
const MINIO_IP = 'http://localhost:9000';

// Функция для определения базового URL API
export const getApiBase = (): string => {
    // @ts-ignore: TypeScript не знает о глобальной переменной __TAURI__
    const isTauri = !!window.__TAURI__;

    // В Tauri-приложении используем полный URL, в браузере - относительный для прокси
    return isTauri ? `${BACKEND_IP}/api` : '/api';
};

// Функция для определения базового URL изображений
export const getImageBase = (): string => {
    // @ts-ignore
    const isTauri = !!window.__TAURI__;
    
    // В Tauri используем полный URL, в браузере - относительный путь (если Minio тоже проксируется)
    // или полный, если CORS на Minio настроен. Для простоты оставим полный.
    return isTauri ? `${MINIO_IP}` : 'http://localhost:9000';
};