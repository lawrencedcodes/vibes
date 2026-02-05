/**
 * Utility functions for stock data processing
 */

/**
 * Calculate Return on Capital (ROC)
 * ROC = EBIT / (Net Working Capital + Net Fixed Assets)
 * 
 * Since we don't have direct access to these values from Yahoo Finance API,
 * we'll use approximations based on available data
 * 
 * @param {Object} stockData - Stock data from Yahoo Finance
 * @returns {number|null} - Calculated ROC or null if calculation not possible
 */
export const calculateROC = (stockData) => {
  try {
    // This is a simplified approximation
    // In a real application, we would need more detailed financial data
    const insights = stockData.insightsData?.finance?.result;
    
    if (!insights) return null;
    
    // Use technical indicators as a proxy for ROC
    const technicalEvents = insights.instrumentInfo?.technicalEvents;
    if (!technicalEvents) return null;
    
    // Use long term outlook score as a proxy for ROC
    const longTermScore = technicalEvents.longTermOutlook?.score;
    if (typeof longTermScore !== 'number') return null;
    
    // Normalize to a 0-100 scale
    return longTermScore * 20; // Assuming score is on a 0-5 scale
  } catch (error) {
    console.error('Error calculating ROC:', error);
    return null;
  }
};

/**
 * Calculate Earnings Yield
 * Earnings Yield = EBIT / Enterprise Value
 * 
 * Since we don't have direct access to these values from Yahoo Finance API,
 * we'll use approximations based on available data
 * 
 * @param {Object} stockData - Stock data from Yahoo Finance
 * @returns {number|null} - Calculated Earnings Yield or null if calculation not possible
 */
export const calculateEarningsYield = (stockData) => {
  try {
    // This is a simplified approximation
    // In a real application, we would need more detailed financial data
    const insights = stockData.insightsData?.finance?.result;
    
    if (!insights) return null;
    
    // Use valuation data as a proxy for earnings yield
    const valuation = insights.instrumentInfo?.valuation;
    if (!valuation) return null;
    
    // Use color as a proxy for earnings yield (higher is better)
    const valuationColor = valuation.color;
    if (typeof valuationColor !== 'number') return null;
    
    // Normalize to a 0-100 scale
    return valuationColor * 20; // Assuming color is on a 0-5 scale
  } catch (error) {
    console.error('Error calculating Earnings Yield:', error);
    return null;
  }
};

/**
 * Detect potential special situations
 * @param {Object} stockData - Stock data from Yahoo Finance
 * @returns {Object} - Special situations analysis
 */
export const detectSpecialSituations = (stockData) => {
  try {
    const insights = stockData.insightsData?.finance?.result;
    const chartData = stockData.chartData?.chart?.result?.[0];
    
    if (!insights || !chartData) {
      return {
        isSpecialSituation: false,
        type: null,
        confidence: 0,
        details: "Insufficient data to detect special situations"
      };
    }
    
    // Check for significant developments that might indicate special situations
    const sigDevs = insights.sigDevs || [];
    const secReports = insights.secReports || [];
    
    // Look for keywords in significant developments
    const spinoffKeywords = ['spin-off', 'spinoff', 'spin off', 'divestiture'];
    const mergerKeywords = ['merger', 'acquisition', 'acquire', 'takeover', 'buyout'];
    const restructuringKeywords = ['restructuring', 'reorganization', 'bankruptcy', 'chapter 11'];
    
    // Check headlines for keywords
    const spinoffMatches = sigDevs.filter(dev => 
      spinoffKeywords.some(keyword => dev.headline.toLowerCase().includes(keyword))
    );
    
    const mergerMatches = sigDevs.filter(dev => 
      mergerKeywords.some(keyword => dev.headline.toLowerCase().includes(keyword))
    );
    
    const restructuringMatches = sigDevs.filter(dev => 
      restructuringKeywords.some(keyword => dev.headline.toLowerCase().includes(keyword))
    );
    
    // Check SEC reports for keywords
    const secSpinoffMatches = secReports.filter(report => 
      spinoffKeywords.some(keyword => (report.title + ' ' + report.description).toLowerCase().includes(keyword))
    );
    
    const secMergerMatches = secReports.filter(report => 
      mergerKeywords.some(keyword => (report.title + ' ' + report.description).toLowerCase().includes(keyword))
    );
    
    const secRestructuringMatches = secReports.filter(report => 
      restructuringKeywords.some(keyword => (report.title + ' ' + report.description).toLowerCase().includes(keyword))
    );
    
    // Determine if there's a special situation and what type
    if (spinoffMatches.length > 0 || secSpinoffMatches.length > 0) {
      return {
        isSpecialSituation: true,
        type: 'Spin-off',
        confidence: Math.min(100, (spinoffMatches.length + secSpinoffMatches.length) * 25),
        details: "Potential spin-off detected based on news and/or SEC filings"
      };
    } else if (mergerMatches.length > 0 || secMergerMatches.length > 0) {
      return {
        isSpecialSituation: true,
        type: 'Merger/Acquisition',
        confidence: Math.min(100, (mergerMatches.length + secMergerMatches.length) * 25),
        details: "Potential merger or acquisition detected based on news and/or SEC filings"
      };
    } else if (restructuringMatches.length > 0 || secRestructuringMatches.length > 0) {
      return {
        isSpecialSituation: true,
        type: 'Restructuring',
        confidence: Math.min(100, (restructuringMatches.length + secRestructuringMatches.length) * 25),
        details: "Potential restructuring detected based on news and/or SEC filings"
      };
    }
    
    return {
      isSpecialSituation: false,
      type: null,
      confidence: 0,
      details: "No special situations detected"
    };
  } catch (error) {
    console.error('Error detecting special situations:', error);
    return {
      isSpecialSituation: false,
      type: null,
      confidence: 0,
      details: "Error analyzing special situations"
    };
  }
};

/**
 * Calculate Magic Formula ranking
 * @param {Object} stockData - Stock data from Yahoo Finance
 * @returns {Object} - Magic Formula analysis
 */
export const calculateMagicFormulaRanking = (stockData) => {
  try {
    const roc = calculateROC(stockData);
    const earningsYield = calculateEarningsYield(stockData);
    
    if (roc === null || earningsYield === null) {
      return {
        score: 0,
        rocRank: null,
        earningsYieldRank: null,
        details: "Insufficient data for Magic Formula calculation"
      };
    }
    
    // In a real application, we would rank this stock among all stocks in our universe
    // For this demo, we'll use a simplified approach
    
    // Normalize scores to 0-100 scale
    const rocScore = roc;
    const earningsYieldScore = earningsYield;
    
    // Combined score (higher is better)
    const combinedScore = (rocScore + earningsYieldScore) / 2;
    
    return {
      score: combinedScore,
      rocScore,
      earningsYieldScore,
      details: `Magic Formula Score: ${combinedScore.toFixed(2)} (ROC: ${rocScore.toFixed(2)}, Earnings Yield: ${earningsYieldScore.toFixed(2)})`
    };
  } catch (error) {
    console.error('Error calculating Magic Formula ranking:', error);
    return {
      score: 0,
      rocRank: null,
      earningsYieldRank: null,
      details: "Error calculating Magic Formula ranking"
    };
  }
};

/**
 * Generate buy/hold/sell recommendation based on Joel Greenblatt's principles
 * @param {Object} stockData - Stock data from Yahoo Finance
 * @returns {Object} - Recommendation analysis
 */
export const generateRecommendation = (stockData) => {
  try {
    // Get special situations analysis
    const specialSituations = detectSpecialSituations(stockData);
    
    // Get Magic Formula ranking
    const magicFormula = calculateMagicFormulaRanking(stockData);
    
    // Determine recommendation
    let recommendation = 'HOLD';
    let confidence = 0;
    let reasons = [];
    
    // Special situations analysis
    if (specialSituations.isSpecialSituation) {
      recommendation = 'BUY';
      confidence = specialSituations.confidence;
      reasons.push(`Special situation detected: ${specialSituations.type} (${specialSituations.details})`);
    }
    
    // Magic Formula analysis
    if (magicFormula.score > 0) {
      if (magicFormula.score >= 75) {
        recommendation = 'BUY';
        confidence = Math.max(confidence, magicFormula.score);
        reasons.push(`High Magic Formula score: ${magicFormula.score.toFixed(2)}`);
      } else if (magicFormula.score >= 50) {
        if (recommendation !== 'BUY') {
          recommendation = 'HOLD';
          confidence = magicFormula.score;
        }
        reasons.push(`Moderate Magic Formula score: ${magicFormula.score.toFixed(2)}`);
      } else {
        recommendation = 'SELL';
        confidence = 100 - magicFormula.score;
        reasons.push(`Low Magic Formula score: ${magicFormula.score.toFixed(2)}`);
      }
    }
    
    // Technical analysis from Yahoo Finance insights
    const insights = stockData.insightsData?.finance?.result;
    if (insights?.instrumentInfo?.technicalEvents) {
      const technicalEvents = insights.instrumentInfo.technicalEvents;
      
      // Check long term outlook
      if (technicalEvents.longTermOutlook) {
        const longTerm = technicalEvents.longTermOutlook;
        if (longTerm.direction === 'up') {
          if (recommendation !== 'BUY') {
            recommendation = 'HOLD';
          }
          reasons.push(`Positive long-term technical outlook: ${longTerm.scoreDescription}`);
        } else if (longTerm.direction === 'down') {
          if (recommendation === 'HOLD') {
            recommendation = 'SELL';
          }
          reasons.push(`Negative long-term technical outlook: ${longTerm.scoreDescription}`);
        }
      }
    }
    
    return {
      recommendation,
      confidence: Math.min(100, confidence),
      reasons,
      specialSituations,
      magicFormula,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return {
      recommendation: 'HOLD',
      confidence: 0,
      reasons: ['Error generating recommendation'],
      specialSituations: null,
      magicFormula: null,
      timestamp: new Date().toISOString()
    };
  }
};
