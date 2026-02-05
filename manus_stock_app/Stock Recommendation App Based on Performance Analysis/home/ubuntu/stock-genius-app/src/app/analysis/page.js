'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeStock } from '../../lib/api/realYahooFinance';

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const months = Number(searchParams.get('months') || 12);
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!symbol) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await analyzeStock(symbol, months);
        setAnalysis(result);
      } catch (err) {
        console.error('Error analyzing stock:', err);
        setError('Failed to analyze stock. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [symbol, months]);

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'BUY':
        return 'text-green-600';
      case 'SELL':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Moderate';
    if (confidence >= 20) return 'Low';
    return 'Very Low';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-green-400';
    if (confidence >= 40) return 'bg-yellow-400';
    if (confidence >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Stock Analysis Results
        </h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Analyzing {symbol}...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        )}
        
        {!loading && !error && analysis && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{symbol}</h2>
              <div className="text-sm text-gray-500">
                Analysis timeframe: {months} {months === 1 ? 'month' : 'months'}
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Recommendation</h3>
                  <p className={`text-2xl font-bold ${getRecommendationColor(analysis.recommendation)}`}>
                    {analysis.recommendation}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Confidence</h3>
                  <div className="flex items-center">
                    <div className="w-32 h-4 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceColor(analysis.confidence)}`}
                        style={{ width: `${analysis.confidence}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{getConfidenceLevel(analysis.confidence)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {analysis.specialSituations && analysis.specialSituations.isSpecialSituation && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Special Situation Detected</h3>
                <p className="font-semibold text-blue-700">{analysis.specialSituations.type}</p>
                <p className="text-sm text-blue-600 mt-1">{analysis.specialSituations.details}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium mb-2">Magic Formula Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-600">Return on Capital (ROC)</p>
                  <p className="text-xl font-semibold">
                    {analysis.magicFormula?.rocScore ? analysis.magicFormula.rocScore.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-600">Earnings Yield</p>
                  <p className="text-xl font-semibold">
                    {analysis.magicFormula?.earningsYieldScore ? analysis.magicFormula.earningsYieldScore.toFixed(2) : 'N/A'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{analysis.magicFormula?.details}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Analysis Reasoning</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.reasons.map((reason, index) => (
                  <li key={index} className="text-gray-700">{reason}</li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back to Search
              </button>
              
              <div className="text-xs text-gray-500 text-right">
                <p>Analysis timestamp: {new Date(analysis.timestamp).toLocaleString()}</p>
                <p>Based on Joel Greenblatt's principles</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
