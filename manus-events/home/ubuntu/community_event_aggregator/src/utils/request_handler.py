"""
Request Handler module for making HTTP requests with rate limiting and retries.
"""
import time
import random
import requests
from urllib.robotparser import RobotFileParser
from requests.exceptions import RequestException

class RequestHandler:
    """
    Handles HTTP requests with proper rate limiting, retries, and user-agent rotation.
    """
    
    def __init__(self, rate_limit=1, retry_count=3, timeout=30):
        """
        Initialize the RequestHandler.
        
        Args:
            rate_limit (float): Maximum requests per second
            retry_count (int): Number of retry attempts for failed requests
            timeout (int): Request timeout in seconds
        """
        self.rate_limit = rate_limit  # Requests per second
        self.retry_count = retry_count
        self.timeout = timeout
        self.last_request_time = 0
        
        # List of common user agents for rotation
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
        ]
        
        # Cache for robots.txt
        self.robots_cache = {}
        
    def get(self, url, headers=None, params=None):
        """
        Make a GET request with rate limiting and retries.
        
        Args:
            url (str): URL to request
            headers (dict, optional): HTTP headers
            params (dict, optional): URL parameters
            
        Returns:
            requests.Response: Response object
            
        Raises:
            RequestException: If request fails after all retries
        """
        if not self.respect_robots_txt(url):
            raise RequestException(f"URL {url} is disallowed by robots.txt")
        
        # Apply rate limiting
        self._apply_rate_limit()
        
        # Set up headers with user agent rotation
        if headers is None:
            headers = {}
        headers['User-Agent'] = self.rotate_user_agent()
        
        # Try the request with retries
        last_exception = None
        for attempt in range(self.retry_count + 1):
            try:
                response = requests.get(
                    url, 
                    headers=headers, 
                    params=params,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response
            except RequestException as e:
                last_exception = e
                if attempt < self.retry_count:
                    # Exponential backoff
                    wait_time = 2 ** attempt + random.random()
                    time.sleep(wait_time)
        
        # If we get here, all retries failed
        raise last_exception or RequestException(f"Failed to get {url} after {self.retry_count} retries")
    
    def _apply_rate_limit(self):
        """
        Apply rate limiting by waiting if necessary.
        """
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        # If we've made a request too recently, wait
        if elapsed < (1 / self.rate_limit):
            wait_time = (1 / self.rate_limit) - elapsed
            time.sleep(wait_time)
        
        self.last_request_time = time.time()
    
    def rotate_user_agent(self):
        """
        Return a randomly selected user agent.
        
        Returns:
            str: User agent string
        """
        return random.choice(self.user_agents)
    
    def respect_robots_txt(self, url):
        """
        Check if scraping is allowed by robots.txt.
        
        Args:
            url (str): URL to check
            
        Returns:
            bool: True if scraping is allowed, False otherwise
        """
        try:
            from urllib.parse import urlparse
            parsed_url = urlparse(url)
            base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            
            # Check cache first
            if base_url in self.robots_cache:
                rp = self.robots_cache[base_url]
            else:
                # Fetch and parse robots.txt
                rp = RobotFileParser()
                rp.set_url(f"{base_url}/robots.txt")
                rp.read()
                self.robots_cache[base_url] = rp
            
            # Check if our user agent is allowed
            user_agent = self.rotate_user_agent()
            path = parsed_url.path
            if not path:
                path = "/"
                
            return rp.can_fetch(user_agent, path)
        except Exception:
            # If there's any error checking robots.txt, assume it's allowed
            return True
