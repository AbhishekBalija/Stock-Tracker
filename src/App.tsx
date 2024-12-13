import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { AddStock } from './pages/AddStock';
import { StockTrends } from './pages/StockTrends';
import { StockSymbols } from './pages/StockSymbols';

// Create a layout component to avoid repetition
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navigation />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout><Dashboard /></Layout>,
    },
    {
      path: '/add-stock',
      element: <Layout><AddStock /></Layout>,
    },
    {
      path: '/trends',
      element: <Layout><StockTrends /></Layout>,
    },
    {
      path: '/symbols',
      element: <Layout><StockSymbols /></Layout>,
    },
  ],
  {
    basename: import.meta.env.BASE_URL, // This fixes the GitHub Pages routing issue
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;