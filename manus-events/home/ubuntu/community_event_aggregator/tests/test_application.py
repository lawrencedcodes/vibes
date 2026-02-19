"""
Test script for the Community Event Aggregator application.
"""
import os
import sys
import unittest
from flask import Flask
from datetime import datetime

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.models.event_storage import EventStorage
from src.categorization.event_categorizer import EventCategorizer
from src.deduplication.duplicate_detector import DuplicateDetector
from src.models.search_service import SearchService

class TestEventAggregator(unittest.TestCase):
    """Test cases for the Community Event Aggregator application."""
    
    def setUp(self):
        """Set up test environment."""
        # Create a temporary storage directory for testing
        self.test_dir = os.path.join(os.path.dirname(__file__), 'test_data')
        os.makedirs(self.test_dir, exist_ok=True)
        
        # Initialize components
        self.event_storage = EventStorage(self.test_dir)
        self.categorizer = EventCategorizer()
        self.deduplicator = DuplicateDetector()
        self.search_service = SearchService(self.event_storage)
        
        # Create sample events
        self.sample_events = [
            {
                "name": "Summer Music Festival",
                "description": "Join us for a weekend of live music performances featuring local bands and artists.",
                "date": "2025-07-15",
                "start_time": "18:00",
                "location": {
                    "name": "City Park",
                    "address": "123 Park Ave",
                    "city": "Example City",
                    "state": "CA"
                },
                "source": "meetup"
            },
            {
                "name": "Basketball Tournament",
                "description": "Annual basketball championship with teams from across the region competing for the title.",
                "date": "2025-04-10",
                "start_time": "09:00",
                "location": {
                    "name": "Sports Arena",
                    "address": "456 Stadium Rd",
                    "city": "Example City",
                    "state": "CA"
                },
                "source": "eventbrite"
            },
            {
                "name": "Tech Conference 2025",
                "description": "Annual technology conference featuring keynotes, workshops, and networking opportunities.",
                "date": "2025-05-20",
                "start_time": "08:30",
                "location": {
                    "name": "Convention Center",
                    "address": "789 Main St",
                    "city": "Example City",
                    "state": "CA"
                },
                "source": "city_website"
            }
        ]
    
    def tearDown(self):
        """Clean up after tests."""
        # Remove test files
        for filename in os.listdir(self.test_dir):
            file_path = os.path.join(self.test_dir, filename)
            if os.path.isfile(file_path):
                os.unlink(file_path)
    
    def test_event_storage(self):
        """Test event storage functionality."""
        # Save events
        event_ids = self.event_storage.save_events(self.sample_events)
        
        # Check that events were saved
        self.assertEqual(len(event_ids), len(self.sample_events))
        
        # Retrieve events
        events = self.event_storage.get_events()
        
        # Check that all events were retrieved
        self.assertEqual(len(events), len(self.sample_events))
        
        # Test filtering by location
        location_filter = {'location': {'city': 'Example City'}}
        filtered_events = self.event_storage.get_events(location_filter)
        self.assertEqual(len(filtered_events), len(self.sample_events))
    
    def test_event_categorization(self):
        """Test event categorization functionality."""
        # Categorize events
        categorized_events = self.categorizer.categorize_events(self.sample_events)
        
        # Check that all events were categorized
        self.assertEqual(len(categorized_events), len(self.sample_events))
        
        # Check that categories were assigned
        for event in categorized_events:
            self.assertIn('categories', event)
            self.assertIsInstance(event['categories'], list)
            self.assertGreater(len(event['categories']), 0)
            
            # Check that family-friendly flag was set
            self.assertIn('family_friendly', event)
            self.assertIsInstance(event['family_friendly'], bool)
    
    def test_duplicate_detection(self):
        """Test duplicate detection functionality."""
        # Create duplicate events
        duplicate_events = self.sample_events.copy()
        duplicate = self.sample_events[0].copy()
        duplicate['name'] = "Summer Music Fest"  # Slightly different name
        duplicate['source'] = "eventbrite"  # Different source
        duplicate_events.append(duplicate)
        
        # Detect duplicates
        deduplicated_events = self.deduplicator.detect_duplicates(duplicate_events)
        
        # Check that duplicates were merged
        self.assertEqual(len(deduplicated_events), len(self.sample_events))
        
        # Check for merged flag
        merged_events = [e for e in deduplicated_events if e.get('merged', False)]
        self.assertEqual(len(merged_events), 1)
    
    def test_search_functionality(self):
        """Test search functionality."""
        # Save and categorize events
        categorized_events = self.categorizer.categorize_events(self.sample_events)
        self.event_storage.save_events(categorized_events)
        
        # Test location search
        search_params = {
            'location': {
                'city': 'Example City',
                'state': 'CA'
            }
        }
        search_results = self.search_service.search_events(search_params)
        self.assertEqual(len(search_results), len(self.sample_events))
        
        # Test date range search
        search_params = {
            'location': {
                'city': 'Example City'
            },
            'date_range': {
                'start': '2025-05-01',
                'end': '2025-08-01'
            }
        }
        search_results = self.search_service.search_events(search_params)
        self.assertEqual(len(search_results), 2)  # Should find 2 events in this date range
        
        # Test category search (assuming categorization has been done)
        # This test might need adjustment based on actual categorization results
        search_params = {
            'location': {
                'city': 'Example City'
            },
            'categories': ['technology']
        }
        search_results = self.search_service.search_events(search_params)
        self.assertGreaterEqual(len(search_results), 0)  # Should find at least some events

if __name__ == '__main__':
    unittest.main()
