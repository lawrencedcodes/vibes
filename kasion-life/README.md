# 🌌 KasionLife — Personal Operating System & Dashboard

KasionLife is a high-density, minimalist, and ultra-performant personal dashboard designed as a centralized "Life OS." Built using **Next.js 16 (App Router)**, **React 19**, and **Prisma with SQLite**, it provides a distraction-free environment to manage goals, time-blocking, habits, reflections, and wellness metrics in a single, visually striking glassmorphic interface.

---

## ⚡ Key Capabilities & Modules

### 1. 🍱 Bento-Box Master Dashboard (`/`)
A high-density daily overview designed using a responsive CSS Bento Grid layout. It fetches and resolves five distinct data streams in parallel using `Promise.all` on the server:
- **Weekly Habit Execution**: Displays the 12 Week Year habit score using a visual circular SVG progress ring.
- **Today's Focus Time**: Aggregates Pomodoro focus session durations.
- **Health Vitals**: Shows hydration, sleep hours, and current energy level.
- **Calendar Agenda**: Generates a timeline snippet of events scheduled for the current day.
- **Milestones**: Displays the top 3 closest countdown targets.

### 2. 📊 Habits Tracker & GitHub-Style Heatmaps (`/tracker`)
A robust tracking module equipped with:
- **Checkboxes & Steppers**: Interactive Client Components with optimistic state updates for standard boolean checks or numeric daily target variables (e.g. `5 / 10` glasses).
- **Streak Calculation**: Calculates current streaks (🔥) and longest streaks in real-time, resetting if logs are missed.
- **Yearly Heatmaps**: A GitHub-style contribution matrix rendering the last 365 days of entries. It resolves logs in $O(N)$ time via indexed mapping and uses shades of the theme's color intensity to indicate completion percentage.

### 3. 📅 Weekly Planner & Time-Blocker (`/planner`)
A visual calendar featuring:
- **Time-Blocking Layout**: Renders a vertical 24-hour Y-axis grid alongside 7 daily columns. Places cards using absolute pixel positioning derived from event durations.
- **Overlapping Logic**: Employs an intersection grouping algorithm that clusters overlapping events and positions them side-by-side in vertical lanes (mimicking Google/Outlook Calendar layouts).
- **Google Calendar Sync**: Integrates with Google Calendar API (via OAuth 2.0 and `googleapis`) to sync cloud schedules seamlessly.
- **Morning Focus**: Automatically scrolls viewport focus to 7:00 AM on page load.

### 4. ✍️ Daily Reflections Journal (`/journal`)
A sleek, writing-focused canvas:
- **Debounced Auto-Save**: Triggers a Server Action upsert to save entries 1.5 seconds after the user stops typing, complete with saving indicator states and manual sync fallbacks.
- **Hydration Gating**: Safeguards locale timestamps on the server to prevent SSR hydration mismatches.
- **Chronological Logs**: Lists past daily logs with automatic preview snippets.

### 5. ⏱️ Focus Pomodoro Timer (`/focus`)
An interactive 25-minute countdown widget:
- **Task Association**: Links Pomodoro sessions to specific Todo items.
- **Visual Countdown**: Clean SVG radial animation displaying elapsed time.
- **Persistence**: Persists completed focus intervals to the database upon zero-count events.

---

## 🛠️ Technical Stack & Architecture

- **Framework**: [Next.js 16.2.9](https://nextjs.org/) (App Router, Turbopack)
- **UI Runtime**: [React 19.2.4](https://react.dev/) (leveraging Server Components, Server Actions, `useActionState`, `useTransition`, `useOptimistic`)
- **Database & ORM**: [Prisma Client 7.8.0](https://www.prisma.io/) with [SQLite](https://sqlite.org/)
- **SQL Adapter**: [@prisma/adapter-better-sqlite3](https://www.npmjs.com/package/@prisma/adapter-better-sqlite3) & [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (high-speed zero-dependency SQLite connections)
- **Integrations**: [Google APIs](https://github.com/googleapis/google-api-nodejs-client) (Google OAuth2 + Google Calendar Sync)
- **Styling**: Sleek Vanilla CSS with global glassmorphic design variables (`globals.css`) supporting system fonts and dark/light dynamic theme switching.

---

## 🎨 Layout & Design Aesthetics

KasionLife is designed around key visual principles to maximize clarity and immersion:
- **Backdrop Blur & Glassmorphism**: Cards use translucent panels (`.glass-panel`) with blur filters, subtle border highlights, and variable transparency.
- **Color Coding**: Visual metrics scale according to status (e.g., countdown urgency changes color from green to orange/red based on days left).
- **Micro-Animations**: Clean CSS keyframe animations for fade-ins, scaling actions on hover, and pulsing transitions for active save/sync states.
- **Fully Responsive**: Bento configurations and time-blockers automatically scale layout columns from horizontal scrolling panels (mobile/tablet viewports) to high-density grids (widescreen displays).

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge$ 20.0
- A Google Cloud Platform (GCP) project with OAuth Credentials configured (optional, for Google Calendar sync)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/lawrencedcodes/vibes.git
   cd vibes/kasion-life
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   # Database url
   DATABASE_URL="file:./dev.db"

   # Session token decryption secret
   SESSION_SECRET="your-jose-crypto-secure-secret-key"

   # Google OAuth Credentials (Optional)
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
   ```

4. **Initialize Database Schema**:
   Run Prisma db push to sync schema.prisma definitions with SQLite:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

6. **Build for Production**:
   Ensure full compilation checks pass:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Directory Structure

```text
kasion-life/
├── prisma/
│   └── schema.prisma        # Prisma database schemas (User, Goals, Habits, Events, healthLogs, etc.)
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # Main dashboard layout routes (tracker, planner, focus, journal, health)
│   │   ├── actions/         # Next.js Server Actions (auth, habits, journal, health, countdowns)
│   │   └── api/             # API handlers (OAuth callback routes)
│   ├── components/          # React 19 Client components (WeeklyTimeBlocker, HabitHeatmap, TimerWidget, etc.)
│   ├── lib/                 # Core server libraries (db instance, session authentication, calendar utilities)
│   └── proxy.ts             # Middleware router authentication protection rules
└── package.json             # Core dependencies configuration
```

---

## 🔒 Security & Performance Features

- **Route Protection Middleware**: A custom path validation proxy (`src/proxy.ts`) authenticates sessions on all protected dashboard subfolders prior to rendering.
- **Atomic Operations & Indexes**: Uses unique compound indexes (`userId_date` or `habitId_date`) on tracking tables, allowing secure database-level atomic upsert queries.
- **SEO & Semantics**: Utilizes HTML5 semantic outlines, descriptive `<title>` descriptors, accessibility markers, and performance-tuned layout weights.
