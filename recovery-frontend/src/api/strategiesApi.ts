import type { IPaginatedStrategies, IStrategy, ICartBadge } from '../types';
import { STRATEGIES_MOCK } from './mock';


const API_PREFIX = '/api';

// Получение списка стратегий с фильтрацией по названию
export const getStrategies = async (title: string): Promise<IPaginatedStrategies> => {
  const url = title 
    ? `${API_PREFIX}/strategies?title=${encodeURIComponent(title)}`
    : `${API_PREFIX}/strategies`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    const data = await response.json();
    
    console.log('Backend response:', data); // Для отладки
    
    // Go возвращает массив напрямую, а не объект с items
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
    const response = await fetch(`${API_PREFIX}/strategies/${id}`);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    const data = await response.json();
    console.log('Backend strategy response:', data); // Для отладки
    return data;
  } catch (error) {
    console.warn(`Failed to fetch strategy ${id}, using mock data.`, error);
    const strategy = STRATEGIES_MOCK.items.find(s => s.id === parseInt(id));
    return strategy || null;
  }
};

// Получение корзины
export const getCartBadge = async (): Promise<ICartBadge> => {
    try {

        const response = await fetch(`${API_PREFIX}/cart`);

        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }
        return await response.json();

    } catch (error) {
        console.warn('Could not fetch cart data, assuming cart is empty.', error);
        return { strategy_id: null, count: 0 };
    }
};