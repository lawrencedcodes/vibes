"""
Main application module that ties together all components of the event aggregator.
"""
import os
import logging
from typing import Dict, List, Any

from ..scrapers.scraper_manager import ScraperManager
from ..models.event_storage import EventStorage

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('event_aggregator')

class EventAggregator:
    """
    Main application class that coordinates the event aggregation process.
    """
    
    def __init__(self, storage_dir=None):
        """
        Initialize the Event Aggregator.
        
        Args:
            storage_dir (str, optional): Directory to store event data
        """
        # Create data directory if it doesn't exist
        if storage_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            storage_dir = os.path.join(base_dir, 'data', 'events')
            
        os.makedirs(storage_dir, exist_ok=True)
        
        # Initialize components
        self.scraper_manager = ScraperManager()
        self.event_storage = EventStorage(storage_dir)
        
        # Register default scrapers
        self.scraper_manager.register_default_scrapers()
        
        logger.info("Event Aggregator initialized")
    
    def aggregate_events(self, location: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Aggregate events for the given location.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            
        Returns:
            list: List of event dictionaries
        """
        logger.info(f"Aggregating events for location: {location}")
        
        # Scrape events from all sources
        events = self.scraper_manager.run_all_scrapers(location)
        logger.info(f"Found {len(events)} events from all sources")
        
        # Store events
        event_ids = self.event_storage.save_events(events)
        logger.info(f"Saved {len(event_ids)} events to storage")
        
        return events
    
    def get_events(self, filters=None) -> List[Dict[str, Any]]:
        """
        Get events with optional filters.
        
        Args:
            filters (dict, optional): Filter criteria
            
        Returns:
            list: List of event dictionaries
        """
        return self.event_storage.get_events(filters)
    
    def get_event(self, event_id: str) -> Dict[str, Any]:
        """
        Get a single event by ID.
        
        Args:
            event_id (str): Event ID
            
        Returns:
            dict: Event dictionary
        """
        return self.event_storage.get_event(event_id)
