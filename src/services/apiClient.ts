import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { StockError } from './errors';

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      throw new StockError('API rate limit exceeded. Please try again in a minute.');
    }
    if (!error.response) {
      throw new StockError('Network error. Please check your connection.');
    }
    const message = error.response.data?.['Error Message'] || error.response.data?.['Note'] || defaultMessage;
    throw new StockError(message);
  }
  throw new StockError(defaultMessage);
};

export const createApiRequest = (endpoint: string, params: Record<string, string>) => {
  return axios.get(API_CONFIG.BASE_URL, {
    params: {
      function: endpoint,
      apikey: API_CONFIG.API_KEY,
      ...params,
    },
  });
};

export const checkRateLimitError = (data: any): void => {
  if (data['Note']) {
    throw new StockError('API rate limit exceeded. Please try again in a minute.');
  }
};