"""
Test script for the event categorization system.
"""
import os
import sys
import json
from datetime import datetime

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.categorization.event_categorizer import EventCategorizer

def test_categorization():
    """Test the event categorization system with sample events."""
    print("Testing Event Categorization System")
    
    # Create sample events
    sample_events = [
        {
            "name": "Summer Music Festival",
            "description": "Join us for a weekend of live music performances featuring local bands and artists. Food and drinks available.",
            "date": "2025-07-15",
            "start_time": "18:00",
            "location": {
                "name": "City Park",
                "address": "123 Park Ave",
                "city": "Example City"
            },
            "source": "test"
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
            "source": "test"
        },
        {
            "name": "Children's Art Workshop",
            "description": "A fun and educational art workshop for kids ages 5-12. All materials provided. Parents welcome to join.",
            "date": "2025-05-20",
            "start_time": "10:00",
            "location": {
                "name": "Community Center",
                "address": "789 Main St",
                "city": "Example City"
            },
            "source": "test"
        },
        {
            "name": "Tech Startup Networking",
            "description": "Connect with local entrepreneurs and investors in the tech industry. Beer and wine will be served.",
            "date": "2025-06-05",
            "start_time": "19:00",
            "location": {
                "name": "Innovation Hub",
                "address": "101 Tech Blvd",
                "city": "Example City"
            },
            "source": "test"
        },
        {
            "name": "Wine Tasting Festival",
            "description": "Sample wines from local vineyards and enjoy gourmet food pairings. Must be 21+ to attend.",
            "date": "2025-08-12",
            "start_time": "17:00",
            "location": {
                "name": "Vineyard Gardens",
                "address": "202 Grape Ln",
                "city": "Example City"
            },
            "source": "test"
        }
    ]
    
    # Initialize categorizer
    categorizer = EventCategorizer()
    
    # Categorize events
    categorized_events = categorizer.categorize_events(sample_events)
    
    # Print results
    print("\nCategorization Results:")
    print("======================")
    
    for event in categorized_events:
        print(f"\nEvent: {event['name']}")
        print(f"Categories: {', '.join(event['categories'])}")
        print(f"Family-friendly: {'Yes' if event['family_friendly'] else 'No'}")
    
    # Save results to file
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'categorization_test_results.json')
    with open(output_file, 'w') as f:
        json.dump(categorized_events, f, indent=2)
    
    print(f"\nResults saved to {output_file}")

if __name__ == "__main__":
    test_categorization()
