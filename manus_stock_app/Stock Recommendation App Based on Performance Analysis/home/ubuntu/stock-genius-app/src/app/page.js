'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkApiHealth } from '../lib/api/realYahooFinance';

export default function Home() {
  const [symbol, setSymbol] = useState('');
  const [months, setMonths] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const router = useRouter();

  // Check API health on component mount
  useState(() => {
    const checkHealth = async () => {
      try {
        await checkApiHealth();
        setApiStatus('connected');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('disconnected');
      }
    };
    
    checkHealth();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol) return;
    
    setIsLoading(true);
    
    // Navigate to analysis page with query parameters
    router.push(`/analysis?symbol=${symbol.toUpperCase()}&months=${months}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Stock Market Genius Analyzer
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Get stock recommendations based on Joel Greenblatt&apos;s principles from 
          &quot;You Can Be a Stock Market Genius&quot;
        </p>
        
        {apiStatus === 'checking' && (
          <div className="text-center mb-4 text-yellow-600">
            Connecting to analysis service...
          </div>
        )}
        
        {apiStatus === 'disconnected' && (
          <div className="text-center mb-4 text-red-600">
            Warning: Analysis service is unavailable. Please try again later.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Ticker Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., AAPL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-1">
              Analysis Timeframe (months)
            </label>
            <select
              id="months"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="60">5 years</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || apiStatus !== 'connected'}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading || apiStatus !== 'connected'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Stock'}
          </button>
        </form>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Using real-time data from Yahoo Finance</p>
          <p className="mt-1">
            Based on principles from &quot;You Can Be a Stock Market Genius&quot; by Joel Greenblatt
          </p>
        </div>
      </div>
    </main>
  );
}
