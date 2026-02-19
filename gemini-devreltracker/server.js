console.log('Starting server...');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database.js');
const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// --- Content CRUD ---

// Get all content items (excluding deleted)
app.get('/api/content', (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM content_items WHERE status != 'deleted' ORDER BY due_date ASC").all();
        res.json(rows);
    } catch (err) {
        console.error("Error fetching content:", err);
        res.status(500).json({ error: err.message });
    }
});

// Add new content item
app.post('/api/content', (req, res) => {
    try {
        const { type, title, description, dueDate, deliveryDate, status } = req.body;
        const stmt = db.prepare(`
            INSERT INTO content_items (type, title, description, due_date, delivery_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(type, title, description, dueDate, deliveryDate, status);
        res.json({ id: info.lastInsertRowid, ...req.body });
    } catch (err) {
        console.error("Error adding content:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update content status or due_date
app.put('/api/content/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status, due_date } = req.body;
        
        let stmt;
        if (status && due_date !== undefined) {
            stmt = db.prepare('UPDATE content_items SET status = ?, due_date = ? WHERE id = ?');
            stmt.run(status, due_date, id);
        } else if (status) {
            stmt = db.prepare('UPDATE content_items SET status = ? WHERE id = ?');
            stmt.run(status, id);
        } else if (due_date !== undefined) {
            stmt = db.prepare('UPDATE content_items SET due_date = ? WHERE id = ?');
            stmt.run(due_date, id);
        }
        
        res.json({ message: 'Content updated successfully' });
    } catch (err) {
        console.error("Error updating content:", err);
        res.status(500).json({ error: err.message });
    }
});

// Soft delete content item
app.delete('/api/content/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare("UPDATE content_items SET status = 'deleted' WHERE id = ?");
        stmt.run(id);
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        console.error("Error deleting content:", err);
        res.status(500).json({ error: err.message });
    }
});


// --- Community Pulse (Search) ---

// Real-time search (Reddit only for demo purposes as it has public JSON)
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }

    try {
        // Search Reddit (using .json trick)
        const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=new`;
        
        // Use standard Fetch API (Node 18+)
        const response = await fetch(redditUrl, {
             headers: { 'User-Agent': 'devrel-tracker-bot/1.0' }
        });

        if (!response.ok) {
            throw new Error(`Reddit API returned ${response.status}`);
        }

        const data = await response.json();
        const results = data.data.children.map(child => {
            const title = child.data.title;
            const selftext = child.data.selftext || '';
            const score = sentimentAnalyzer.analyze(title + ' ' + selftext).score;
            
            return {
                source: 'Reddit',
                title: title,
                url: `https://www.reddit.com${child.data.permalink}`,
                snippet: selftext ? selftext.substring(0, 100) + '...' : '',
                date: new Date(child.data.created_utc * 1000).toLocaleDateString(),
                sentiment: score
            };
        });

        // Log mentions to DB with sentiment
        const stmt = db.prepare('INSERT INTO mentions (source, content, url, sentiment) VALUES (?, ?, ?, ?)');
        results.forEach(r => {
            try {
                stmt.run(r.source, r.title, r.url, r.sentiment);
            } catch (e) {
                // Ignore duplicates or insert errors
                console.log("Mention insert error (likely duplicate):", e.message);
            }
        });

        res.json(results);

    } catch (err) {
        console.error("Search error:", err);
        // Fallback to mock data if Reddit fails (e.g. rate limits)
        res.json([
            { source: 'Mock Source', title: `Discussion about ${query}`, url: '#', snippet: 'This is a mock result as the search API failed.', date: new Date().toLocaleDateString(), sentiment: 0 }
        ]);
    }
});

// Get metrics
app.get('/api/metrics', (req, res) => {
    try {
        // Upcoming content (due in current calendar week)
        const upcomingCount = db.prepare(`
            SELECT COUNT(*) as count FROM content_items 
            WHERE status != 'complete' 
            AND due_date >= date('now') 
            AND due_date <= date('now', 'weekday 6')
        `).get().count;

        // Recent mentions (last 24 hours)
        const mentionsCount = db.prepare(`
            SELECT COUNT(*) as count FROM mentions 
            WHERE found_at >= datetime('now', '-1 day')
        `).get().count;
        
        // Community Health: Avg sentiment last 7 days
        // If no mentions, default to 0
        const sentimentResult = db.prepare(`
            SELECT AVG(sentiment) as avg_sentiment 
            FROM mentions 
            WHERE found_at >= datetime('now', '-7 days')
        `).get();
        
        const communityHealth = sentimentResult.avg_sentiment !== null ? sentimentResult.avg_sentiment : 0;
        
        // Recent Mentions List (for Sentiment Section)
        const recentMentionsList = db.prepare(`
            SELECT source, content, sentiment, found_at 
            FROM mentions 
            ORDER BY found_at DESC 
            LIMIT 5
        `).all();

        res.json({
            upcomingContent: upcomingCount,
            recentMentions: mentionsCount,
            communityHealth: communityHealth,
            recentMentionsList: recentMentionsList
        });

    } catch (err) {
        console.error("Error fetching metrics:", err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
