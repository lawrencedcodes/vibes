"""
City website scraper implementation for extracting events from city government websites.
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urljoin

from .base_scraper import BaseScraper

class CityWebsiteScraper(BaseScraper):
    """
    Scraper for city government websites.
    This is a configurable scraper that can be adapted to different city website formats.
    """
    
    def __init__(self, config=None):
        """
        Initialize the City Website scraper.
        
        Args:
            config (dict, optional): Configuration dictionary with city-specific settings
        """
        default_config = {
            'rate_limit': 1.0,
            'max_pages': 2,
            'url_template': None,  # Must be provided in config
            'event_selector': None,  # Must be provided in config
            'name_selector': None,  # Must be provided in config
            'date_selector': None,  # Must be provided in config
            'location_selector': None,  # Optional
            'description_selector': None,  # Optional
            'url_selector': None,  # Optional
            'image_selector': None,  # Optional
            'pagination_selector': None,  # Optional
            'date_format': '%B %d, %Y',  # Default date format
            'time_format': '%I:%M %p',  # Default time format
            'city_name': None,  # Must be provided in config
        }
        
        if config:
            default_config.update(config)
            
        # Ensure required config items are present
        required_fields = ['url_template', 'event_selector', 'name_selector', 'date_selector', 'city_name']
        for field in required_fields:
            if not default_config.get(field):
                raise ValueError(f"Required configuration field '{field}' is missing")
                
        super().__init__(default_config)
    
    def scrape(self, location: Dict[str, str], date_range: Optional[Dict[str, datetime]] = None) -> List[Dict[str, Any]]:
        """
        Scrape city website events for the given location and date range.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            date_range (dict, optional): Date range with 'start' and 'end' datetime objects
            
        Returns:
            list: List of event dictionaries
        """
        if not date_range:
            date_range = self.get_default_date_range()
            
        # Check if this scraper is for the requested city
        if location.get('city', '').lower() != self.config['city_name'].lower():
            print(f"This scraper is for {self.config['city_name']}, not {location.get('city')}")
            return []
            
        url = self.get_url(location)
        
        def extract_events_from_page(html_content):
            events, has_next_page = self.extract_events(html_content, url)
            return events, has_next_page
        
        # If pagination is supported
        if self.config.get('pagination_selector'):
            raw_events = self.handle_pagination(url, extract_events_from_page)
        else:
            # Just scrape the single page
            response = self.request_handler.get(url)
            raw_events, _ = self.extract_events(response.text, url)
        
        return self.normalize_data(raw_events, f"city_{self.config['city_name'].lower()}")
    
    def get_url(self, location: Dict[str, str], page: int = 1) -> str:
        """
        Generate URL for the given location.
        
        Args:
            location (dict): Location dictionary
            page (int): Page number for pagination
            
        Returns:
            str: URL to scrape
        """
        # Use the template from config
        url_template = self.config['url_template']
        
        # Replace placeholders if any
        url = url_template.format(
            city=location.get('city', ''),
            state=location.get('state', ''),
            country=location.get('country', ''),
            page=page
        )
        
        return url
    
    def extract_events(self, html_content: str, base_url: str) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Extract event data from HTML content.
        
        Args:
            html_content (str): HTML content from the city website
            base_url (str): Base URL for resolving relative links
            
        Returns:
            tuple: (List of raw event dictionaries, Boolean indicating if there's a next page)
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        events = []
        
        # Use the selectors from config to find events
        event_elements = soup.select(self.config['event_selector'])
        
        for event_elem in event_elements:
            try:
                event = {}
                
                # Extract event name
                name_elem = event_elem.select_one(self.config['name_selector'])
                if name_elem:
                    event['name'] = name_elem.text.strip()
                else:
                    # Skip events without a name
                    continue
                
                # Extract date and time
                date_elem = event_elem.select_one(self.config['date_selector'])
                if date_elem:
                    date_text = date_elem.text.strip()
                    event['date_text'] = date_text
                    
                    # Try to parse date and time
                    try:
                        # Try to extract date using the configured format
                        date_format = self.config.get('date_format', '%B %d, %Y')
                        
                        # Look for date patterns
                        date_match = re.search(r'(\w+\s+\d+,?\s+\d{4})', date_text)
                        time_match = re.search(r'(\d+:\d+\s*[AP]M)', date_text, re.IGNORECASE)
                        
                        if date_match:
                            date_str = date_match.group(1)
                            try:
                                parsed_date = datetime.strptime(date_str, date_format)
                                event['date'] = parsed_date.strftime('%Y-%m-%d')
                            except ValueError:
                                # Try alternative formats
                                try:
                                    parsed_date = datetime.strptime(date_str, '%B %d %Y')
                                    event['date'] = parsed_date.strftime('%Y-%m-%d')
                                except ValueError:
                                    pass
                        
                        if time_match:
                            time_str = time_match.group(1)
                            time_format = self.config.get('time_format', '%I:%M %p')
                            try:
                                parsed_time = datetime.strptime(time_str, time_format)
                                event['start_time'] = parsed_time.strftime('%H:%M')
                            except ValueError:
                                pass
                    except Exception as e:
                        print(f"Error parsing date: {e}")
                
                # Extract location
                if self.config.get('location_selector'):
                    location_elem = event_elem.select_one(self.config['location_selector'])
                    if location_elem:
                        event['location'] = {
                            'name': location_elem.text.strip(),
                            'address': location_elem.text.strip(),
                            'city': self.config['city_name']
                        }
                
                # Extract URL
                if self.config.get('url_selector'):
                    url_elem = event_elem.select_one(self.config['url_selector'])
                    if url_elem and 'href' in url_elem.attrs:
                        href = url_elem['href']
                        # Handle relative URLs
                        if not href.startswith('http'):
                            href = urljoin(base_url, href)
                        event['url'] = href
                
                # Extract description
                if self.config.get('description_selector'):
                    desc_elem = event_elem.select_one(self.config['description_selector'])
                    if desc_elem:
                        event['description'] = desc_elem.text.strip()
                
                # Extract image
                if self.config.get('image_selector'):
                    img_elem = event_elem.select_one(self.config['image_selector'])
                    if img_elem and 'src' in img_elem.attrs:
                        img_src = img_elem['src']
                        # Handle relative URLs
                        if not img_src.startswith('http'):
                            img_src = urljoin(base_url, img_src)
                        event['image_url'] = img_src
                
                events.append(event)
            except Exception as e:
                print(f"Error extracting event: {e}")
        
        # Check if there's a next page
        has_next_page = False
        if self.config.get('pagination_selector'):
            next_button = soup.select_one(self.config['pagination_selector'])
            has_next_page = next_button is not None and not ('disabled' in next_button.attrs)
        
        return events, has_next_page
    
    def _extract_name(self, raw_event: Dict[str, Any]) -> str:
        """Extract event name from raw event data."""
        return raw_event.get('name', f"Unnamed {self.config['city_name']} Event")
    
    def _format_location(self, raw_event: Dict[str, Any]) -> Dict[str, str]:
        """Format event location."""
        location = raw_event.get('location', {})
        if isinstance(location, str):
            return {
                "name": location, 
                "address": location,
                "city": self.config['city_name']
            }
        
        # Ensure city is included
        if isinstance(location, dict) and 'city' not in location:
            location['city'] = self.config['city_name']
            
        return location
    
    def _extract_description(self, raw_event: Dict[str, Any]) -> str:
        """Extract event description."""
        return raw_event.get('description', '')
    
    def _extract_url(self, raw_event: Dict[str, Any]) -> str:
        """Extract event URL."""
        return raw_event.get('url', '')
