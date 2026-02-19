"""
Meetup scraper implementation for extracting events from Meetup.com.
"""
import re
import json
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from bs4 import BeautifulSoup

from .base_scraper import BaseScraper

class MeetupScraper(BaseScraper):
    """
    Scraper for Meetup.com events.
    """
    
    def __init__(self, config=None):
        """
        Initialize the Meetup scraper.
        
        Args:
            config (dict, optional): Configuration dictionary
        """
        default_config = {
            'rate_limit': 0.5,  # Meetup-specific rate limit
            'max_pages': 3,     # Maximum number of pages to scrape
        }
        
        if config:
            default_config.update(config)
            
        super().__init__(default_config)
    
    def scrape(self, location: Dict[str, str], date_range: Optional[Dict[str, datetime]] = None) -> List[Dict[str, Any]]:
        """
        Scrape Meetup events for the given location and date range.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            date_range (dict, optional): Date range with 'start' and 'end' datetime objects
            
        Returns:
            list: List of event dictionaries
        """
        if not date_range:
            date_range = self.get_default_date_range()
            
        url = self.get_url(location)
        
        def extract_events_from_page(html_content):
            events, has_next_page = self.extract_events(html_content)
            return events, has_next_page
        
        raw_events = self.handle_pagination(url, extract_events_from_page)
        return self.normalize_data(raw_events, "meetup")
    
    def get_url(self, location: Dict[str, str], page: int = 1) -> str:
        """
        Generate URL for the given location.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            page (int): Page number for pagination
            
        Returns:
            str: URL to scrape
        """
        city = location.get('city', '')
        state = location.get('state', '')
        country = location.get('country', 'us')
        
        location_string = f"{city}, {state}, {country}".replace(' ', '+')
        
        if page == 1:
            return f"https://www.meetup.com/find/?location={location_string}&source=EVENTS"
        else:
            return f"https://www.meetup.com/find/?location={location_string}&source=EVENTS&page={page}"
    
    def extract_events(self, html_content: str) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Extract event data from HTML content.
        
        Args:
            html_content (str): HTML content from Meetup.com
            
        Returns:
            tuple: (List of raw event dictionaries, Boolean indicating if there's a next page)
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        events = []
        
        # Look for event cards
        event_cards = soup.select('div[data-testid="event-card"]')
        
        for card in event_cards:
            try:
                event = {}
                
                # Extract event name
                title_elem = card.select_one('h2, h3')
                if title_elem:
                    event['name'] = title_elem.text.strip()
                
                # Extract date and time
                date_elem = card.select_one('time')
                if date_elem:
                    date_text = date_elem.text.strip()
                    event['date_text'] = date_text
                    
                    # Try to parse date and time
                    try:
                        # Meetup uses various date formats, try to handle common ones
                        date_match = re.search(r'([A-Za-z]+)\s+(\d+)', date_text)
                        time_match = re.search(r'(\d+):(\d+)\s+([AP]M)', date_text)
                        
                        if date_match and time_match:
                            month = date_match.group(1)
                            day = int(date_match.group(2))
                            hour = int(time_match.group(1))
                            minute = int(time_match.group(2))
                            am_pm = time_match.group(3)
                            
                            # Convert to 24-hour format
                            if am_pm.upper() == 'PM' and hour < 12:
                                hour += 12
                            elif am_pm.upper() == 'AM' and hour == 12:
                                hour = 0
                                
                            # Assume current year for now
                            current_year = datetime.now().year
                            month_num = datetime.strptime(month[:3], '%b').month
                            
                            event_date = datetime(current_year, month_num, day, hour, minute)
                            event['date'] = event_date.strftime('%Y-%m-%d')
                            event['start_time'] = event_date.strftime('%H:%M')
                    except Exception as e:
                        # If parsing fails, keep the raw text
                        print(f"Error parsing date: {e}")
                
                # Extract location
                location_elem = card.select_one('address, [data-testid="venue-name"]')
                if location_elem:
                    event['location'] = {
                        'name': location_elem.text.strip(),
                        'address': location_elem.text.strip()
                    }
                
                # Extract URL
                link_elem = card.select_one('a[href*="/events/"]')
                if link_elem and 'href' in link_elem.attrs:
                    href = link_elem['href']
                    if not href.startswith('http'):
                        href = f"https://www.meetup.com{href}"
                    event['url'] = href
                
                # Extract description (might be limited in card view)
                desc_elem = card.select_one('p, [data-testid="event-description"]')
                if desc_elem:
                    event['description'] = desc_elem.text.strip()
                
                # Extract image
                img_elem = card.select_one('img')
                if img_elem and 'src' in img_elem.attrs:
                    event['image_url'] = img_elem['src']
                
                # Extract group name
                group_elem = card.select_one('[data-testid="group-name"]')
                if group_elem:
                    event['group_name'] = group_elem.text.strip()
                
                events.append(event)
            except Exception as e:
                print(f"Error extracting event: {e}")
        
        # Check if there's a next page
        next_button = soup.select_one('button[aria-label="Next"]')
        has_next_page = next_button is not None and not next_button.get('disabled')
        
        return events, has_next_page
    
    def _extract_name(self, raw_event: Dict[str, Any]) -> str:
        """Extract event name from raw event data."""
        return raw_event.get('name', 'Unnamed Meetup Event')
    
    def _format_location(self, raw_event: Dict[str, Any]) -> Dict[str, str]:
        """Format event location."""
        location = raw_event.get('location', {})
        if isinstance(location, str):
            return {"name": location, "address": location}
        return location
    
    def _extract_description(self, raw_event: Dict[str, Any]) -> str:
        """Extract event description."""
        return raw_event.get('description', '')
    
    def _extract_url(self, raw_event: Dict[str, Any]) -> str:
        """Extract event URL."""
        return raw_event.get('url', '')
