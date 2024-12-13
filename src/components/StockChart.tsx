import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HistoricalData } from '../types/stock';
import { formatCurrency } from '../utils/formatters';

interface StockChartProps {
  data: HistoricalData[];
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{symbol} Price History</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Price']}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};