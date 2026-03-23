#  ScoreX – Live Sports Score App

A real-time sports score tracker built with **React**, **Redux Toolkit (RTK Query)**, and **Socket.IO** — inspired by a dark, futuristic UI aesthetic.

---

##  Features

-  **Live match scores** updated in real-time via Socket.IO
-  **RTK Query** for all REST API calls (leagues, matches, standings)
-  **Live events ticker** — goals, yellow cards stream in as they happen
-  **League filter** — Premier League, UCL, La Liga, Bundesliga
-  **Match detail panel** — overview stats, match events timeline, lineups
-  **Connection indicator** — shows live/offline socket state

---

##  Architecture

```
sports-app/
├── client/                  # React frontend
│   └── src/
│       ├── store/
│       │   ├── index.js         # Redux store config
│       │   └── sportsApi.js     # RTK Query API service
│       ├── features/
│       │   ├── socketSlice.js   # Real-time socket state
│       │   └── uiSlice.js       # UI state (tabs, selected match)
│       ├── hooks/
│       │   └── useSocket.js     # Socket.IO hook (connect, listen, emit)
│       ├── components/
│       │   ├── MatchCard.js     # Match card with live score update
│       │   ├── MatchDetail.js   # Right panel with tabs
│       │   ├── HeroBanner.js    # Featured live match hero
│       │   └── LiveFeed.js      # Scrolling live events ticker
│       ├── styles/
│       │   └── globals.css      # Full dark-theme stylesheet
│       └── App.js               # Root layout (Sidebar + Main + Detail)
│
└── server/
    └── index.js                 # Express + Socket.IO server with mock data
```

---

##  Local Development


### Step 1 — Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### Step 2 — Start the server
```bash
cd server
npm run dev       
# Server runs at http://localhost:3001
```

### Step 3 — Start the client
```bash
cd client
npm start
# App runs at http://localhost:3000
```

---

## 🧠 What This Project Demonstrates

-  RTK Query replaces all manual fetch/axios calls
-  Socket.IO delivers real-time score + event updates
-  Redux manages both server-state (RTK Query) and real-time state (socketSlice)
-  Room-based subscriptions for efficient per-match streaming
-  Merging of REST + WebSocket data in components

---