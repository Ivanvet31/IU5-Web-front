// src/api/strategiesApi.ts
import type { IPaginatedStrategies, IStrategy } from '../types';
import { STRATEGIES_MOCK } from './mock';
import { getApiBase } from '../config'; // <-- ИМПОРТ

const API_BASE = getApiBase(); // <-- ПОЛУЧАЕМ URL

// Получение списка стратегий с фильтрацией по названию
export const getStrategies = async (title: string): Promise<IPaginatedStrategies> => {
  const url = title
    ? `${API_BASE}/strategies?title=${encodeURIComponent(title)}`
    : `${API_BASE}/strategies`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    const data = await response.json();
    
    const items = Array.isArray(data) ? data : (data.items || []);
    
    return {
      items: items,
      total: items.length
    };
  } catch (error) {
    console.warn('Failed to fetch from backend, using mock data.', error);
    const filteredMockItems = STRATEGIES_MOCK.items.filter(strategy =>
      strategy.title.toLowerCase().includes(title.toLowerCase())
    );
    return { items: filteredMockItems, total: filteredMockItems.length };
  }
};

// Получение одной стратегии по ID
export const getStrategyById = async (id: string): Promise<IStrategy | null> => {
  try {
    const response = await fetch(`${API_BASE}/strategies/${id}`);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Failed to fetch strategy ${id}, using mock data.`, error);
    const strategy = STRATEGIES_MOCK.items.find(s => s.id === parseInt(id));
    return strategy || null;
  }
};