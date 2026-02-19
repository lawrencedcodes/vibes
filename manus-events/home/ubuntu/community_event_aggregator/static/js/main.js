"""
Updated JavaScript file with enhanced search functionality.
"""
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const eventsContainer = document.getElementById('events-container');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const noResults = document.querySelector('.no-results');
    const eventCategoriesSection = document.querySelector('.event-categories');
    const categoryFilters = document.getElementById('category-filters');
    const categorySelect = document.getElementById('category');
    const themeToggle = document.getElementById('theme-toggle');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    
    // Store fetched events
    let currentEvents = [];
    
    // Set default dates
    setDefaultDates();
    
    // Load categories
    loadCategories();
    
    // Event Listeners
    searchForm.addEventListener('submit', handleSearch);
    themeToggle.addEventListener('click', toggleTheme);
    gridViewBtn.addEventListener('click', () => setViewMode('grid'));
    listViewBtn.addEventListener('click', () => setViewMode('list'));
    
    // Check for saved theme preference
    checkThemePreference();
    
    // Check for saved view mode preference
    checkViewModePreference();
    
    /**
     * Set default dates for the date range inputs
     */
    function setDefaultDates() {
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        
        startDateInput.valueAsDate = today;
        endDateInput.valueAsDate = thirtyDaysLater;
    }
    
    /**
     * Load event categories from the API
     */
    function loadCategories() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => {
                // Populate category dropdown
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    }
    
    /**
     * Handle search form submission
     * @param {Event} e - Form submit event
     */
    function handleSearch(e) {
        e.preventDefault();
        
        // Show loading indicator
        loadingIndicator.classList.remove('d-none');
        noResults.classList.add('d-none');
        eventsContainer.innerHTML = '';
        eventCategoriesSection.classList.add('d-none');
        
        // Get form data
        const formData = new FormData(searchForm);
        const city = formData.get('city');
        const state = formData.get('state');
        const country = formData.get('country');
        const familyFriendly = formData.get('family-friendly') === 'on';
        const startDate = formData.get('start-date');
        const endDate = formData.get('end-date');
        const category = formData.get('category');
        
        // Build query string
        const params = new URLSearchParams({
            city: city,
            state: state,
            country: country,
            family_friendly: familyFriendly,
            fetch_new: true  // Always fetch new events on search
        });
        
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (category) params.append('category', category);
        
        // Fetch events
        fetch(`/api/events?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide loading indicator
                loadingIndicator.classList.add('d-none');
                
                if (data.events && data.events.length > 0) {
                    // Store fetched events
                    currentEvents = data.events;
                    
                    // Display events
                    displayEvents(data.events);
                    displayCategoryFilters(data.events);
                } else {
                    noResults.classList.remove('d-none');
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                loadingIndicator.classList.add('d-none');
                noResults.classList.remove('d-none');
            });
    }
    
    /**
     * Display events in the container
     * @param {Array} events - Array of event objects
     */
    function displayEvents(events) {
        // Clear container
        eventsContainer.innerHTML = '';
        
        // Get current view mode
        const viewMode = localStorage.getItem('viewMode') || 'grid';
        
        if (viewMode === 'grid') {
            displayGridView(events);
        } else {
            displayListView(events);
        }
    }
    
    /**
     * Display events in grid view
     * @param {Array} events - Array of event objects
     */
    function displayGridView(events) {
        events.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'col-md-6 col-lg-4 fade-in';
            eventCard.dataset.eventIndex = index;
            
            // Default image if none provided
            const imageUrl = event.image_url || 'https://via.placeholder.com/300x180?text=No+Image+Available';
            
            // Format date
            const eventDate = formatDate(event.date);
            
            // Format time
            const eventTime = event.start_time ? formatTime(event.start_time) : 'Time not specified';
            
            // Get location name
            const locationName = getLocationName(event.location);
            
            // Create category badges
            const categoryBadges = createCategoryBadges(event.categories);
            
            // Check if family-friendly
            const familyFriendlyBadge = event.family_friendly ? 
                '<span class="family-friendly-badge"><i class="fas fa-child me-1"></i>Family-friendly</span>' : '';
            
            eventCard.innerHTML = `
                <div class="event-card">
                    <img src="${imageUrl}" class="card-img-top" alt="${event.name}">
                    <div class="card-body">
                        <h5 class="card-title">${event.name} ${familyFriendlyBadge}</h5>
                        <div class="event-meta mb-2">
                            <p class="mb-1"><i class="fas fa-calendar"></i> ${eventDate}</p>
                            <p class="mb-1"><i class="fas fa-clock"></i> ${eventTime}</p>
                            <p class="mb-1"><i class="fas fa-map-marker-alt"></i> ${locationName}</p>
                        </div>
                        <div class="event-categories">
                            ${categoryBadges}
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary view-details">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listener for view details button
            eventCard.querySelector('.view-details').addEventListener('click', () => {
                showEventDetails(event);
            });
            
            eventsContainer.appendChild(eventCard);
        });
    }
    
    /**
     * Display events in list view
     * @param {Array} events - Array of event objects
     */
    function displayListView(events) {
        events.forEach((event, index) => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-list-item fade-in';
            eventItem.dataset.eventIndex = index;
            
            // Default image if none provided
            const imageUrl = event.image_url || 'https://via.placeholder.com/120x80?text=No+Image';
            
            // Format date
            const eventDate = formatDate(event.date);
            
            // Format time
            const eventTime = event.start_time ? formatTime(event.start_time) : 'Time not specified';
            
            // Get location name
            const locationName = getLocationName(event.location);
            
            // Create category badges
            const categoryBadges = createCategoryBadges(event.categories);
            
            // Check if family-friendly
            const familyFriendlyBadge = event.family_friendly ? 
                '<span class="family-friendly-badge"><i class="fas fa-child me-1"></i>Family-friendly</span>' : '';
            
            eventItem.innerHTML = `
                <div class="row">
                    <div class="col-md-2">
                        <img src="${imageUrl}" class="event-image" alt="${event.name}">
                    </div>
                    <div class="col-md-7">
                        <h5 class="event-title">${event.name} ${familyFriendlyBadge}</h5>
                        <div class="event-meta">
                            <p class="mb-1"><i class="fas fa-calendar"></i> ${eventDate} • <i class="fas fa-clock"></i> ${eventTime}</p>
                            <p class="mb-1"><i class="fas fa-map-marker-alt"></i> ${locationName}</p>
                        </div>
                        <div class="event-categories mt-2">
                            ${categoryBadges}
                        </div>
                    </div>
                    <div class="col-md-3 d-flex align-items-center justify-content-end">
                        <button class="btn btn-sm btn-outline-primary view-details">
                            View Details
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listener for view details button
            eventItem.querySelector('.view-details').addEventListener('click', () => {
                showEventDetails(event);
            });
            
            eventsContainer.appendChild(eventItem);
        });
    }
    
    /**
     * Display category filters based on events
     * @param {Array} events - Array of event objects
     */
    function displayCategoryFilters(events) {
        // Get unique categories from events
        const categories = new Set();
        events.forEach(event => {
            if (event.categories && event.categories.length > 0) {
                event.categories.forEach(category => categories.add(category));
            }
        });
        
        // If we have categories, show the section
        if (categories.size > 0) {
            eventCategoriesSection.classList.remove('d-none');
            categoryFilters.innerHTML = '';
            
            // Add "All" filter
            const allPill = document.createElement('div');
            allPill.className = 'category-pill active';
            allPill.dataset.category = 'all';
            allPill.textContent = 'All';
            allPill.addEventListener('click', () => filterEventsByCategory('all'));
            categoryFilters.appendChild(allPill);
            
            // Add category filters
            categories.forEach(category => {
                const pill = document.createElement('div');
                pill.className = 'category-pill';
                pill.dataset.category = category;
                pill.textContent = capitalizeFirstLetter(category);
                pill.addEventListener('click', () => filterEventsByCategory(category));
                categoryFilters.appendChild(pill);
            });
        }
    }
    
    /**
     * Filter events by category
     * @param {string} category - Category to filter by
     */
    function filterEventsByCategory(category) {
        // Update active pill
        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.classList.remove('active');
            if (pill.dataset.category === category) {
                pill.classList.add('active');
            }
        });
        
        // Filter events
        let filteredEvents;
        
        if (category === 'all') {
            filteredEvents = currentEvents;
        } else {
            filteredEvents = currentEvents.filter(event => 
                event.categories && event.categories.includes(category)
            );
        }
        
        // Display filtered events
        displayEvents(filteredEvents);
    }
    
    /**
     * Show event details in modal
     * @param {Object} event - Event object
     */
    function showEventDetails(event) {
        // Get modal elements
        const modal = new bootstrap.Modal(document.getElementById('event-detail-modal'));
        const modalTitle = document.getElementById('modal-event-title');
        const modalImage = document.getElementById('modal-event-image');
        const modalDate = document.getElementById('modal-event-date');
        const modalTime = document.getElementById('modal-event-time');
        const modalLocation = document.getElementById('modal-event-location');
        const modalDescription = document.getElementById('modal-event-description');
        const modalCategories = document.getElementById('modal-event-categories');
        const modalSource = document.getElementById('modal-event-source');
        const modalLink = document.getElementById('modal-event-link');
        
        // Set modal content
        modalTitle.textContent = event.name;
        
        // Set image
        if (event.image_url) {
            modalImage.src = event.image_url;
            modalImage.style.display = '';
        } else {
            modalImage.style.display = 'none';
        }
        
        // Set date and time
        modalDate.textContent = formatDate(event.date);
        modalTime.textContent = event.start_time ? formatTime(event.start_time) : 'Time not specified';
        
        // Set location
        modalLocation.textContent = getLocationName(event.location);
        
        // Set description
        modalDescription.textContent = event.description || 'No description available.';
        
        // Set categories
        modalCategories.innerHTML = createCategoryBadges(event.categories);
        
        // Set source
        modalSource.textContent = event.source || 'Unknown';
        
        // Set link
        if (event.url) {
            modalLink.href = event.url;
            modalLink.style.display = '';
        } else {
            modalLink.style.display = 'none';
        }
        
        // Show modal
        modal.show();
    }
    
    /**
     * Create category badges HTML
     * @param {Array} categories - Array of category strings
     * @returns {string} HTML string of category badges
     */
    function createCategoryBadges(categories) {
        if (!categories || categories.length === 0) {
            return '<span class="category-badge category-other" data-category="other">Other</span>';
        }
        
        return categories.map(category => {
            return `<span class="category-badge category-${category}" data-category="${category}">${capitalizeFirstLetter(category)}</span>`;
        }).join('');
    }
    
    /**
     * Format da<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>