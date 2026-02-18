const Database = require('better-sqlite3');
const db = new Database('devrel.db');

// Create tables
const createContentTable = `
    CREATE TABLE IF NOT EXISTS content_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        delivery_date TEXT,
        status TEXT DEFAULT 'incomplete',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

const createMentionsTable = `
    CREATE TABLE IF NOT EXISTS mentions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        content TEXT,
        url TEXT,
        found_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

db.exec(createContentTable);
db.exec(createMentionsTable);

module.exports = db;
