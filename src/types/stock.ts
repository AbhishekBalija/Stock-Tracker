// Add to existing types
export interface EnhancedHistoricalData extends HistoricalData {
  volume: number;
  high: number;
  low: number;
  ma5: number;
  ma20: number;
}