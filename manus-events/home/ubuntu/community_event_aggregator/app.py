"""
Updated main application file with integrated search functionality.
"""
import os
from flask import Flask, render_template, request, jsonify
from src.models.event_aggregator import EventAggregator
from src.categorization.categorization_service import CategorizationService
from src.deduplication.deduplication_service import DeduplicationService
from src.models.search_service import SearchService
from src.models.event_storage import EventStorage

# Initialize Flask app
app = Flask(__name__)

# Initialize services
event_storage = EventStorage(os.path.join(os.getcwd(), 'data', 'events'))
event_aggregator = EventAggregator()
categorization_service = CategorizationService()
deduplication_service = DeduplicationService()
search_service = SearchService(event_storage)

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/api/events', methods=['GET'])
def get_events():
    """API endpoint to get events for a location."""
    # Parse search parameters from request
    search_params = search_service.parse_search_params(request.args)
    
    if 'location' not in search_params or not search_params['location'].get('city'):
        return jsonify({'error': 'City is required'}), 400
    
    # Check if we need to fetch new events
    location = search_params['location']
    fetch_new = request.args.get('fetch_new', 'false').lower() == 'true'
    
    if fetch_new:
        # Aggregate events from sources
        events = event_aggregator.aggregate_events(location)
        
        # Categorize events
        events = categorization_service.process_events(events)
        
        # Deduplicate events
        events = deduplication_service.process_events(events)
    
    # Search for events based on parameters
    events = search_service.search_events(search_params)
    
    # Return the top 20 events
    return jsonify({'events': events[:20]})

@app.route('/api/categories')
def get_categories():
    """API endpoint to get available event categories."""
    categories = [
        {'id': 'music', 'name': 'Music'},
        {'id': 'sports', 'name': 'Sports'},
        {'id': 'arts', 'name': 'Arts'},
        {'id': 'food', 'name': 'Food & Drink'},
        {'id': 'education', 'name': 'Education'},
        {'id': 'community', 'name': 'Community'},
        {'id': 'family', 'name': 'Family'},
        {'id': 'business', 'name': 'Business'},
        {'id': 'technology', 'name': 'Technology'},
        {'id': 'health', 'name': 'Health & Wellness'}
    ]
    return jsonify({'categories': categories})

@app.route('/api/search', methods=['GET'])
def search():
    """API endpoint for advanced search."""
    # Parse search parameters from request
    search_params = search_service.parse_search_params(request.args)
    
    # Search for events
    events = search_service.search_events(search_params)
    
    # Return results
    return jsonify({'events': events})

if __name__ == '__main__':
    # Ensure the data directory exists
    os.makedirs('data/events', exist_ok=True)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
