import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { fetchStockData } from '../services/stockService';
import { StockError } from '../services/errors';
import type { Stock } from '../types/stock';

export const AddStock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addStock } = usePortfolio();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<Stock | null>(null);

  useEffect(() => {
    const navigationSymbol = (location.state as { symbol?: string })?.symbol;
    if (navigationSymbol) {
      setSymbol(navigationSymbol);
      handleSearch(navigationSymbol);
    }
  }, [location.state]);

  const handleSearch = async (searchSymbol?: string) => {
    const symbolToSearch = searchSymbol || symbol;
    if (!symbolToSearch.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setStockData(null);
    
    try {
      const data = await fetchStockData(symbolToSearch.toUpperCase().trim());
      setStockData(data);
    } catch (err) {
      if (err instanceof StockError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockData || !quantity) {
      setError('Please enter quantity');
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      addStock({
        ...stockData,
        quantity: parsedQuantity,
        averagePrice: stockData.currentPrice,
      });
      navigate('/');
    } catch (err) {
      setError('Failed to add stock to portfolio. Please try again.');
    }
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().trim();
    setSymbol(value);
    if (error) setError(null);
    if (stockData) setStockData(null);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    if (error) setError(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Stock to Portfolio</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={symbol}
              onChange={handleSymbolChange}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={5}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a valid stock symbol (e.g., AAPL, MSFT, GOOGL)
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {stockData && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{stockData.symbol}</h2>
            <p className="text-gray-600">Current Price: ${stockData.currentPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Daily Change: {stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max="999999"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!quantity || parseInt(quantity, 10) <= 0}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Portfolio
          </button>
        </form>
      )}
    </div>
  );
};