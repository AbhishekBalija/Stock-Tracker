import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { ModernStockChart } from '../components/trends/ModernStockChart';
import { StockSelector } from '../components/trends/StockSelector';
import { TimeframeSelector } from '../components/trends/TimeframeSelector';
import { StockStats } from '../components/trends/StockStats';
import { fetchHistoricalData, fetchStockData } from '../services/api';
import type { HistoricalData, Stock } from '../types/stock';

export const StockTrends: React.FC = () => {
  const { portfolio } = usePortfolio();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(7);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (portfolio.length > 0 && !selectedSymbol) {
      setSelectedSymbol(portfolio[0].symbol);
    }
  }, [portfolio]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSymbol) return;

      setLoading(true);
      setError(null);

      try {
        const [historical, current] = await Promise.all([
          fetchHistoricalData(selectedSymbol, selectedTimeframe),
          fetchStockData(selectedSymbol),
        ]);
        setHistoricalData(historical);
        setStockData(current);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSymbol, selectedTimeframe]);

  if (portfolio.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-gray-600 mb-2">No stocks in your portfolio</p>
        <p className="text-sm text-gray-500">Add stocks to view their trends</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Stock Trends</h1>
          <p className="text-gray-500">Track your portfolio performance over time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <StockSelector
            stocks={portfolio}
            selectedSymbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
          />
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {stockData && <StockStats stock={stockData} />}
          <ModernStockChart data={historicalData} symbol={selectedSymbol} />
        </>
      )}
    </div>
  );
};