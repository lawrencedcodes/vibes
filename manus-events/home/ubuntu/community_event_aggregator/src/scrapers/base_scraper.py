"""
Base scraper interface that all source-specific scrapers must implement.
"""
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from ..utils.request_handler import RequestHandler

class BaseScraper(ABC):
    """
    Abstract base class for all event scrapers.
    """
    
    def __init__(self, config=None):
        """
        Initialize the base scraper.
        
        Args:
            config (dict, optional): Configuration dictionary
        """
        self.config = config or {}
        self.request_handler = RequestHandler(
            rate_limit=self.config.get('rate_limit', 1),
            retry_count=self.config.get('retry_count', 3),
            timeout=self.config.get('timeout', 30)
        )
        
    @abstractmethod
    def scrape(self, location: Dict[str, str], date_range: Optional[Dict[str, datetime]] = None) -> List[Dict[str, Any]]:
        """
        Main method to be implemented by each scraper.
        
        Args:
            location (dict): Location dictionary with keys like 'city', 'state', 'country'
            date_range (dict, optional): Date range with 'start' and 'end' datetime objects
            
        Returns:
            list: List of event dictionaries
        """
        raise NotImplementedError("Subclasses must implement scrape method")
    
    @abstractmethod
    def get_url(self, location: Dict[str, str], page: int = 1) -> str:
        """
        Generate URL for the given location.
        
        Args:
            location (dict): Location dictionary
            page (int): Page number for pagination
            
        Returns:
            str: URL to scrape
        """
        raise NotImplementedError("Subclasses must implement get_url method")
    
    def handle_pagination(self, url: str, extract_func) -> List[Dict[str, Any]]:
        """
        Handle pagination if the source has multiple pages.
        
        Args:
            url (str): Base URL for the first page
            extract_func (callable): Function to extract events from a page
            
        Returns:
            list: Combined list of events from all pages
        """
        all_events = []
        page = 1
        more_pages = True
        
        while more_pages and page <= self.config.get('max_pages', 5):
            page_url = url if page == 1 else self.get_url_for_page(url, page)
            response = self.request_handler.get(page_url)
            
            page_events, has_next = extract_func(response.text)
            all_events.extend(page_events)
            
            if not has_next:
                more_pages = False
            
            page += 1
        
        return all_events
    
    def get_url_for_page(self, base_url: str, page: int) -> str:
        """
        Generate URL for a specific page.
        Default implementation adds page parameter to URL.
        
        Args:
            base_url (str): Base URL
            page (int): Page number
            
        Returns:
            str: URL with page parameter
        """
        if '?' in base_url:
            return f"{base_url}&page={page}"
        else:
            return f"{base_url}?page={page}"
    
    def normalize_data(self, raw_events: List[Dict[str, Any]], source: str) -> List[Dict[str, Any]]:
        """
        Convert source-specific data to standard format.
        
        Args:
            raw_events (list): List of raw event dictionaries
            source (str): Source name
            
        Returns:
            list: List of normalized event dictionaries
        """
        normalized_events = []
        
        for raw_event in raw_events:
            try:
                normalized_event = {
                    "name": self._extract_name(raw_event),
                    "date": self._format_date(raw_event),
                    "start_time": self._format_time(raw_event, "start"),
                    "end_time": self._format_time(raw_event, "end"),
                    "location": self._format_location(raw_event),
                    "description": self._extract_description(raw_event),
                    "url": self._extract_url(raw_event),
                    "source": source,
                    "image_url": self._extract_image(raw_event),
                    "raw_data": raw_event  # Store original data for reference
                }
                normalized_events.append(normalized_event)
            except Exception as e:
                print(f"Error normalizing event: {e}")
                # Continue with next event
        
        return normalized_events
    
    def _extract_name(self, raw_event: Dict[str, Any]) -> str:
        """Extract event name from raw event data."""
        return raw_event.get('name', raw_event.get('title', 'Unnamed Event'))
    
    def _format_date(self, raw_event: Dict[str, Any]) -> str:
        """Format event date to ISO format (YYYY-MM-DD)."""
        date = raw_event.get('date')
        if isinstance(date, datetime):
            return date.strftime('%Y-%m-%d')
        return date or datetime.now().strftime('%Y-%m-%d')
    
    def _format_time(self, raw_event: Dict[str, Any], time_type: str) -> Optional[str]:
        """Format event time to 24-hour format (HH:MM)."""
        time_key = f"{time_type}_time"
        time_val = raw_event.get(time_key)
        
        if isinstance(time_val, datetime):
            return time_val.strftime('%H:%M')
        return time_val
    
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
    
    def _extract_image(self, raw_event: Dict[str, Any]) -> Optional[str]:
        """Extract event image URL."""
        return raw_event.get('image_url')
    
    def get_default_date_range(self) -> Dict[str, datetime]:
        """
        Get default date range (today to 30 days from now).
        
        Returns:
            dict: Date range with 'start' and 'end' datetime objects
        """
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = today + timedelta(days=30)
        return {
            'start': today,
            'end': end_date
        }
