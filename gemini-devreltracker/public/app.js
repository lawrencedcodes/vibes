document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadMetrics();
    updateActiveNavLink();

    // Navigation Logic
    window.addEventListener('hashchange', updateActiveNavLink);

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Modal Event Listeners
    document.getElementById('delete-confirm').addEventListener('click', confirmDelete);
    document.getElementById('delete-cancel').addEventListener('click', hideDeleteModal);
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('delete-modal');
        if (event.target == modal) {
            hideDeleteModal();
        }
    }
});

let itemToDeleteId = null;

// --- Metrics ---
async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        
        document.getElementById('upcoming-count').textContent = `${data.upcomingContent} Items`;
        document.getElementById('recent-mentions-count').textContent = data.recentMentions;

        // Community Health Logic
        const healthScore = data.communityHealth || 0;
        const healthStatusEl = document.getElementById('health-status');
        const healthScoreEl = document.getElementById('health-score');
        
        let statusText = 'Neutral';
        let statusColor = 'text-gray-600';

        if (healthScore > 1) {
            statusText = 'Excellent';
            statusColor = 'text-green-600';
        } else if (healthScore > 0) {
            statusText = 'Good';
            statusColor = 'text-green-500';
        } else if (healthScore < -1) {
            statusText = 'Critical';
            statusColor = 'text-red-600';
        } else if (healthScore < 0) {
            statusText = 'Concerning';
            statusColor = 'text-orange-500';
        }

        // Reset classes
        healthStatusEl.className = `text-3xl font-bold ${statusColor}`;
        healthStatusEl.textContent = statusText;
        healthScoreEl.textContent = `Avg Sentiment: ${healthScore.toFixed(2)}`;

        // --- Update Automated Sentiment Section ---
        const sentimentScoreDisplay = document.getElementById('sentiment-score-display');
        const sentimentLabel = document.getElementById('sentiment-label');
        const sentimentList = document.getElementById('sentiment-list');

        if (sentimentScoreDisplay && sentimentLabel) {
             sentimentScoreDisplay.textContent = healthScore.toFixed(2);
             sentimentScoreDisplay.className = `text-5xl font-bold ${statusColor}`;
             sentimentLabel.textContent = statusText;
             sentimentLabel.className = `text-sm mt-2 font-medium ${statusColor}`;
        }

        if (sentimentList && data.recentMentionsList) {
            sentimentList.innerHTML = '';
            if (data.recentMentionsList.length === 0) {
                sentimentList.innerHTML = '<li class="text-gray-400 italic">No recent mentions found.</li>';
            } else {
                data.recentMentionsList.forEach(m => {
                    let colorClass = 'bg-gray-100 text-gray-600';
                    let icon = '⚪';
                    if (m.sentiment > 0) { colorClass = 'bg-green-100 text-green-700'; icon = '🟢'; }
                    if (m.sentiment < 0) { colorClass = 'bg-red-100 text-red-700'; icon = '🔴'; }
                    
                    const li = document.createElement('li');
                    li.className = `flex justify-between items-center p-2 rounded ${colorClass}`;
                    li.innerHTML = `
                        <span class="truncate mr-2" title="${m.content}">${icon} ${m.content}</span>
                        <span class="font-mono font-bold text-xs">${m.sentiment > 0 ? '+' : ''}${m.sentiment}</span>
                    `;
                    sentimentList.appendChild(li);
                });
            }
        }

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
        const pastList = document.getElementById('content-past');
        
        todayList.innerHTML = '';
        weekList.innerHTML = '';
        longTermList.innerHTML = '';
        pastList.innerHTML = '';

        // Setup Drag and Drop for columns
        [todayList, weekList, longTermList].forEach(el => {
            el.ondragover = allowDrop;
            el.ondrop = drop;
            el.classList.add('min-h-[100px]'); // Ensure drop target has height
        });

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
                pastList.appendChild(card);
                return;
            }

            // For incomplete items, determine where they go
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
        const emptyMsg = '<p class="text-xs text-gray-400 text-center pointer-events-none">No items.</p>';
        if (todayList.children.length === 0) todayList.innerHTML = emptyMsg;
        if (weekList.children.length === 0) weekList.innerHTML = emptyMsg;
        if (longTermList.children.length === 0) longTermList.innerHTML = emptyMsg;
        if (pastList.children.length === 0) pastList.innerHTML = emptyMsg;

    } catch (err) {
        console.error("Error loading content:", err);
    }
}

function createContentCard(item) {
    const div = document.createElement('div');
    div.className = 'content-card cursor-move select-none'; // Add cursor-move for UX
    div.setAttribute('draggable', 'true');
    div.setAttribute('data-id', item.id);
    div.ondragstart = drag;
    
    // Icon mapping
    let iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file.svg';
    if (item.type === 'video') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/video.svg';
    if (item.type === 'podcast') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mic.svg';
    if (item.type === 'meetup' || item.type === 'conference') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/presentation.svg';
    if (item.type === 'social') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/twitter.svg';
    if (item.type === 'blog') iconSrc = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file-text.svg';

    let actionButton = '';
    if (item.status !== 'complete') {
        actionButton = `<button onclick="markComplete(${item.id})" class="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Done</button>`;
    }

    // Delete button logic: Only visible in 'Past' section as per prompt ("Every time 'Done' is clicked... It also gets a 'delete' button")
    // But existing code had delete button everywhere. Prompt says "It also gets a 'delete' button" implying it might not have had one before or specifically for this section.
    // However, user usually wants to delete planned items too. I'll keep the top-right delete button but ensure it triggers the modal.
    // Actually, prompt says: "Every time 'Done' is clicked for an item, it leaves its current time area and appears permanently in the new 'Past' section... It also gets a 'delete' button which when clicked facilitates the popup"
    // This implies the delete button is distinctive features of the Past section.
    // But I will keep the delete button for all items for consistency, but use the new modal.

    div.innerHTML = `
        <div class="flex justify-between items-start">
            <p class="content-card-title">${item.title}</p>
            <button onclick="showDeleteModal(${item.id})" class="text-gray-400 hover:text-red-500" title="Delete">
                <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/trash-2.svg" class="h-3 w-3" />
            </button>
        </div>
        <div class="content-card-details mt-1">
            <img src="${iconSrc}" alt="${item.type}" class="content-card-icon" />
            <span class="capitalize">${item.type}</span>
            <span class="ml-auto text-[10px] text-gray-400">${item.due_date || 'No Date'}</span>
        </div>
        <div class="mt-2 text-right">
             ${actionButton}
        </div>
    `;
    return div;
}

// --- Drag and Drop Logic ---

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.currentTarget.getAttribute('data-id'));
}

async function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    const dropTarget = ev.currentTarget; // The container (today, week, or longterm)
    
    // Determine new date based on drop target
    const now = new Date();
    let newDate = null;

    if (dropTarget.id === 'content-today') {
        newDate = now.toISOString().split('T')[0];
    } else if (dropTarget.id === 'content-this-week') {
        // Set to tomorrow? Or just keep it vaguely "this week"? 
        // The prompt says "drag to 'This Week'". 
        // Let's set it to tomorrow for simplicity if it wasn't already in the week.
        // Or if we want to be smarter, we just ensure it falls within the week. 
        // Let's stick to "Tomorrow" as a safe bet for "This Week" bucket logic if moving from Today.
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        newDate = tomorrow.toISOString().split('T')[0];
    } else if (dropTarget.id === 'content-long-term') {
        // Set to null or a far future date?
        // My logic uses !due_date for Long Term.
        newDate = null; // Backend should handle this (set to NULL)
    }

    if (id && dropTarget.id) {
        // Optimistic update? No, let's reload.
        try {
            await fetch(`/api/content/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ due_date: newDate })
            });
            loadContent(); // Reload to reflect changes
            loadMetrics();
        } catch (err) {
            console.error("Error moving item:", err);
        }
    }
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

// --- Delete Modal Logic ---
function showDeleteModal(id) {
    itemToDeleteId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function hideDeleteModal() {
    itemToDeleteId = null;
    document.getElementById('delete-modal').classList.add('hidden');
}

async function confirmDelete() {
    if (itemToDeleteId) {
        try {
            await fetch(`/api/content/${itemToDeleteId}`, { method: 'DELETE' });
            loadContent();
            loadMetrics();
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    }
    hideDeleteModal();
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