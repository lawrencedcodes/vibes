"""
Search functionality implementation for the Community Event Aggregator.
"""
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('search_service')

class SearchService:
    """
    Service for searching and filtering events.
    """
    
    def __init__(self, event_storage):
        """
        Initialize the Search Service.
        
        Args:
            event_storage: Event storage instance
        """
        self.event_storage = event_storage
        logger.info("Search Service initialized")
    
    def search_events(self, search_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Search for events based on provided parameters.
        
        Args:
            search_params (dict): Search parameters including:
                - location (dict): Location with city, state, country
                - date_range (dict, optional): Date range with start and end dates
                - categories (list, optional): List of categories to filter by
                - family_friendly (bool, optional): Whether to filter for family-friendly events
                - query (str, optional): Text search query
                
        Returns:
            list: List of matching event dictionaries
        """
        logger.info(f"Searching events with params: {search_params}")
        
        # Build filter dictionary for event storage
        filters = {}
        
        # Add location filter
        if 'location' in search_params:
            filters['location'] = search_params['location']
        
        # Add date range filter
        if 'date_range' in search_params:
            filters['date_range'] = search_params['date_range']
        
        # Add category filter
        if 'categories' in search_params and search_params['categories']:
            filters['categories'] = search_params['categories']
        
        # Add family-friendly filter
        if 'family_friendly' in search_params:
            filters['family_friendly'] = search_params['family_friendly']
        
        # Get events from storage
        events = self.event_storage.get_events(filters)
        
        # Apply text search if provided
        if 'query' in search_params and search_params['query']:
            events = self._filter_by_text_query(events, search_params['query'])
        
        # Sort events by date
        events = self._sort_events(events)
        
        logger.info(f"Found {len(events)} matching events")
        return events
    
    def _filter_by_text_query(self, events: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """
        Filter events by text query.
        
        Args:
            events (list): List of event dictionaries
            query (str): Text search query
            
        Returns:
            list: Filtered list of event dictionaries
        """
        query = query.lower()
        filtered_events = []
        
        for event in events:
            # Check event name
            if query in event.get('name', '').lower():
                filtered_events.append(event)
                continue
            
            # Check event description
            if query in event.get('description', '').lower():
                filtered_events.append(event)
                continue
            
            # Check location
            location = event.get('location', {})
            if isinstance(location, dict):
                location_str = ' '.join([
                    str(location.get('name', '')),
                    str(location.get('address', '')),
                    str(location.get('city', '')),
                    str(location.get('state', ''))
                ]).lower()
                
                if query in location_str:
                    filtered_events.append(event)
                    continue
            
            # Check categories
            categories = event.get('categories', [])
            if any(query in category.lower() for category in categories):
                filtered_events.append(event)
                continue
        
        return filtered_events
    
    def _sort_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Sort events by date (ascending).
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: Sorted list of event dictionaries
        """
        # Sort by date
        return sorted(events, key=lambda e: e.get('date', '9999-12-31'))
    
    def parse_search_params(self, request_args: Dict[str, str]) -> Dict[str, Any]:
        """
        Parse search parameters from request arguments.
        
        Args:
            request_args (dict): Request arguments
            
        Returns:
            dict: Parsed search parameters
        """
        search_params = {}
        
        # Parse location
        city = request_args.get('city')
        state = request_args.get('state', '')
        country = request_args.get('country', 'us')
        
        if city:
            search_params['location'] = {
                'city': city,
                'state': state,
                'country': country
            }
        
        # Parse date range
        start_date = request_args.get('start_date')
        end_date = request_args.get('end_date')
        
        if start_date or end_date:
            date_range = {}
            
            if start_date:
                date_range['start'] = start_date
            
            if end_date:
                date_range['end'] = end_date
            
            search_params['date_range'] = date_range
        
        # Parse categories
        category = request_args.get('category')
        if category:
            search_params['categories'] = [category]
        
        # Parse family-friendly
        family_friendly = request_args.get('family_friendly')
        if family_friendly:
            search_params['family_friendly'] = family_friendly.lower() == 'true'
        
        # Parse query
        query = request_args.get('query')
        if query:
            search_params['query'] = query
        
        return search_params
