// Alpha Vantage API configuration
export const API_CONFIG = {
  BASE_URL: 'https://www.alphavantage.co/query',
  API_KEY: 'XOLA7URKCZHU7C9X', // Free API key with limited requests
  RATE_LIMIT_PER_MINUTE: 5,
  ENDPOINTS: {
    QUOTE: 'GLOBAL_QUOTE',
    SEARCH: 'SYMBOL_SEARCH',
    DAILY: 'TIME_SERIES_DAILY',
  },
};