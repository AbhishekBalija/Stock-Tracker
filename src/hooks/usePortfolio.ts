import { useState, useEffect } from 'react';
import { PortfolioStock } from '../types/stock';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);

  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  const savePortfolio = (newPortfolio: PortfolioStock[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
  };

  const addStock = (stock: PortfolioStock) => {
    const existingStock = portfolio.find((s) => s.symbol === stock.symbol);
    if (existingStock) {
      const updatedPortfolio = portfolio.map((s) =>
        s.symbol === stock.symbol
          ? {
              ...s,
              quantity: s.quantity + stock.quantity,
              averagePrice:
                (s.averagePrice * s.quantity + stock.averagePrice * stock.quantity) /
                (s.quantity + stock.quantity),
            }
          : s
      );
      savePortfolio(updatedPortfolio);
    } else {
      savePortfolio([...portfolio, stock]);
    }
  };

  const removeStock = (symbol: string) => {
    const updatedPortfolio = portfolio.filter((stock) => stock.symbol !== symbol);
    savePortfolio(updatedPortfolio);
  };

  return {
    portfolio,
    addStock,
    removeStock,
  };
};