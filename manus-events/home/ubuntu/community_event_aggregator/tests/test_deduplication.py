"""
Test script for the duplicate detection system.
"""
import os
import sys
import json
from datetime import datetime

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.deduplication.duplicate_detector import DuplicateDetector

def test_deduplication():
    """Test the duplicate detection system with sample events."""
    print("Testing Duplicate Detection System")
    
    # Create sample events with some duplicates
    sample_events = [
        {
            "name": "Summer Music Festival",
            "description": "Join us for a weekend of live music performances featuring local bands and artists.",
            "date": "2025-07-15",
            "start_time": "18:00",
            "location": {
                "name": "City Park",
                "address": "123 Park Ave",
                "city": "Example City"
            },
            "source": "meetup"
        },
        {
            "name": "Summer Music Fest",
            "description": "A weekend of amazing live music in the park. Local food vendors will be present.",
            "date": "2025-07-15",
            "start_time": "18:30",
            "location": {
                "name": "City Park",
                "address": "123 Park Avenue",
                "city": "Example City"
            },
            "source": "eventbrite"
        },
        {
            "name": "Basketball Tournament",
            "description": "Annual basketball championship with teams from across the region competing for the title.",
            "date": "2025-04-10",
            "start_time": "09:00",
            "location": {
                "name": "Sports Arena",
                "address": "456 Stadium Rd",
                "city": "Example City"
            },
            "source": "meetup"
        },
        {
            "name": "Regional Basketball Championship",
            "description": "Teams from all over the region compete in our annual basketball tournament.",
            "date": "2025-04-10",
            "start_time": "09:00",
            "location": {
                "name": "Sports Arena",
                "address": "456 Stadium Road",
                "city": "Example City"
            },
            "source": "city_website"
        },
        {
            "name": "Children's Art Workshop",
            "description": "A fun and educational art workshop for kids ages 5-12. All materials provided.",
            "date": "2025-05-20",
            "start_time": "10:00",
            "location": {
                "name": "Community Center",
                "address": "789 Main St",
                "city": "Example City"
            },
            "source": "eventbrite"
        },
        {
            "name": "Tech Startup Networking",
            "description": "Connect with local entrepreneurs and investors in the tech industry.",
            "date": "2025-06-05",
            "start_time": "19:00",
            "location": {
                "name": "Innovation Hub",
                "address": "101 Tech Blvd",
                "city": "Example City"
            },
            "source": "meetup"
        },
        {
            "name": "Wine Tasting Festival",
            "description": "Sample wines from local vineyards and enjoy gourmet food pairings.",
            "date": "2025-08-12",
            "start_time": "17:00",
            "location": {
                "name": "Vineyard Gardens",
                "address": "202 Grape Ln",
                "city": "Example City"
            },
            "source": "eventbrite"
        },
        {
            "name": "Annual Wine Festival",
            "description": "The city's premier wine tasting event featuring local vineyards and gourmet food.",
            "date": "2025-08-12",
            "start_time": "17:30",
            "location": {
                "name": "Vineyard Gardens",
                "address": "202 Grape Lane",
                "city": "Example City"
            },
            "source": "city_website"
        }
    ]
    
    # Initialize duplicate detector
    detector = DuplicateDetector()
    
    # Detect and merge duplicates
    deduplicated_events = detector.detect_duplicates(sample_events)
    
    # Print results
    print("\nDeduplication Results:")
    print("======================")
    print(f"Original event count: {len(sample_events)}")
    print(f"Deduplicated event count: {len(deduplicated_events)}")
    
    # Print merged events
    merged_events = [event for event in deduplicated_events if event.get('merged', False)]
    print(f"\nMerged events: {len(merged_events)}")
    
    for event in merged_events:
        print(f"\nMerged Event: {event['name']}")
        print(f"Original sources: {event['original_sources']}")
        print(f"Date: {event['date']}, Time: {event.get('start_time', 'N/A')}")
        print(f"Location: {event.get('location', {}).get('name', 'N/A')}")
    
    # Save results to file
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'deduplication_test_results.json')
    with open(output_file, 'w') as f:
        json.dump(deduplicated_events, f, indent=2)
    
    print(f"\nResults saved to {output_file}")

if __name__ == "__main__":
    test_deduplication()
