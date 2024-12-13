export const API_CONFIG = {
  BASE_URL: 'https://www.alphavantage.co/query',
  API_KEY: 'XOLA7URKCZHU7C9X',
  RATE_LIMIT_PER_MINUTE: 5,
  ENDPOINTS: {
    QUOTE: 'GLOBAL_QUOTE',
    SEARCH: 'SYMBOL_SEARCH',
    DAILY: 'TIME_SERIES_DAILY',
  },
  CACHE_DURATION: 1000 * 60 * 5, // 5 minutes
};