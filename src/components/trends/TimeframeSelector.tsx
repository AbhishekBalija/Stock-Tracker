import React from 'react';
import { cn } from '../../utils/cn';

interface TimeframeSelectorProps {
  selectedTimeframe: number;
  onTimeframeChange: (days: number) => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
}) => {
  const timeframes = [
    { label: '1W', value: 7 },
    { label: '2W', value: 14 },
    { label: '1M', value: 30 },
    { label: '3M', value: 90 },
  ];

  return (
    <div className="flex space-x-2">
      {timeframes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onTimeframeChange(value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedTimeframe === value
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};