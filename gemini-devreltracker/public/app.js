document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadMetrics();
    updateActiveNavLink();

    // Navigation Logic
    window.addEventListener('hashchange', updateActiveNavLink);
});

// --- Metrics ---
async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        
        document.getElementById('upcoming-count').textContent = `${data.upcomingContent} Items`;
        document.getElementById('recent-mentions-count').textContent = data.recentMentions;
    } catch (err) {
        console.error("Error loading metrics:", err);
    }
}

// --- Content Planner ---
async function loadContent() {
    try {
        const response = await fetch('/api/content');
        const items = await response.json();

        // Clear existing lists
        const todayList = document.getElementById('content-today');
        const weekList = document.getElementById('content-this-week');
        const longTermList = document.getElementById('content-long-term');
        
        todayList.innerHTML = '';
        weekList.innerHTML = '';
        longTermList.innerHTML = '';

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        // Calculate end of current week (Saturday)
        const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
        const daysUntilEndOfWeek = 6 - dayOfWeek;
        const endOfWeekDate = new Date(now);
        endOfWeekDate.setDate(now.getDate() + daysUntilEndOfWeek);
        const endOfWeek = endOfWeekDate.toISOString().split('T')[0];

        items.forEach(item => {
            const card = createContentCard(item);
            
            if (item.status === 'complete') {
                // Optional: Show completed items differently or in a separate list?
                // For now, we'll just put them where they belong date-wise but maybe style them
                // Or maybe we don't show completed items in the "Overview"?
                // The prompt says "what the developer advocate should focus on", implying incomplete tasks.
                // Let's filter out completed items from the main view, or put them at bottom.
                // For this implementation, I will skip completed items in the "Planned" view.
                return; 
            }

            if (!item.due_date) {
                longTermList.appendChild(card);
            } else if (item.due_date === today) {
                todayList.appendChild(card);
            } else if (item.due_date > today && item.due_date <= endOfWeek) {
                weekList.appendChild(card);
            } else {
                longTermList.appendChild(card);
            }
        });
        
        // Add "Empty" messages if lists are empty
        if (todayList.children.length === 0) todayList.innerHTML = '<p class="text-xs text-gray-400 text-center">No items due today.</p>';
        if (weekList.children.length === 0) weekList.innerHTML = '<p class="text-xs text-gray-400 text-center">No items due this week.</p>';
        if (longTermList.children.length === 0) longTermList.innerHTML = '<p class="text-xs text-gray-400 text-center">No long term items.</p>';

    } catch (err) {
        console.error("Error loading content:", err);
    }
}

function createContentCard(item) {
    const div = document.createElement('div');
    div.className = 'content-card';
    
    // Icon mapping
    let iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file.svg';
    if (item.type === 'video') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/video.svg';
    if (item.type === 'podcast') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mic.svg';
    if (item.type === 'meetup' || item.type === 'conference') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/presentation.svg';
    if (item.type === 'social') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/twitter.svg';
    if (item.type === 'blog') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file-text.svg';

    div.innerHTML = `
        <div class="flex justify-between items-start">
            <p class="content-card-title">${item.title}</p>
            <button onclick="deleteContentItem(${item.id})" class="text-gray-400 hover:text-red-500" title="Delete">
                <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/trash-2.svg" class="h-3 w-3" />
            </button>
        </div>
        <div class="content-card-details mt-1">
            <img src="${iconSrc}" alt="${item.type}" class="content-card-icon" />
            <span class="capitalize">${item.type}</span>
            <span class="ml-auto text-[10px] text-gray-400">${item.due_date || 'No Date'}</span>
        </div>
        <div class="mt-2 text-right">
             <button onclick="markComplete(${item.id})" class="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Done</button>
        </div>
    `;
    return div;
}

async function addContentItem() {
    const title = document.getElementById('content-title').value;
    const type = document.getElementById('content-type').value;
    const dueDate = document.getElementById('due-date').value;
    const deliveryDate = document.getElementById('delivery-date').value;
    const status = document.getElementById('content-status').value;
    const description = document.getElementById('content-description').value;

    if (!title) {
        alert("Please enter a title.");
        return;
    }

    const newItem = { title, type, dueDate, deliveryDate, status, description };

    try {
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            document.getElementById('content-form').reset();
            loadContent();
            loadMetrics();
        } else {
            alert("Failed to add item.");
        }
    } catch (err) {
        console.error("Error adding item:", err);
    }
}

async function deleteContentItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
        await fetch(`/api/content/${id}`, { method: 'DELETE' });
        loadContent();
        loadMetrics();
    } catch (err) {
        console.error("Error deleting item:", err);
    }
}

async function markComplete(id) {
    try {
        await fetch(`/api/content/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'complete' })
        });
        loadContent();
        loadMetrics();
    } catch (err) {
        console.error("Error updating item:", err);
    }
}

// --- Search ---
async function searchPulse() {
    const keyword = document.getElementById('pulse-keyword').value;
    const resultsDiv = document.getElementById('pulse-results');
    
    if (!keyword) {
        resultsDiv.textContent = "Please enter a keyword.";
        return;
    }

    resultsDiv.innerHTML = '<p class="text-gray-500">Searching...</p>';

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
        const results = await response.json();

        resultsDiv.innerHTML = '';
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'list-none space-y-3 mt-2';
        
        results.forEach(r => {
            const li = document.createElement('li');
            li.className = 'bg-gray-50 p-3 rounded border border-gray-200';
            li.innerHTML = `
                <a href="${r.url}" target="_blank" class="font-medium text-blue-600 hover:underline block">${r.title}</a>
                <p class="text-xs text-gray-500 mt-1">${r.source} • ${r.date}</p>
                <p class="text-sm text-gray-700 mt-1 line-clamp-2">${r.snippet || ''}</p>
            `;
            ul.appendChild(li);
        });
        
        resultsDiv.appendChild(ul);
        loadMetrics(); // Update mentions count as new mentions might be logged
    } catch (err) {
        resultsDiv.textContent = "Error performing search.";
        console.error(err);
    }
}

// --- Navigation ---
function updateActiveNavLink() {
    document.querySelectorAll("aside nav a").forEach((l) => l.classList.remove("bg-gray-700", "text-white"));
    const currentHash = window.location.hash || "#dashboard";
    const activeLink = document.querySelector(`aside nav a[href="${currentHash}"]`);
    if (activeLink) activeLink.classList.add("bg-gray-700", "text-white");
}
