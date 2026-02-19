"""
Event storage module for storing and retrieving event data.
"""
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

class EventStorage:
    """
    Handles storage and retrieval of event data.
    This implementation uses JSON files for storage, but could be extended
    to use a database in a production environment.
    """
    
    def __init__(self, storage_dir: str = None):
        """
        Initialize the event storage.
        
        Args:
            storage_dir (str, optional): Directory to store event data
        """
        self.storage_dir = storage_dir or os.path.join(os.getcwd(), 'data', 'events')
        os.makedirs(self.storage_dir, exist_ok=True)
        
        # Create index file if it doesn't exist
        self.index_file = os.path.join(self.storage_dir, 'event_index.json')
        if not os.path.exists(self.index_file):
            with open(self.index_file, 'w') as f:
                json.dump([], f)
    
    def save_event(self, event: Dict[str, Any]) -> str:
        """
        Save a single event.
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            str: Event ID
        """
        # Generate a unique ID for the event
        event_id = self._generate_event_id(event)
        event['id'] = event_id
        
        # Save the event to a file
        event_file = os.path.join(self.storage_dir, f"{event_id}.json")
        with open(event_file, 'w') as f:
            json.dump(event, f, indent=2)
        
        # Update the index
        self._update_index(event)
        
        return event_id
    
    def save_events(self, events: List[Dict[str, Any]]) -> List[str]:
        """
        Save multiple events.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of event IDs
        """
        event_ids = []
        for event in events:
            event_id = self.save_event(event)
            event_ids.append(event_id)
        return event_ids
    
    def get_event(self, event_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a single event by ID.
        
        Args:
            event_id (str): Event ID
            
        Returns:
            dict: Event dictionary or None if not found
        """
        event_file = os.path.join(self.storage_dir, f"{event_id}.json")
        if not os.path.exists(event_file):
            return None
            
        with open(event_file, 'r') as f:
            return json.load(f)
    
    def get_events(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Get events with optional filters.
        
        Args:
            filters (dict, optional): Filter criteria
            
        Returns:
            list: List of event dictionaries
        """
        # Load the index
        with open(self.index_file, 'r') as f:
            index = json.load(f)
        
        # Apply filters if provided
        if filters:
            filtered_index = self._apply_filters(index, filters)
        else:
            filtered_index = index
        
        # Load the full event data for each index entry
        events = []
        for entry in filtered_index:
            event = self.get_event(entry['id'])
            if event:
                events.append(event)
        
        return events
    
    def event_exists(self, event: Dict[str, Any]) -> bool:
        """
        Check if an event already exists (for deduplication).
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            bool: True if the event exists, False otherwise
        """
        event_id = self._generate_event_id(event)
        event_file = os.path.join(self.storage_dir, f"{event_id}.json")
        return os.path.exists(event_file)
    
    def _generate_event_id(self, event: Dict[str, Any]) -> str:
        """
        Generate a unique ID for an event based on its properties.
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            str: Unique event ID
        """
        # Use a combination of name, date, and source to create a unique ID
        name = event.get('name', '').lower().replace(' ', '_')[:30]
        date = event.get('date', '').replace('-', '')
        source = event.get('source', '').lower()
        
        # Create a unique ID
        import hashlib
        hash_input = f"{name}_{date}_{source}"
        hash_obj = hashlib.md5(hash_input.encode())
        hash_str = hash_obj.hexdigest()[:10]
        
        return f"{source}_{date}_{hash_str}"
    
    def _update_index(self, event: Dict[str, Any]):
        """
        Update the event index with a new event.
        
        Args:
            event (dict): Event dictionary
        """
        # Create index entry with key fields for searching
        index_entry = {
            'id': event['id'],
            'name': event.get('name', ''),
            'date': event.get('date', ''),
            'location': event.get('location', {}),
            'source': event.get('source', ''),
            'categories': event.get('categories', []),
            'family_friendly': event.get('family_friendly', False)
        }
        
        # Load the current index
        with open(self.index_file, 'r') as f:
            index = json.load(f)
        
        # Check if the event already exists in the index
        for i, entry in enumerate(index):
            if entry['id'] == event['id']:
                # Update existing entry
                index[i] = index_entry
                break
        else:
            # Add new entry
            index.append(index_entry)
        
        # Save the updated index
        with open(self.index_file, 'w') as f:
            json.dump(index, f, indent=2)
    
    def _apply_filters(self, index: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Apply filters to the event index.
        
        Args:
            index (list): Event index
            filters (dict): Filter criteria
            
        Returns:
            list: Filtered event index
        """
        filtered_index = index
        
        # Filter by location (city, state)
        if 'location' in filters:
            location_filters = filters['location']
            if 'city' in location_filters:
                city = location_filters['city'].lower()
                filtered_index = [
                    entry for entry in filtered_index
                    if entry.get('location', {}).get('city', '').lower() == city
                ]
            
            if 'state' in location_filters:
                state = location_filters['state'].lower()
                filtered_index = [
                    entry for entry in filtered_index
                    if entry.get('location', {}).get('state', '').lower() == state
                ]
        
        # Filter by date range
        if 'date_range' in filters:
            date_range = filters['date_range']
            if 'start' in date_range:
                start_date = date_range['start']
                filtered_index = [
                    entry for entry in filtered_index
                    if entry.get('date', '') >= start_date
                ]
            
            if 'end' in date_range:
                end_date = date_range['end']
                filtered_index = [
                    entry for entry in filtered_index
                    if entry.get('date', '') <= end_date
                ]
        
        # Filter by categories
        if 'categories' in filters:
            categories = filters['categories']
            filtered_index = [
                entry for entry in filtered_index
                if any(cat in entry.get('categories', []) for cat in categories)
            ]
        
        # Filter by family-friendly
        if 'family_friendly' in filters:
            family_friendly = filters['family_friendly']
            filtered_index = [
                entry for entry in filtered_index
                if entry.get('family_friendly', False) == family_friendly
            ]
        
        return filtered_index
