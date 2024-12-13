import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Brush,
} from 'recharts';
import { format } from 'date-fns';
import { ChartTooltip } from './ChartTooltip';
import { calculateMovingAverages } from '../../utils/stockCalculations';
import type { HistoricalData } from '../../types/stock';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface ModernStockChartProps {
  data: HistoricalData[];
  symbol: string;
}

export const ModernStockChart: React.FC<ModernStockChartProps> = ({
  data,
  symbol,
}) => {
  const [opacity, setOpacity] = useState({
    price: 1,
    ma5: 1,
    ma20: 1,
    volume: 1,
  });

  const enhancedData = calculateMovingAverages(data);

  const handleLegendClick = (dataKey: keyof typeof opacity) => {
    setOpacity(prev => ({
      ...prev,
      [dataKey]: prev[dataKey] === 0 ? 1 : 0,
    }));
  };

  const renderLegend = () => (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {[
        { key: 'price', color: '#3B82F6', label: 'Price' },
        { key: 'ma5', color: '#2563EB', label: '5-Day MA' },
        { key: 'ma20', color: '#7C3AED', label: '20-Day MA' },
        { key: 'volume', color: '#9CA3AF', label: 'Volume' },
      ].map(({ key, color, label }) => (
        <button
          key={key}
          onClick={() => handleLegendClick(key as keyof typeof opacity)}
          className="flex items-center space-x-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: color,
              opacity: opacity[key as keyof typeof opacity],
            }}
          />
          <span
            className="text-sm"
            style={{
              opacity: opacity[key as keyof typeof opacity] === 0 ? 0.5 : 1,
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{symbol} Price History</h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={enhancedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              stroke="#6B7280"
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => formatCurrency(value)}
              domain={['auto', 'auto']}
              stroke="#6B7280"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => formatNumber(value)}
              stroke="#9CA3AF"
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              fillOpacity={opacity.price}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ma5"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              opacity={opacity.ma5}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ma20"
              stroke="#7C3AED"
              strokeWidth={2}
              dot={false}
              opacity={opacity.ma20}
            />
            <Bar
              yAxisId="right"
              dataKey="volume"
              fill="#9CA3AF"
              opacity={opacity.volume * 0.3}
            />
            <Brush
              dataKey="date"
              height={30}
              stroke="#3B82F6"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
            />
            <Legend content={renderLegend} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};