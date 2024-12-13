export const calculateMovingAverage = (data: number[], period: number): number => {
  if (data.length < period) return data[data.length - 1];
  const sum = data.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
};

export const calculateMovingAverages = (data: HistoricalData[]): EnhancedHistoricalData[] => {
  const prices = data.map(item => item.price);
  
  return data.map((item, index) => {
    const pricesUpToIndex = prices.slice(0, index + 1);
    return {
      ...item,
      volume: Math.random() * 1000000 + 500000, // Placeholder since we don't have volume data
      high: item.price * (1 + Math.random() * 0.02), // Placeholder
      low: item.price * (1 - Math.random() * 0.02), // Placeholder
      ma5: calculateMovingAverage(pricesUpToIndex, 5),
      ma20: calculateMovingAverage(pricesUpToIndex, 20),
    };
  });
};