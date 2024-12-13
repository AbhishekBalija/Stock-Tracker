import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { StockCard } from '../components/StockCard';
import { fetchStockData } from '../services/stockService';
import type { Stock } from '../types/stock';

export const Dashboard: React.FC = () => {
  const { portfolio, removeStock } = usePortfolio();
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        if (portfolio.length === 0) {
          setStockData([]);
          return;
        }

        const results: Stock[] = [];
        // Fetch stocks sequentially to respect rate limiting
        for (const stock of portfolio) {
          try {
            const data = await fetchStockData(stock.symbol);
            results.push(data);
          } catch (err) {
            console.error(`Failed to fetch data for ${stock.symbol}:`, err);
          }
        }
        setStockData(results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [portfolio]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to StockTracker</h2>
        <p className="text-gray-600 mb-8">Start by adding stocks to your portfolio</p>
        <Link
          to="/add-stock"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Your First Stock
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
        <Link
          to="/add-stock"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Stock
        </Link>
      </div>

      <PortfolioSummary portfolio={portfolio} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stockData.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onRemove={removeStock}
          />
        ))}
      </div>
    </div>
  );
};