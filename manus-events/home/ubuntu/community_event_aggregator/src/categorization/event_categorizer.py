"""
Event categorization module for automatically categorizing events into groups.
"""
import re
from typing import Dict, List, Any, Set
import logging
from collections import Counter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('event_categorizer')

class EventCategorizer:
    """
    Categorizes events into groups based on their content.
    """
    
    def __init__(self):
        """Initialize the Event Categorizer."""
        # Define category keywords
        self.category_keywords = {
            'music': [
                'music', 'concert', 'band', 'gig', 'performance', 'festival', 'dj', 
                'live music', 'symphony', 'orchestra', 'jazz', 'rock', 'pop', 'hip hop',
                'rap', 'blues', 'country', 'electronic', 'dance music', 'singer', 'songwriter',
                'choir', 'musical', 'opera', 'pianist', 'guitarist', 'drummer', 'vocalist'
            ],
            'sports': [
                'sports', 'game', 'match', 'tournament', 'championship', 'competition',
                'football', 'soccer', 'basketball', 'baseball', 'hockey', 'tennis', 'golf',
                'swimming', 'running', 'marathon', 'race', 'cycling', 'fitness', 'workout',
                'yoga', 'pilates', 'gym', 'athletic', 'league', 'team', 'player', 'coach',
                'stadium', 'arena', 'court', 'field', 'track', 'olympics', 'sport'
            ],
            'arts': [
                'art', 'exhibition', 'gallery', 'museum', 'painting', 'sculpture', 'drawing',
                'photography', 'artist', 'creative', 'craft', 'design', 'fashion', 'theater',
                'theatre', 'play', 'performance', 'acting', 'actor', 'actress', 'stage',
                'drama', 'comedy', 'improv', 'standup', 'film', 'movie', 'cinema', 'screening',
                'director', 'producer', 'dance', 'ballet', 'contemporary', 'choreography'
            ],
            'food': [
                'food', 'drink', 'dining', 'restaurant', 'cafe', 'bar', 'pub', 'brewery',
                'winery', 'distillery', 'tasting', 'culinary', 'cooking', 'chef', 'menu',
                'dinner', 'lunch', 'breakfast', 'brunch', 'feast', 'cuisine', 'gourmet',
                'baking', 'bbq', 'barbecue', 'food truck', 'farmers market', 'organic',
                'vegan', 'vegetarian', 'wine', 'beer', 'cocktail', 'spirits', 'tasting'
            ],
            'education': [
                'education', 'learning', 'workshop', 'seminar', 'conference', 'lecture',
                'class', 'course', 'training', 'webinar', 'tutorial', 'lesson', 'study',
                'academic', 'school', 'college', 'university', 'professor', 'teacher',
                'student', 'research', 'science', 'technology', 'engineering', 'math',
                'history', 'literature', 'language', 'art class', 'coding', 'programming'
            ],
            'community': [
                'community', 'neighborhood', 'local', 'town hall', 'meeting', 'gathering',
                'social', 'networking', 'volunteer', 'charity', 'fundraiser', 'nonprofit',
                'activism', 'advocacy', 'support group', 'club', 'organization', 'association',
                'society', 'committee', 'council', 'civic', 'public', 'resident', 'citizen'
            ],
            'family': [
                'family', 'kid', 'child', 'children', 'parent', 'baby', 'toddler', 'youth',
                'teen', 'family-friendly', 'all ages', 'playground', 'park', 'zoo', 'aquarium',
                'museum', 'story time', 'puppet', 'face painting', 'carnival', 'fair', 'festival',
                'magic show', 'circus', 'amusement', 'theme park', 'disney', 'animation'
            ],
            'business': [
                'business', 'entrepreneur', 'startup', 'networking', 'professional', 'career',
                'job', 'employment', 'hiring', 'recruitment', 'interview', 'resume', 'cv',
                'corporate', 'company', 'industry', 'trade', 'commerce', 'finance', 'investment',
                'marketing', 'sales', 'management', 'leadership', 'executive', 'ceo', 'founder'
            ],
            'technology': [
                'technology', 'tech', 'digital', 'software', 'hardware', 'computer', 'programming',
                'coding', 'developer', 'web', 'mobile', 'app', 'application', 'startup', 'innovation',
                'ai', 'artificial intelligence', 'machine learning', 'data science', 'blockchain',
                'cryptocurrency', 'bitcoin', 'virtual reality', 'vr', 'augmented reality', 'ar',
                'iot', 'internet of things', 'robotics', 'automation', 'hackathon', 'meetup'
            ],
            'health': [
                'health', 'wellness', 'medical', 'healthcare', 'doctor', 'hospital', 'clinic',
                'therapy', 'counseling', 'mental health', 'physical health', 'fitness', 'exercise',
                'nutrition', 'diet', 'meditation', 'mindfulness', 'yoga', 'healing', 'holistic',
                'alternative medicine', 'pharmacy', 'drug', 'vaccine', 'immunization', 'screening'
            ]
        }
        
        # Define family-friendly keywords
        self.family_friendly_keywords = [
            'family', 'kid', 'child', 'children', 'parent', 'baby', 'toddler', 'youth',
            'teen', 'family-friendly', 'all ages', 'all-ages', 'playground', 'park', 'zoo', 
            'aquarium', 'museum', 'story time', 'puppet', 'face painting', 'carnival', 
            'fair', 'festival', 'magic show', 'circus', 'amusement', 'theme park', 'disney', 
            'animation', 'educational', 'learning', 'school', 'classroom', 'student'
        ]
        
        # Define non-family-friendly keywords
        self.non_family_friendly_keywords = [
            'alcohol', 'beer', 'wine', 'liquor', 'bar', 'pub', 'club', 'nightclub', 'adult',
            'mature', '18+', '21+', 'explicit', 'nsfw', 'burlesque', 'dating', 'singles',
            'cocktail', 'happy hour', 'drinking', 'drunk', 'booze', 'intoxicated'
        ]
        
        logger.info("Event Categorizer initialized")
    
    def categorize_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """
        Categorize a single event based on its content.
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            dict: Event dictionary with added categories
        """
        # Extract text content from the event
        event_text = self._extract_event_text(event)
        
        # Determine categories
        categories = self._determine_categories(event_text)
        
        # Determine if family-friendly
        family_friendly = self._is_family_friendly(event_text)
        
        # Add categorization to the event
        event['categories'] = list(categories)
        event['family_friendly'] = family_friendly
        
        return event
    
    def categorize_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Categorize multiple events.
        
        Args:
            events (list): List of event dictionaries
            
        Returns:
            list: List of event dictionaries with added categories
        """
        categorized_events = []
        for event in events:
            categorized_event = self.categorize_event(event)
            categorized_events.append(categorized_event)
        
        logger.info(f"Categorized {len(events)} events")
        return categorized_events
    
    def _extract_event_text(self, event: Dict[str, Any]) -> str:
        """
        Extract text content from an event for categorization.
        
        Args:
            event (dict): Event dictionary
            
        Returns:
            str: Combined text content from the event
        """
        text_parts = []
        
        # Add event name
        if 'name' in event:
            text_parts.append(event['name'])
        
        # Add event description
        if 'description' in event:
            text_parts.append(event['description'])
        
        # Add location name if available
        if 'location' in event and isinstance(event['location'], dict):
            location = event['location']
            if 'name' in location:
                text_parts.append(location['name'])
        
        # Add any other relevant text fields
        if 'group_name' in event:
            text_parts.append(event['group_name'])
        
        if 'organizer' in event:
            text_parts.append(event['organizer'])
        
        # Combine all text
        return ' '.join(text_parts).lower()
    
    def _determine_categories(self, text: str) -> Set[str]:
        """
        Determine categories for an event based on its text content.
        
        Args:
            text (str): Event text content
            
        Returns:
            set: Set of category names
        """
        categories = set()
        category_scores = {}
        
        # Calculate score for each category
        for category, keywords in self.category_keywords.items():
            score = 0
            for keyword in keywords:
                # Count occurrences of the keyword
                count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', text))
                score += count
            
            if score > 0:
                category_scores[category] = score
        
        # If no categories found, add 'other'
        if not category_scores:
            categories.add('other')
            return categories
        
        # Get top categories (up to 3)
        top_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Only include categories with a minimum score
        for category, score in top_categories:
            if score >= 1:  # At least one keyword match
                categories.add(category)
        
        # If still no categories, add 'other'
        if not categories:
            categories.add('other')
        
        return categories
    
    def _is_family_friendly(self, text: str) -> bool:
        """
        Determine if an event is family-friendly based on its text content.
        
        Args:
            text (str): Event text content
            
        Returns:
            bool: True if the event is family-friendly, False otherwise
        """
        # Count family-friendly keywords
        family_count = 0
        for keyword in self.family_friendly_keywords:
            family_count += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text))
        
        # Count non-family-friendly keywords
        non_family_count = 0
        for keyword in self.non_family_friendly_keywords:
            non_family_count += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text))
        
        # If there are explicit non-family keywords, it's not family-friendly
        if non_family_count > 0:
            return False
        
        # If there are family keywords, it's family-friendly
        if family_count > 0:
            return True
        
        # Default to not family-friendly if uncertain
        return False
