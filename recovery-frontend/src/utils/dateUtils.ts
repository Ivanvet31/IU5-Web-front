// src/utils/dateUtils.ts

export const formatDateTimeRU = (dateString?: string): string => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};

export const formatDateRU = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// НОВАЯ ФУНКЦИЯ: Преобразует '2025-10-25' в '25.10.2025'
export const isoToRu = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
};