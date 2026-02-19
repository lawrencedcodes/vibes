# Community Event Aggregator

A web application that aggregates local events from various public sources into a single, searchable calendar.

## Features

- **Event Aggregation**: Collects events from multiple sources (city websites, Meetup, Eventbrite, etc.)
- **Automatic Categorization**: Categorizes events into groups (music, sports, arts, etc.)
- **Duplicate Detection**: Automatically identifies and merges duplicate events from different sources
- **Search Functionality**: Find events by location, date range, category, and more
- **Family-Friendly Filter**: Option to show only family-friendly events
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Installation

### Prerequisites

- Docker and Docker Compose
- Or: Python 3.8+ with pip

### Option 1: Using Docker (Recommended)

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/community-event-aggregator.git
   cd community-event-aggregator
   ```

2. Build and run the Docker container:
   ```
   docker-compose up -d
   ```

3. Access the application at http://localhost:5000

### Option 2: Manual Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/community-event-aggregator.git
   cd community-event-aggregator
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   flask run
   ```

5. Access the application at http://localhost:5000

## Usage

1. Enter your city and state in the search form
2. Optionally select a date range, category, or check the family-friendly option
3. Click "Search" to find events
4. Browse events in grid or list view
5. Filter events by category using the category pills
6. Click "View Details" to see more information about an event

## Development

### Project Structure

```
community_event_aggregator/
├── src/
│   ├── scrapers/         # Web scraping modules
│   ├── categorization/   # Event categorization system
│   ├── deduplication/    # Duplicate detection algorithm
│   ├── models/           # Data models and services
│   └── utils/            # Utility functions
├── static/
│   ├── css/              # CSS stylesheets
│   └── js/               # JavaScript files
├── templates/            # HTML templates
├── tests/                # Test scripts
├── data/                 # Data storage
├── app.py               # Main application file
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
└── docker-compose.yml   # Docker Compose configuration
```

### Running Tests

```
python -m unittest discover tests
```

## Technical Details

### Data Sources

The application collects event data from:
- City and government websites
- Meetup.com public event pages
- Eventbrite public event listings
- University and college websites
- Community forums and bulletin boards

### Categorization

Events are automatically categorized based on their content into categories such as:
- Music
- Sports
- Arts
- Food
- Education
- Community
- Family
- Business
- Technology
- Health

### Duplicate Detection

The application uses a similarity scoring system to identify duplicate events based on:
- Event name similarity
- Date and time proximity
- Location similarity
- Content similarity

## License

This project is licensed under the MIT License - see the LICENSE file for details.
