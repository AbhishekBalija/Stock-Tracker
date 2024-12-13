import React from 'react';
import { format } from 'date-fns';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { EnhancedHistoricalData } from '../../types/stock';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload[0]) return null;

  const data: EnhancedHistoricalData = payload[0].payload;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-semibold text-gray-900 mb-2">
        {format(new Date(label || ''), 'MMM d, yyyy')}
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">Price</span>
          <span className="font-medium text-gray-900">{formatCurrency(data.price)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">High</span>
          <span className="font-medium text-gray-900">{formatCurrency(data.high)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">Low</span>
          <span className="font-medium text-gray-900">{formatCurrency(data.low)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">Volume</span>
          <span className="font-medium text-gray-900">{formatNumber(data.volume)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">MA(5)</span>
          <span className="font-medium text-blue-600">{formatCurrency(data.ma5)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <span className="text-gray-500">MA(20)</span>
          <span className="font-medium text-purple-600">{formatCurrency(data.ma20)}</span>
        </div>
      </div>
    </div>
  );
};