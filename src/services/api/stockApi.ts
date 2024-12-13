import { API_CONFIG } from './config';
import { apiRequest } from './client';
import { Stock, StockSymbol, HistoricalData } from '../../types/stock';
import { StockError } from './errors';

export async function searchStockSymbols(keywords: string): Promise<StockSymbol[]> {
  if (!keywords.trim()) return [];

  try {
    const data = await apiRequest(API_CONFIG.ENDPOINTS.SEARCH, {
      keywords: keywords.trim(),
    });

    const matches = data.bestMatches;
    if (!matches) return [];

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
    throw new StockError('Failed to search stock symbols. Please try again.');
  }
}

export async function fetchStockData(symbol: string): Promise<Stock> {
  if (!symbol) {
    throw new StockError('Stock symbol is required');
  }

  try {
    const data = await apiRequest(API_CONFIG.ENDPOINTS.QUOTE, {
      symbol: symbol.trim().toUpperCase(),
    });

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new StockError(`No data found for symbol ${symbol}. Please check and try again.`);
    }

    return {
      symbol: quote['01. symbol'],
      currentPrice: Number(quote['05. price']) || 0,
      previousClose: Number(quote['08. previous close']) || 0,
      change: Number(quote['09. change']) || 0,
      changePercent: Number(quote['10. change percent'].replace('%', '')) || 0,
      volume: Number(quote['06. volume']) || 0,
    };
  } catch (error) {
    if (error instanceof StockError) {
      throw error;
    }
    throw new StockError(`Failed to fetch data for ${symbol}. Please try again.`);
  }
}

export async function fetchHistoricalData(
  symbol: string,
  days: number = 7
): Promise<HistoricalData[]> {
  if (!symbol) {
    throw new StockError('Stock symbol is required');
  }

  try {
    const data = await apiRequest(API_CONFIG.ENDPOINTS.DAILY, {
      symbol: symbol.trim().toUpperCase(),
    });

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      throw new StockError(`No historical data available for ${symbol}.`);
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
    throw new StockError(`Failed to fetch historical data for ${symbol}. Please try again.`);
  }
}