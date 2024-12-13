import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Stock } from '../../types/stock';
import { cn } from '../../utils/cn';

interface StockStatsProps {
  stock: Stock;
}

export const StockStats: React.FC<StockStatsProps> = ({ stock }) => {
  const stats = [
    {
      label: 'Current Price',
      value: formatCurrency(stock.currentPrice),
      icon: DollarSign,
    },
    {
      label: 'Previous Close',
      value: formatCurrency(stock.previousClose),
      icon: BarChart2,
    },
    {
      label: 'Change',
      value: formatCurrency(stock.change),
      icon: stock.change >= 0 ? TrendingUp : TrendingDown,
      trend: stock.change >= 0 ? 'up' : 'down',
    },
    {
      label: 'Change %',
      value: formatPercentage(stock.changePercent),
      icon: stock.changePercent >= 0 ? TrendingUp : TrendingDown,
      trend: stock.changePercent >= 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, trend }) => (
        <div
          key={label}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'p-2 rounded-lg',
                trend === 'up' ? 'bg-green-100 text-green-600' :
                trend === 'down' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              )}
            >
              <Icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  trend === 'up' ? 'text-green-600' :
                  trend === 'down' ? 'text-red-600' :
                  'text-gray-900'
                )}
              >
                {value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};