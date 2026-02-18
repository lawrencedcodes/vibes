# DevRel Tracker Dashboard

A comprehensive dashboard designed for Developer Advocates and Developer Relations Engineers to manage content, track community engagement, and monitor key metrics.

## 🚀 Features

### ✅ Currently Functional
*   **Dashboard Overview**: Real-time metrics for "Upcoming Content" (due this week) and "Recent Mentions" (last 24h).
*   **Master Content Planner**: 
    *   Create, Read, Update, and Delete (CRUD) content items.
    *   Categorize by type (Blog, Video, Podcast, Meetup, etc.).
    *   Track status (Incomplete/Complete) and delivery dates.
*   **Planned Content Overview**: Automatically organizes tasks into "Today", "This Week", and "Long Term" views based on due dates.
*   **Community Pulse**: 
    *   Real-time keyword search (currently integrated with Reddit).
    *   Logs mentions to the database for tracking purposes.

### 🚧 Roadmap (Backlog)
*   **Community Health**: automated health scoring.
*   **Sentiment Analysis**: AI-driven sentiment trends.
*   **Reporting**: Customizable exportable reports.

## 🛠️ Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: SQLite (via `better-sqlite3`) - Zero configuration required.
*   **Frontend**: HTML5, TailwindCSS (CDN), Vanilla JavaScript.

## 📦 Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd gemini-devreltracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## 🏃‍♂️ Usage

1.  **Start the server**:
    ```bash
    node server.js
    ```

2.  **Open the dashboard**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

*   `server.js`: Main Express application and API endpoints.
*   `database.js`: SQLite connection and table initialization.
*   `public/`: Static frontend assets.
    *   `index.html`: Main dashboard UI.
    *   `app.js`: Frontend logic for data fetching and UI updates.
*   `devrel.db`: SQLite database file (created automatically upon first run).

## 📝 License

ISC
