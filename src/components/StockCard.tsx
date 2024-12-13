import React from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Stock } from '../types/stock';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface StockCardProps {
  stock: Stock;
  onRemove?: (symbol: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onRemove }) => {
  const isPositive = stock.change >= 0;

  return (
    <Card className="group">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(stock.currentPrice)}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium",
              isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500">
            Vol: {formatNumber(stock.volume)}
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(stock.symbol)}
              icon={<Trash2 size={16} />}
            >
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};