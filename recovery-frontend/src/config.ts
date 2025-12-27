// src/config.ts

// IP адрес сервера, где запущен Docker (Nginx, Go, Minio)
const SERVER_IP = '192.168.2.35';

// Nginx слушает порт 80, поэтому просто http://IP
const PROD_BACKEND_URL = `http://${SERVER_IP}`;

// Картинки тоже идут через Nginx (порт 80)
// Nginx перенаправляет запросы /recovery-images/ -> Minio:9000
const MINIO_URL = `http://${SERVER_IP}`;

export const getApiBase = (): string => {
    // Проверка: запущено ли это внутри Tauri (на случай если import.meta.env.PROD сработает не так)
    // @ts-ignore
    const isTauri = !!window.__TAURI_INTERNALS__ || !!window.__TAURI__;

    // В режиме сборки (npm run tauri:build) или внутри Tauri
    if (import.meta.env.PROD || isTauri) {
        // Прокси Vite нет, используем полный прямой адрес к Nginx
        return `${PROD_BACKEND_URL}/api`;
    } else {
        // В режиме разработки в браузере (npm run dev) работает Vite Proxy
        return '/api';
    }
};

export const getImageBase = (): string => {
    return MINIO_URL;
};

// Хелпер для получения полного пути к бакету с картинками
// Используется в AdminStrategiesPage.tsx для формирования ссылки
export const getStoragePath = (): string => {
    return `${getImageBase()}/recovery-images`;
};