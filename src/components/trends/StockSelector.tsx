import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { PortfolioStock } from '../../types/stock';

interface StockSelectorProps {
  stocks: PortfolioStock[];
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

export const StockSelector: React.FC<StockSelectorProps> = ({
  stocks,
  selectedSymbol,
  onSymbolChange,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedSymbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="appearance-none w-full md:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {stocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol} - {stock.quantity} shares
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  );
};