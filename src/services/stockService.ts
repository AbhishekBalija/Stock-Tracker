import { Stock, HistoricalData, StockSymbol } from '../types/stock';
import { API_CONFIG } from '../config/api';
import { StockError } from './errors';
import { RateLimiter } from './rateLimiter';
import axios from 'axios';

const rateLimiter = new RateLimiter(API_CONFIG.RATE_LIMIT_PER_MINUTE);

const handleApiError = (error: unknown, defaultMessage: string): never => {
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

export const searchStockSymbols = async (keywords: string): Promise<StockSymbol[]> => {
  if (!keywords.trim()) {
    return [];
  }

  try {
    await rateLimiter.enforce();
    
    const response = await axios.get(API_CONFIG.BASE_URL, {
      params: {
        function: API_CONFIG.ENDPOINTS.SEARCH,
        keywords: keywords.trim(),
        apikey: API_CONFIG.API_KEY,
      },
    });

    if (response.data['Note']) {
      throw new StockError('API rate limit exceeded. Please try again in a minute.');
    }

    const matches = response.data.bestMatches;
    if (!matches) {
      return [];
    }

    return matches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
    }));
  } catch (error) {
    if (error instanceof StockError) {
      throw error;
    }
    handleApiError(error, 'Failed to search stock symbols');
  }
};

export const fetchStockData = async (symbol: string): Promise<Stock> => {
  if (!symbol) {
    throw new StockError('Stock symbol is required');
  }

  try {
    await rateLimiter.enforce();
    
    const response = await axios.get(API_CONFIG.BASE_URL, {
      params: {
        function: API_CONFIG.ENDPOINTS.QUOTE,
        symbol: symbol.trim().toUpperCase(),
        apikey: API_CONFIG.API_KEY,
      },
    });

    if (response.data['Note']) {
      throw new StockError('API rate limit exceeded. Please try again in a minute.');
    }

    const data = response.data['Global Quote'];
    if (!data || Object.keys(data).length === 0) {
      throw new StockError('Stock symbol not found. Please check and try again.');
    }

    return {
      symbol: data['01. symbol'],
      currentPrice: Number(data['05. price']) || 0,
      previousClose: Number(data['08. previous close']) || 0,
      change: Number(data['09. change']) || 0,
      changePercent: Number(data['10. change percent'].replace('%', '')) || 0,
      volume: Number(data['06. volume']) || 0,
    };
  } catch (error) {
    if (error instanceof StockError) {
      throw error;
    }
    handleApiError(error, 'Failed to fetch stock data');
  }
};

export const fetchHistoricalData = async (
  symbol: string,
  days: number = 7
): Promise<HistoricalData[]> => {
  if (!symbol) {
    throw new StockError('Stock symbol is required');
  }

  try {
    await rateLimiter.enforce();
    
    const response = await axios.get(API_CONFIG.BASE_URL, {
      params: {
        function: API_CONFIG.ENDPOINTS.DAILY,
        symbol: symbol.trim().toUpperCase(),
        apikey: API_CONFIG.API_KEY,
      },
    });

    if (response.data['Note']) {
      throw new StockError('API rate limit exceeded. Please try again in a minute.');
    }
    
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      throw new StockError('Historical data not available for this symbol.');
    }

    return Object.entries(timeSeries)
      .slice(0, days)
      .map(([date, values]: [string, any]) => ({
        date,
        price: Number(values['4. close']) || 0,
      }));
  } catch (error) {
    if (error instanceof StockError) {
      throw error;
    }
    handleApiError(error, 'Failed to fetch historical data');
  }
};