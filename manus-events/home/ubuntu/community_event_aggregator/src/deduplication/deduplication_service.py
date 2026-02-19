"""
Integration of duplicate detector with the event aggregator.
"""
from typing import Dict, List, Any
import logging

from ..deduplication.duplicate_detector import DuplicateDetector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('deduplication_service')

class DeduplicationService:
    """
    Service for detecting and merging duplicate events.
    """
    
    def __init__(self, config=None):
        """
        Initialize the Deduplication Service.
        
        Args:
            config (dict, optional): Configuration dictionary
        """
        self.detector = DuplicateDetector(config)
        logger.info("Deduplication Service initialized")
    
    def process_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process events by detecting and merging duplicates.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of deduplicated event dictionaries
        """
        logger.info(f"Processing {len(events)} events for deduplication")
        deduplicated_events = self.detector.detect_duplicates(events)
        
        # Log deduplication results
        original_count = len(events)
        deduplicated_count = len(deduplicated_events)
        merged_count = sum(1 for event in deduplicated_events if event.get('merged', False))
        
        logger.info(f"Deduplication complete: {original_count} events reduced to {deduplicated_count}")
        logger.info(f"Merged {merged_count} duplicate groups")
        
        return deduplicated_events
