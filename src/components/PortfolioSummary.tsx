import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { PortfolioStock } from '../types/stock';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Card, CardContent } from './ui/Card';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <Card>
    <CardContent className="flex items-start space-x-4">
      <div className={cn(
        "p-2 rounded-lg",
        trend === 'up' ? 'bg-green-100 text-green-600' :
        trend === 'down' ? 'bg-red-100 text-red-600' :
        'bg-blue-100 text-blue-600'
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={cn(
          "text-2xl font-bold",
          trend === 'up' ? 'text-green-600' :
          trend === 'down' ? 'text-red-600' :
          'text-gray-900'
        )}>
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

interface PortfolioSummaryProps {
  portfolio: PortfolioStock[];
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio }) => {
  const totalValue = portfolio.reduce(
    (sum, stock) => sum + stock.currentPrice * stock.quantity,
    0
  );

  const totalGain = portfolio.reduce(
    (sum, stock) => sum + (stock.currentPrice - stock.averagePrice) * stock.quantity,
    0
  );

  const gainPercentage = (totalGain / (totalValue - totalGain)) * 100;
  const isPositive = totalGain >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Value"
        value={formatCurrency(totalValue)}
        icon={<Wallet size={24} />}
      />
      <StatCard
        title="Total Gain/Loss"
        value={formatCurrency(totalGain)}
        icon={isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
        trend={isPositive ? 'up' : 'down'}
      />
      <StatCard
        title="Return"
        value={formatPercentage(gainPercentage)}
        icon={<DollarSign size={24} />}
        trend={isPositive ? 'up' : 'down'}
      />
    </div>
  );
};