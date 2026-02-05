import yahooFinance from '@/lib/api/yahooFinance';
import { generateRecommendation } from '@/lib/analysis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const months = parseInt(searchParams.get('months') || '12', 10);
  
  if (!ticker) {
    return new Response(JSON.stringify({ error: 'Ticker symbol is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Fetch stock data
    const stockData = await yahooFinance.getStockDataForAnalysis(ticker, months);
    
    // Generate recommendation
    const recommendation = generateRecommendation(stockData);
    
    return new Response(JSON.stringify(recommendation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze stock',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
