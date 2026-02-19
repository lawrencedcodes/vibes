# Event Data Sources Research

This document outlines the research findings for public event data sources that can be used in our Community Event Aggregator application without requiring paid API keys.

## City and Government Websites

Many city and local government websites publish events in HTML format that can be scraped:

1. **City Event Calendars**: Most cities have official websites with event calendars
   - Data structure: Usually HTML tables or div containers with event details
   - Example URL pattern: `https://www.cityname.gov/events` or `https://www.cityname.gov/calendar`
   - Information typically available: Event name, date, time, location, description, category

2. **Public Libraries**: Library websites often list community events
   - Data structure: Usually structured HTML with event listings
   - Information typically available: Event name, date, time, location, description, age group

3. **Parks and Recreation Departments**: Often have calendars of outdoor and recreational events
   - Data structure: HTML tables or list items with event information
   - Information typically available: Event name, date, time, park/location, activity type

## Meetup.com

Meetup offers public event data that can be accessed without an API key:

1. **Public Event Pages**: 
   - URL pattern: `https://www.meetup.com/find/?location=cityname&source=EVENTS`
   - Data structure: HTML with structured event cards
   - Information available: Event name, group name, date, time, location, attendee count, description
   - Scraping approach: Parse the HTML structure to extract event details

2. **Location-based searches**:
   - Can be accessed by constructing URLs with location parameters
   - Example: `https://www.meetup.com/find/events/?location=cityname&distance=10miles`

## Eventbrite

Eventbrite public event listings can be accessed without API keys:

1. **Public Event Search Pages**:
   - URL pattern: `https://www.eventbrite.com/d/country--city/events/`
   - Data structure: HTML with event cards containing structured data
   - Information available: Event name, date, time, location, price, organizer, description
   - Scraping approach: Extract data from HTML elements with specific class names

2. **Location-based searches**:
   - Can construct URLs with location parameters
   - Example: `https://www.eventbrite.com/d/united-states--new-york/events/`

## Facebook Events

Public Facebook events can be accessed without API keys:

1. **Public Event Pages**:
   - URL pattern: `https://www.facebook.com/events/`
   - Data structure: HTML with event information
   - Information available: Event name, date, time, location, description, host
   - Scraping approach: More complex due to dynamic loading, may require browser automation

2. **Location-based searches**:
   - Example: `https://www.facebook.com/events/search/?q=cityname`
   - Note: Facebook's structure changes frequently and may have anti-scraping measures

## Community Forums and Bulletin Boards

1. **Reddit Local Subreddits**:
   - Many city/location subreddits have weekly or monthly event threads
   - Data structure: Text posts with event information
   - Example: `https://www.reddit.com/r/cityname/`
   - Scraping approach: Parse text posts for date patterns and event keywords

2. **Craigslist Events Section**:
   - URL pattern: `https://cityname.craigslist.org/search/eve`
   - Data structure: Simple HTML list items
   - Information available: Event title, date, location, description
   - Scraping approach: Extract data from list items

## University and College Websites

1. **Campus Event Calendars**:
   - Most universities have public event calendars
   - Data structure: HTML tables or list items
   - Information available: Event name, date, time, campus location, department, description
   - Example: `https://events.universityname.edu/`

## Data Structure Standardization

To normalize data from these diverse sources, we'll need to extract and standardize the following fields:

1. **Event Name**: String
2. **Date**: ISO format (YYYY-MM-DD)
3. **Start Time**: 24-hour format (HH:MM)
4. **End Time**: 24-hour format (HH:MM) if available
5. **Location**: 
   - Venue Name: String
   - Address: String
   - City: String
   - State: String
   - Country: String (if applicable)
6. **Description**: String
7. **Category**: String (to be determined by our categorization system)
8. **URL**: String (link to original event page)
9. **Source**: String (which platform/website the event was sourced from)
10. **Family-friendly**: Boolean (to be determined by our categorization system)
11. **Price**: String/Number (if available)
12. **Image URL**: String (if available)

## Scraping Considerations

1. **Rate Limiting**: Implement delays between requests to avoid being blocked
2. **User-Agent Rotation**: Use different user-agent strings to mimic different browsers
3. **IP Rotation**: Consider using proxy services if necessary
4. **Terms of Service**: Review each site's robots.txt and terms of service
5. **Data Freshness**: Implement regular re-scraping to keep data current
6. **Error Handling**: Robust error handling for when site structures change

## Next Steps

1. Develop a prototype scraper for one source to test the approach
2. Create a modular architecture that can accommodate different source-specific scrapers
3. Implement data normalization functions to standardize event data across sources
4. Design storage mechanism for scraped events
