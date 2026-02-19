"""
Duplicate detection module for identifying and merging similar events.
"""
import re
from typing import Dict, List, Any, Tuple
import logging
from datetime import datetime
import difflib
from collections import defaultdict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('duplicate_detector')

class DuplicateDetector:
    """
    Detects and merges duplicate events from different sources.
    """
    
    def __init__(self, config=None):
        """
        Initialize the Duplicate Detector.
        
        Args:
            config (dict, optional): Configuration dictionary
        """
        default_config = {
            'name_similarity_threshold': 0.8,  # Threshold for name similarity (0-1)
            'date_match_required': True,       # Whether date match is required for duplication
            'location_similarity_threshold': 0.7,  # Threshold for location similarity (0-1)
            'overall_similarity_threshold': 0.75,  # Threshold for overall similarity (0-1)
        }
        
        self.config = default_config
        if config:
            self.config.update(config)
            
        logger.info("Duplicate Detector initialized")
    
    def detect_duplicates(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect and merge duplicate events.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of deduplicated event dictionaries
        """
        if not events:
            return []
            
        logger.info(f"Detecting duplicates among {len(events)} events")
        
        # Group events by date to reduce comparison space
        date_grouped_events = self._group_events_by_date(events)
        
        # Process each date group
        deduplicated_events = []
        duplicate_groups = []
        
        for date, date_events in date_grouped_events.items():
            # If only one event on this date, no duplicates possible
            if len(date_events) <= 1:
                deduplicated_events.extend(date_events)
                continue
                
            # Find duplicate groups within this date
            date_duplicate_groups = self._find_duplicate_groups(date_events)
            duplicate_groups.extend(date_duplicate_groups)
            
            # Merge each duplicate group
            for group in date_duplicate_groups:
                merged_event = self._merge_events([date_events[i] for i in group])
                deduplicated_events.append(merged_event)
            
            # Add non-duplicate events
            duplicate_indices = set([i for group in date_duplicate_groups for i in group])
            for i, event in enumerate(date_events):
                if i not in duplicate_indices:
                    deduplicated_events.append(event)
        
        logger.info(f"Found {len(duplicate_groups)} duplicate groups")
        logger.info(f"Reduced to {len(deduplicated_events)} unique events")
        
        return deduplicated_events
    
    def _group_events_by_date(self, events: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Group events by date to reduce comparison space.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            dict: Dictionary mapping dates to lists of events
        """
        date_groups = defaultdict(list)
        
        for event in events:
            date = event.get('date')
            if date:
                date_groups[date].append(event)
            else:
                # Handle events without dates
                date_groups['unknown'].append(event)
        
        return date_groups
    
    def _find_duplicate_groups(self, events: List[Dict[str, Any]]) -> List[List[int]]:
        """
        Find groups of duplicate events within a list.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of lists, where each inner list contains indices of duplicate events
        """
        n = len(events)
        # Track which events have been assigned to groups
        assigned = [False] * n
        duplicate_groups = []
        
        for i in range(n):
            if assigned[i]:
                continue
                
            group = [i]
            assigned[i] = True
            
            for j in range(i + 1, n):
                if assigned[j]:
                    continue
                    
                if self._are_duplicates(events[i], events[j]):
                    group.append(j)
                    assigned[j] = True
            
            if len(group) > 1:
                duplicate_groups.append(group)
        
        return duplicate_groups
    
    def _are_duplicates(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> bool:
        """
        Determine if two events are duplicates.
        
        Args:
            event1 (dict): First event dictionary
            event2 (dict): Second event dictionary
            
        Returns:
            bool: True if the events are duplicates, False otherwise
        """
        # Check if events are from the same source
        if event1.get('source') == event2.get('source'):
            return False  # Same source shouldn't have duplicates
        
        # Calculate similarity scores for different aspects
        name_similarity = self._calculate_name_similarity(event1, event2)
        date_match = self._check_date_match(event1, event2)
        location_similarity = self._calculate_location_similarity(event1, event2)
        time_similarity = self._calculate_time_similarity(event1, event2)
        
        # If date match is required and dates don't match, not duplicates
        if self.config['date_match_required'] and not date_match:
            return False
        
        # Calculate overall similarity
        # Weight factors can be adjusted based on importance
        overall_similarity = (
            0.5 * name_similarity +
            0.3 * location_similarity +
            0.2 * time_similarity
        )
        
        # Check against threshold
        return overall_similarity >= self.config['overall_similarity_threshold']
    
    def _calculate_name_similarity(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> float:
        """
        Calculate similarity between event names.
        
        Args:
            event1 (dict): First event dictionary
            event2 (dict): Second event dictionary
            
        Returns:
            float: Similarity score between 0 and 1
        """
        name1 = event1.get('name', '').lower()
        name2 = event2.get('name', '').lower()
        
        if not name1 or not name2:
            return 0.0
        
        # Use sequence matcher for string similarity
        return difflib.SequenceMatcher(None, name1, name2).ratio()
    
    def _check_date_match(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> bool:
        """
        Check if event dates match.
        
        Args:
            event1 (dict): First event dictionary
            event2 (dict): Second event dictionary
            
        Returns:
            bool: True if dates match, False otherwise
        """
        date1 = event1.get('date')
        date2 = event2.get('date')
        
        if not date1 or not date2:
            return False
        
        return date1 == date2
    
    def _calculate_location_similarity(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> float:
        """
        Calculate similarity between event locations.
        
        Args:
            event1 (dict): First event dictionary
            event2 (dict): Second event dictionary
            
        Returns:
            float: Similarity score between 0 and 1
        """
        location1 = event1.get('location', {})
        location2 = event2.get('location', {})
        
        if not location1 or not location2:
            return 0.0
        
        # Extract location strings
        loc_str1 = self._get_location_string(location1)
        loc_str2 = self._get_location_string(location2)
        
        if not loc_str1 or not loc_str2:
            return 0.0
        
        # Use sequence matcher for string similarity
        return difflib.SequenceMatcher(None, loc_str1, loc_str2).ratio()
    
    def _get_location_string(self, location: Dict[str, Any]) -> str:
        """
        Convert location dictionary to string for comparison.
        
        Args:
            location (dict): Location dictionary
            
        Returns:
            str: Location string
        """
        if isinstance(location, str):
            return location.lower()
        
        parts = []
        if 'name' in location:
            parts.append(location['name'])
        if 'address' in location:
            parts.append(location['address'])
        if 'city' in location:
            parts.append(location['city'])
        
        return ' '.join(parts).lower()
    
    def _calculate_time_similarity(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> float:
        """
        Calculate similarity between event times.
        
        Args:
            event1 (dict): First event dictionary
            event2 (dict): Second event dictionary
            
        Returns:
            float: Similarity score between 0 and 1
        """
        time1 = event1.get('start_time')
        time2 = event2.get('start_time')
        
        if not time1 or not time2:
            return 0.5  # Neutral if times not available
        
        # Parse times to calculate difference
        try:
            t1 = datetime.strptime(time1, '%H:%M')
            t2 = datetime.strptime(time2, '%H:%M')
            
            # Calculate difference in minutes
            diff_minutes = abs((t1.hour * 60 + t1.minute) - (t2.hour * 60 + t2.minute))
            
            # Convert to similarity score (0-1)
            # 0 minutes difference = 1.0 similarity
            # 120+ minutes difference = 0.0 similarity
            return max(0.0, 1.0 - (diff_minutes / 120))
        except ValueError:
            return 0.5  # Neutral if time parsing fails
    
    def _merge_events(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Merge duplicate events into a single event.
        
        Args:
            events (list): List of duplicate event dictionaries
            
        Returns:
            dict: Merged event dictionary
        """
        if not events:
            return {}
        
        if len(events) == 1:
            return events[0]
        
        # Start with the event that has the most complete information
        base_event = max(events, key=lambda e: self._calculate_completeness(e))
        merged_event = base_event.copy()
        
        # Track sources
        sources = [base_event.get('source', 'unknown')]
        
        # Merge information from other events
        for event in events:
            if event == base_event:
                continue
                
            # Add source
            source = event.get('source', 'unknown')
            if source not in sources:
                sources.append(source)
            
            # Merge description if the current one is empty or the new one is longer
            if (not merged_event.get('description') or 
                (event.get('description') and 
                 len(event['description']) > len(merged_event.get('description', '')))):
                merged_event['description'] = event['description']
            
            # Merge image URL if not present
            if not merged_event.get('image_url') and event.get('image_url'):
                merged_event['image_url'] = event['image_url']
            
            # Merge categories
            if 'categories' in event:
                if 'categories' not in merged_event:
                    merged_event['categories'] = []
                for category in event['categories']:
                    if category not in merged_event['categories']:
                        merged_event['categories'].append(category)
            
            # If either event is family-friendly, mark as family-friendly
            if event.get('family_friendly', False):
                merged_event['family_friendly'] = True
        
        # Update source to indicate merged
        merged_event['source'] = '+'.join(sources)
        merged_event['merged'] = True
        merged_event['original_sources'] = sources
        
        return merged_event
    
    def _calculate_completeness(self, event: Dict[str, Any]) -> int:
        """
        Calculate how complete an event's information is.
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            int: Completeness score
        """
        score = 0
        
        # Check presence of key fields
        if event.get('name'):
            score += 10
        if event.get('description'):
            score += len(event['description']) // 20  # Longer descriptions are better
        if event.get('date'):
            score += 5
        if event.get('start_time'):
            score += 3
        if event.get('end_time'):
            score += 2
        if event.get('location'):
            score += 5
            if isinstance(event['location'], dict):
                if event['location'].get('name'):
                    score += 2
                if event['location'].get('address'):
                    score += 3
        if event.get('url'):
            score += 3
        if event.get('image_url'):
            score += 3
        if event.get('categories'):
            score += len(event['categories'])
        
        return score
