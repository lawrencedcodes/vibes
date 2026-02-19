"""
Scraper Manager for orchestrating the execution of individual source scrapers.
"""
from typing import Dict, List, Any, Optional
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

from ..scrapers.base_scraper import BaseScraper
from ..scrapers.meetup_scraper import MeetupScraper
from ..scrapers.eventbrite_scraper import EventbriteScraper
from ..scrapers.city_website_scraper import CityWebsiteScraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('scraper_manager')

class ScraperManager:
    """
    Manages the execution of individual source scrapers.
    """
    
    def __init__(self):
        """Initialize the Scraper Manager."""
        self.scrapers = {}  # Dictionary of registered scrapers
        self.config = {
            'max_workers': 3,  # Maximum number of concurrent scrapers
            'timeout': 120,    # Timeout for each scraper in seconds
        }
        
    def register_scraper(self, name: str, scraper_instance: BaseScraper):
        """
        Register a new scraper.
        
        Args:
            name (str): Name of the scraper
            scraper_instance (BaseScraper): Instance of a scraper
        """
        if not isinstance(scraper_instance, BaseScraper):
            raise TypeError("Scraper must be an instance of BaseScraper")
            
        self.scrapers[name] = scraper_instance
        logger.info(f"Registered scraper: {name}")
        
    def register_default_scrapers(self):
        """Register the default set of scrapers."""
        # Register Meetup scraper
        self.register_scraper('meetup', MeetupScraper())
        
        # Register Eventbrite scraper
        self.register_scraper('eventbrite', EventbriteScraper())
        
        # Example of registering a city website scraper for New York
        nyc_config = {
            'city_name': 'New York',
            'url_template': 'https://www.nyc.gov/events/events.shtml',
            'event_selector': '.event-item',
            'name_selector': '.event-title',
            'date_selector': '.event-date',
            'location_selector': '.event-location',
            'description_selector': '.event-description',
            'url_selector': '.event-title a',
            'image_selector': '.event-image img',
            'date_format': '%B %d, %Y',
        }
        self.register_scraper('nyc', CityWebsiteScraper(nyc_config))
        
        # Example of registering a city website scraper for San Francisco
        sf_config = {
            'city_name': 'San Francisco',
            'url_template': 'https://sf.gov/events',
            'event_selector': '.sfgov-event-card',
            'name_selector': '.title',
            'date_selector': '.date',
            'location_selector': '.location',
            'description_selector': '.description',
            'url_selector': 'a',
            'image_selector': 'img',
            'date_format': '%A, %B %d, %Y',
        }
        self.register_scraper('san_francisco', CityWebsiteScraper(sf_config))
        
        # More city scrapers can be added here
        
    def run_scraper(self, name: str, location: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Run a specific scraper for a given location.
        
        Args:
            name (str): Name of the scraper to run
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            
        Returns:
            list: List of event dictionaries
            
        Raises:
            KeyError: If the scraper name is not registered
        """
        if name not in self.scrapers:
            raise KeyError(f"Scraper '{name}' not registered")
            
        scraper = self.scrapers[name]
        logger.info(f"Running scraper: {name} for location: {location}")
        
        try:
            start_time = time.time()
            events = scraper.scrape(location)
            elapsed = time.time() - start_time
            
            logger.info(f"Scraper {name} completed in {elapsed:.2f}s, found {len(events)} events")
            return events
        except Exception as e:
            logger.error(f"Error running scraper {name}: {e}")
            return []
        
    def run_all_scrapers(self, location: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Run all registered scrapers for a given location.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            
        Returns:
            list: Combined list of event dictionaries from all scrapers
        """
        all_events = []
        
        # Determine which scrapers to run based on location
        scrapers_to_run = self._get_relevant_scrapers(location)
        
        if not scrapers_to_run:
            logger.warning(f"No relevant scrapers found for location: {location}")
            return []
            
        logger.info(f"Running {len(scrapers_to_run)} scrapers for location: {location}")
        
        # Run scrapers in parallel
        with ThreadPoolExecutor(max_workers=self.config['max_workers']) as executor:
            future_to_scraper = {
                executor.submit(self.run_scraper, name, location): name
                for name in scrapers_to_run
            }
            
            for future in as_completed(future_to_scraper):
                scraper_name = future_to_scraper[future]
                try:
                    events = future.result()
                    all_events.extend(events)
                    logger.info(f"Added {len(events)} events from {scraper_name}")
                except Exception as e:
                    logger.error(f"Scraper {scraper_name} generated an exception: {e}")
        
        logger.info(f"All scrapers completed, found {len(all_events)} events in total")
        return all_events
    
    def _get_relevant_scrapers(self, location: Dict[str, str]) -> List[str]:
        """
        Determine which scrapers are relevant for the given location.
        
        Args:
            location (dict): Location dictionary
            
        Returns:
            list: List of scraper names to run
        """
        city = location.get('city', '').lower()
        
        # Always include general scrapers
        relevant_scrapers = ['meetup', 'eventbrite']
        
        # Add city-specific scrapers if available
        for name, scraper in self.scrapers.items():
            if isinstance(scraper, CityWebsiteScraper):
                if scraper.config['city_name'].lower() == city:
                    relevant_scrapers.append(name)
        
        return relevant_scrapers
    
    def schedule_scraping(self, interval: int = 86400):
        """
        Schedule regular scraping at specified intervals.
        
        Args:
            interval (int): Interval in seconds (default: 24 hours)
        """
        # This is a placeholder for scheduling functionality
        # In a real implementation, this would use a scheduler like APScheduler
        logger.info(f"Scheduling scraping every {interval} seconds")
        # Implementation would go here
