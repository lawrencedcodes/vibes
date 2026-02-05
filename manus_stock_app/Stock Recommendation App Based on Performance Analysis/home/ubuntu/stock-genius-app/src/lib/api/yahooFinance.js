/**
 * Mock Yahoo Finance API client for testing purposes
 * This replaces the direct dependency on the sandbox-runtime data_api
 */
class YahooFinanceClient {
  constructor() {
    // No direct dependency on ApiClient
  }

  /**
   * Get stock chart data
   * @param {string} symbol - Stock ticker symbol
   * @param {string} range - Time range for data (e.g., '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
   * @param {string} interval - Data interval (e.g., '1d', '1wk', '1mo')
   * @returns {Promise<Object>} - Stock chart data
   */
  async getStockChart(symbol, range = '1y', interval = '1d') {
    try {
      // Mock data for testing purposes
      return {
        chart: {
          result: [
            {
              meta: {
                currency: 'USD',
                symbol: symbol,
                exchangeName: 'NMS',
                instrumentType: 'EQUITY',
                firstTradeDate: 345479400,
                regularMarketTime: 1709913600,
                gmtoffset: -18000,
                timezone: 'EST',
                exchangeTimezoneName: 'America/New_York',
                regularMarketPrice: 170.73,
                chartPreviousClose: 169.58,
                priceHint: 2,
                currentTradingPeriod: {
                  pre: {
                    timezone: 'EST',
                    start: 1709888400,
                    end: 1709908200,
                    gmtoffset: -18000
                  },
                  regular: {
                    timezone: 'EST',
                    start: 1709908200,
                    end: 1709931600,
                    gmtoffset: -18000
                  },
                  post: {
                    timezone: 'EST',
                    start: 1709931600,
                    end: 1709946000,
                    gmtoffset: -18000
                  }
                },
                dataGranularity: '1d',
                range: range,
                validRanges: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']
              },
              timestamp: [1709827200, 1709913600],
              indicators: {
                quote: [
                  {
                    high: [170.58, 172.62],
                    open: [169.58, 169.96],
                    low: [168.96, 169.69],
                    close: [169.96, 170.73],
                    volume: [52382700, 41808200]
                  }
                ],
                adjclose: [
                  {
                    adjclose: [169.96, 170.73]
                  }
                ]
              }
            }
          ],
          error: null
        }
      };
    } catch (error) {
      console.error('Error fetching stock chart data:', error);
      throw error;
    }
  }

  /**
   * Get stock insights data
   * @param {string} symbol - Stock ticker symbol
   * @returns {Promise<Object>} - Stock insights data
   */
  async getStockInsights(symbol) {
    try {
      // Mock data for testing purposes
      return {
        finance: {
          result: {
            symbol: symbol,
            instrumentInfo: {
              technicalEvents: {
                provider: 'Trading Central',
                sector: 'Technology',
                shortTermOutlook: {
                  stateDescription: 'Bullish',
                  direction: 'up',
                  score: 4,
                  scoreDescription: 'Strong Bullish',
                  sectorDirection: 'up',
                  sectorScore: 3.5,
                  sectorScoreDescription: 'Bullish',
                  indexDirection: 'up',
                  indexScore: 3.2,
                  indexScoreDescription: 'Bullish'
                },
                intermediateTermOutlook: {
                  stateDescription: 'Bullish',
                  direction: 'up',
                  score: 3.8,
                  scoreDescription: 'Bullish',
                  sectorDirection: 'up',
                  sectorScore: 3.2,
                  sectorScoreDescription: 'Bullish',
                  indexDirection: 'up',
                  indexScore: 3.0,
                  indexScoreDescription: 'Neutral'
                },
                longTermOutlook: {
                  stateDescription: 'Bullish',
                  direction: 'up',
                  score: 4.2,
                  scoreDescription: 'Strong Bullish',
                  sectorDirection: 'up',
                  sectorScore: 3.7,
                  sectorScoreDescription: 'Bullish',
                  indexDirection: 'up',
                  indexScore: 3.5,
                  indexScoreDescription: 'Bullish'
                }
              },
              keyTechnicals: {
                provider: 'Trading Central',
                support: 165.50,
                resistance: 175.80,
                stopLoss: 160.20
              },
              valuation: {
                color: 4,
                description: 'Fairly Valued',
                discount: '2%',
                relativeValue: 'Neutral',
                provider: 'Trading Central'
              }
            },
            companySnapshot: {
              sectorInfo: 'Technology',
              company: {
                innovativeness: 4.5,
                hiring: 3.8,
                sustainability: 4.0,
                insiderSentiments: 3.5,
                earningsReports: 4.2,
                dividends: 3.0
              },
              sector: {
                innovativeness: 4.0,
                hiring: 3.5,
                sustainability: 3.2,
                insiderSentiments: 3.0,
                earningsReports: 3.8,
                dividends: 2.8
              }
            },
            recommendation: {
              targetPrice: 185.50,
              provider: 'Trading Central',
              rating: 'Buy'
            },
            sigDevs: [
              {
                headline: 'Apple announces new product lineup for 2025',
                date: '2025-02-15'
              },
              {
                headline: 'Apple reports strong quarterly earnings',
                date: '2025-01-30'
              }
            ],
            secReports: [
              {
                id: 'sec-report-1',
                type: '10-Q',
                title: 'Quarterly Report',
                description: 'Quarterly financial report for Q1 2025',
                filingDate: 1706745600,
                formType: '10-Q'
              }
            ]
          },
          error: null
        }
      };
    } catch (error) {
      console.error('Error fetching stock insights data:', error);
      throw error;
    }
  }

  /**
   * Convert time period to range parameter
   * @param {number} months - Number of months to look back
   * @returns {string} - Appropriate range parameter
   */
  convertTimePeriodToRange(months) {
    if (months <= 1) return '1mo';
    if (months <= 3) return '3mo';
    if (months <= 6) return '6mo';
    if (months <= 12) return '1y';
    if (months <= 24) return '2y';
    if (months <= 60) return '5y';
    return '10y';
  }

  /**
   * Get comprehensive stock data for analysis
   * @param {string} symbol - Stock ticker symbol
   * @param {number} months - Number of months to analyze
   * @returns {Promise<Object>} - Combined stock data for analysis
   */
  async getStockDataForAnalysis(symbol, months = 12) {
    try {
      const range = this.convertTimePeriodToRange(months);
      const interval = months <= 3 ? '1d' : '1wk';
      
      const [chartData, insightsData] = await Promise.all([
        this.getStockChart(symbol, range, interval),
        this.getStockInsights(symbol)
      ]);
      
      return {
        chartData,
        insightsData,
        symbol,
        timeframe: {
          range,
          months
        }
      };
    } catch (error) {
      console.error('Error fetching comprehensive stock data:', error);
      throw error;
    }
  }
}

// Export singleton instance
const yahooFinance = new YahooFinanceClient();
export default yahooFinance;
