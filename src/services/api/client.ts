import axios from 'axios';
import { API_CONFIG } from './config';
import { rateLimiter } from './rateLimiter';
import { apiCache } from './cache';
import { StockError } from './errors';
import { withRetry, DEFAULT_RETRY_CONFIG } from './retry';

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000, // 10 second timeout
});

export async function apiRequest<T>(
  endpoint: string,
  params: Record<string, string>,
  skipCache = false
): Promise<T> {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  
  if (!skipCache) {
    const cachedData = apiCache.get<T>(cacheKey);
    if (cachedData) return cachedData;
  }

  return withRetry(async () => {
    try {
      await rateLimiter.enforce();
      
      const response = await client.get('', {
        params: {
          function: endpoint,
          apikey: API_CONFIG.API_KEY,
          ...params,
        },
      });

      if (response.data['Note']) {
        if (response.data['Note'].includes('Thank you for using Alpha Vantage')) {
          throw new StockError('API rate limit exceeded. Please try again in a minute.');
        }
        throw new StockError(response.data['Note']);
      }

      if (response.data['Error Message']) {
        throw new StockError(response.data['Error Message']);
      }

      // Only cache successful responses
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new StockError('Request timed out. Please try again.');
        }
        if (!error.response) {
          throw new StockError('Network error. Please check your connection.');
        }
        if (error.response.status === 429) {
          throw new StockError('API rate limit exceeded. Please try again in a minute.');
        }
        if (error.response.status >= 500) {
          throw new StockError('Server error. Please try again later.');
        }
        const message = error.response.data?.['Error Message'] || 
                       error.response.data?.['Note'] || 
                       'An unexpected error occurred';
        throw new StockError(message);
      }
      throw new StockError('An unexpected error occurred');
    }
  }, DEFAULT_RETRY_CONFIG);
}