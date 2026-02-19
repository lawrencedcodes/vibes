"""
Integration of event categorizer with the event aggregator.
"""
from typing import Dict, List, Any
import logging

from ..categorization.event_categorizer import EventCategorizer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('categorization_service')

class CategorizationService:
    """
    Service for categorizing events and integrating with the event aggregator.
    """
    
    def __init__(self):
        """Initialize the Categorization Service."""
        self.categorizer = EventCategorizer()
        logger.info("Categorization Service initialized")
    
    def process_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process events by categorizing them.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of categorized event dictionaries
        """
        logger.info(f"Processing {len(events)} events for categorization")
        categorized_events = self.categorizer.categorize_events(events)
        
        # Log category distribution
        self._log_category_distribution(categorized_events)
        
        return categorized_events
    
    def _log_category_distribution(self, events: List[Dict[str, Any]]):
        """
        Log the distribution of categories in the events.
        
        Args:
            events (list): List of categorized event dictionaries
        """
        category_counts = {}
        family_friendly_count = 0
        
        for event in events:
            categories = event.get('categories', [])
            for category in categories:
                if category in category_counts:
                    category_counts[category] += 1
                else:
                    category_counts[category] = 1
            
            if event.get('family_friendly', False):
                family_friendly_count += 1
        
        logger.info(f"Category distribution: {category_counts}")
        logger.info(f"Family-friendly events: {family_friendly_count} out of {len(events)}")
