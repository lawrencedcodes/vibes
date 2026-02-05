from flask import Flask, request, jsonify
import sys
import os
import json
from datetime import datetime
from flask_cors import CORS

# Add the sandbox runtime path to access the data_api module
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

app = Flask(__name__)
# Enable CORS for all routes with more permissive settings
CORS(app, resources={r"/*": {"origins": "*"}})
client = ApiClient()

@app.route('/api/stock/chart', methods=['GET'])
def get_stock_chart():
    """
    Get stock chart data from Yahoo Finance API
    
    Query parameters:
    - symbol: Stock ticker symbol (required)
    - range: Time range for data (e.g., '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
    - interval: Data interval (e.g., '1d', '1wk', '1mo')
    """
    try:
        symbol = request.args.get('symbol')
        range_param = request.args.get('range', '1y')
        interval = request.args.get('interval', '1d')
        
        if not symbol:
            return jsonify({"error": "Symbol parameter is required"}), 400
        
        # Call Yahoo Finance API with correct format
        data = client.call_api('YahooFinance/get_stock_chart', query={
            'symbol': symbol,
            'range': range_param,
            'interval': interval,
            'includeAdjustedClose': True,
            'region': 'US'
        })
        
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching stock chart data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock/insights', methods=['GET'])
def get_stock_insights():
    """
    Get stock insights data from Yahoo Finance API
    
    Query parameters:
    - symbol: Stock ticker symbol (required)
    """
    try:
        symbol = request.args.get('symbol')
        
        if not symbol:
            return jsonify({"error": "Symbol parameter is required"}), 400
        
        # Call Yahoo Finance API with correct format
        data = client.call_api('YahooFinance/get_stock_insights', query={
            'symbol': symbol
        })
        
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching stock insights data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock/profile', methods=['GET'])
def get_stock_profile():
    """
    Get stock profile data from Yahoo Finance API
    
    Query parameters:
    - symbol: Stock ticker symbol (required)
    """
    try:
        symbol = request.args.get('symbol')
        
        if not symbol:
            return jsonify({"error": "Symbol parameter is required"}), 400
        
        # Call Yahoo Finance API with correct format
        data = client.call_api('YahooFinance/get_stock_profile', query={
            'symbol': symbol,
            'region': 'US',
            'lang': 'en-US'
        })
        
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching stock profile data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock/analyze', methods=['GET'])
def analyze_stock():
    """
    Analyze stock based on Joel Greenblatt's principles
    
    Query parameters:
    - symbol: Stock ticker symbol (required)
    - months: Number of months to analyze (default: 12)
    """
    try:
        symbol = request.args.get('symbol')
        months = int(request.args.get('months', 12))
        
        if not symbol:
            return jsonify({"error": "Symbol parameter is required"}), 400
        
        # Convert months to range parameter
        range_param = convert_months_to_range(months)
        interval = '1d' if months <= 3 else '1wk'
        
        # Fetch stock data with correct format
        chart_data = client.call_api('YahooFinance/get_stock_chart', query={
            'symbol': symbol,
            'range': range_param,
            'interval': interval,
            'includeAdjustedClose': True,
            'region': 'US'
        })
        
        insights_data = client.call_api('YahooFinance/get_stock_insights', query={
            'symbol': symbol
        })
        
        profile_data = client.call_api('YahooFinance/get_stock_profile', query={
            'symbol': symbol,
            'region': 'US',
            'lang': 'en-US'
        })
        
        # Analyze the data
        analysis_result = analyze_stock_data(symbol, months, chart_data, insights_data, profile_data)
        
        return jsonify(analysis_result)
    except Exception as e:
        app.logger.error(f"Error analyzing stock: {str(e)}")
        return jsonify({"error": str(e)}), 500

def convert_months_to_range(months):
    """Convert number of months to Yahoo Finance range parameter"""
    if months <= 1:
        return '1mo'
    elif months <= 3:
        return '3mo'
    elif months <= 6:
        return '6mo'
    elif months <= 12:
        return '1y'
    elif months <= 24:
        return '2y'
    elif months <= 60:
        return '5y'
    else:
        return '10y'

def analyze_stock_data(symbol, months, chart_data, insights_data, profile_data):
    """
    Analyze stock data based on Joel Greenblatt's principles
    
    This implements the core analysis logic from the original application
    but using real data instead of mock data.
    """
    # Extract relevant data
    try:
        # Calculate ROC (Return on Capital)
        roc_score = calculate_roc(insights_data, profile_data)
        
        # Calculate Earnings Yield
        earnings_yield_score = calculate_earnings_yield(insights_data, chart_data)
        
        # Detect special situations
        special_situations = detect_special_situations(insights_data)
        
        # Calculate Magic Formula score
        magic_formula_score = 0
        if roc_score is not None and earnings_yield_score is not None:
            magic_formula_score = (roc_score + earnings_yield_score) / 2
        
        magic_formula = {
            'score': magic_formula_score,
            'rocScore': roc_score,
            'earningsYieldScore': earnings_yield_score,
            'details': "Magic Formula Score: {0:.2f} (ROC: {1}, Earnings Yield: {2})".format(
                magic_formula_score,
                f"{roc_score:.2f}" if roc_score is not None else "N/A",
                f"{earnings_yield_score:.2f}" if earnings_yield_score is not None else "N/A"
            )
        }
        
        # Generate recommendation
        recommendation, confidence, reasons = generate_recommendation(
            special_situations, 
            magic_formula, 
            insights_data
        )
        
        return {
            'symbol': symbol,
            'recommendation': recommendation,
            'confidence': confidence,
            'reasons': reasons,
            'specialSituations': special_situations,
            'magicFormula': magic_formula,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        app.logger.error(f"Error in analysis: {str(e)}")
        return {
            'symbol': symbol,
            'recommendation': 'HOLD',
            'confidence': 0,
            'reasons': [f'Error analyzing stock: {str(e)}'],
            'specialSituations': None,
            'magicFormula': None,
            'timestamp': datetime.now().isoformat()
        }

def calculate_roc(insights_data, profile_data):
    """
    Calculate Return on Capital (ROC)
    
    In Joel Greenblatt's formula, ROC = EBIT / (Net Working Capital + Net Fixed Assets)
    
    Since we don't have direct access to these values from Yahoo Finance API,
    we'll use approximations based on available data
    """
    try:
        # Extract data from insights
        insights = insights_data.get('finance', {}).get('result', {})
        
        # Use technical indicators as a proxy for ROC
        technical_events = insights.get('instrumentInfo', {}).get('technicalEvents', {})
        
        # Use long term outlook score as a component
        long_term_score = technical_events.get('longTermOutlook', {}).get('score')
        if long_term_score is None:
            return None
        
        # Use company metrics as another component
        company_metrics = insights.get('companySnapshot', {}).get('company', {})
        innovativeness = company_metrics.get('innovativeness', 3)
        
        # Combine factors into a ROC score (0-100 scale)
        roc_base = long_term_score * 15  # Scale from 0-5 to 0-75
        roc_innovation_factor = innovativeness * 5  # Scale from 0-5 to 0-25
        
        return roc_base + roc_innovation_factor
    except Exception as e:
        app.logger.error(f"Error calculating ROC: {str(e)}")
        return None

def calculate_earnings_yield(insights_data, chart_data):
    """
    Calculate Earnings Yield
    
    In Joel Greenblatt's formula, Earnings Yield = EBIT / Enterprise Value
    
    Since we don't have direct access to these values from Yahoo Finance API,
    we'll use approximations based on available data
    """
    try:
        # Extract data from insights
        insights = insights_data.get('finance', {}).get('result', {})
        
        # Use valuation data as a proxy for earnings yield
        valuation = insights.get('instrumentInfo', {}).get('valuation', {})
        valuation_color = valuation.get('color')
        
        if valuation_color is None:
            return None
        
        # Use recommendation data as another component
        recommendation = insights.get('recommendation', {})
        rating = recommendation.get('rating', '')
        
        # Calculate rating factor
        rating_factor = 0
        if rating.lower() == 'buy' or rating.lower() == 'strong buy':
            rating_factor = 25
        elif rating.lower() == 'outperform':
            rating_factor = 20
        elif rating.lower() == 'hold' or rating.lower() == 'neutral':
            rating_factor = 15
        elif rating.lower() == 'underperform':
            rating_factor = 10
        elif rating.lower() == 'sell':
            rating_factor = 5
        
        # Combine factors into an Earnings Yield score (0-100 scale)
        yield_base = valuation_color * 15  # Scale from 0-5 to 0-75
        
        return yield_base + rating_factor
    except Exception as e:
        app.logger.error(f"Error calculating Earnings Yield: {str(e)}")
        return None

def detect_special_situations(insights_data):
    """
    Detect potential special situations based on Joel Greenblatt's principles
    """
    try:
        # Extract data from insights
        insights = insights_data.get('finance', {}).get('result', {})
        
        # Check for significant developments that might indicate special situations
        sig_devs = insights.get('sigDevs', [])
        sec_reports = insights.get('secReports', [])
        
        # Look for keywords in significant developments
        spinoff_keywords = ['spin-off', 'spinoff', 'spin off', 'divestiture']
        merger_keywords = ['merger', 'acquisition', 'acquire', 'takeover', 'buyout']
        restructuring_keywords = ['restructuring', 'reorganization', 'bankruptcy', 'chapter 11']
        
        # Check headlines for keywords
        spinoff_matches = [dev for dev in sig_devs if any(keyword in dev.get('headline', '').lower() for keyword in spinoff_keywords)]
        merger_matches = [dev for dev in sig_devs if any(keyword in dev.get('headline', '').lower() for keyword in merger_keywords)]
        restructuring_matches = [dev for dev in sig_devs if any(keyword in dev.get('headline', '').lower() for keyword in restructuring_keywords)]
        
        # Check SEC reports for keywords
        sec_spinoff_matches = [report for report in sec_reports if any(keyword in (report.get('title', '') + ' ' + report.get('description', '')).lower() for keyword in spinoff_keywords)]
        sec_merger_matches = [report for report in sec_reports if any(keyword in (report.get('title', '') + ' ' + report.get('description', '')).lower() for keyword in merger_keywords)]
        sec_restructuring_matches = [report for report in sec_reports if any(keyword in (report.get('title', '') + ' ' + report.get('description', '')).lower() for keyword in restructuring_keywords)]
        
        # Determine if there's a special situation and what type
        if spinoff_matches or sec_spinoff_matches:
            return {
                'isSpecialSituation': True,
                'type': 'Spin-off',
                'confidence': min(100, (len(spinoff_matches) + len(sec_spinoff_matches)) * 25),
                'details': "Potential spin-off detected based on news and/or SEC filings"
            }
        elif merger_matches or sec_merger_matches:
            return {
                'isSpecialSituation': True,
                'type': 'Merger/Acquisition',
                'confidence': min(100, (len(merger_matches) + len(sec_merger_matches)) * 25),
                'details': "Potential merger or acquisition detected based on news and/or SEC filings"
            }
        elif restructuring_matches or sec_restructuring_matches:
            return {
                'isSpecialSituation': True,
                'type': 'Restructuring',
                'confidence': min(100, (len(restructuring_matches) + len(sec_restructuring_matches)) * 25),
                'details': "Potential restructuring detected based on news and/or SEC filings"
            }
        
        return {
            'isSpecialSituation': False,
            'type': None,
            'confidence': 0,
            'details': "No special situations detected"
        }
    except Exception as e:
        app.logger.error(f"Error detecting special situations: {str(e)}")
        return {
            'isSpecialSituation': False,
            'type': None,
            'confidence': 0,
            'details': f"Error analyzing special situations: {str(e)}"
        }

def generate_recommendation(special_situations, magic_formula, insights_data):
    """
    Generate buy/hold/sell recommendation based on Joel Greenblatt's principles
    """
    try:
        # Initialize recommendation
        recommendation = 'HOLD'
        confidence = 0
        reasons = []
        
        # Special situations analysis
        if special_situations.get('isSpecialSituation'):
            recommendation = 'BUY'
            confidence = special_situations.get('confidence', 0)
            reasons.append(f"Special situation detected: {special_situations.get('type')} ({special_situations.get('details')})")
        
        # Magic Formula analysis
        if magic_formula.get('score') > 0:
            if magic_formula.get('score') >= 75:
                recommendation = 'BUY'
                confidence = max(confidence, magic_formula.get('score', 0))
                reasons.append(f"High Magic Formula score: {magic_formula.get('score'):.2f}")
            elif magic_formula.get('score') >= 50:
                if recommendation != 'BUY':
                    recommendation = 'HOLD'
                    confidence = magic_formula.get('score', 0)
                reasons.append(f"Moderate Magic Formula score: {magic_formula.get('score'):.2f}")
            else:
                recommendation = 'SELL'
                confidence = 100 - magic_formula.get('score', 0)
                reasons.append(f"Low Magic Formula score: {magic_formula.get('score'):.2f}")
        
        # Technical analysis from Yahoo Finance insights
        insights = insights_data.get('finance', {}).get('result', {})
        if insights.get('instrumentInfo', {}).get('technicalEvents', {}):
            technical_events = insights.get('instrumentInfo', {}).get('technicalEvents', {})
            
            # Check long term outlook
            if technical_events.get('longTermOutlook', {}):
                long_term = technical_events.get('longTermOutlook', {})
                if long_ter<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>