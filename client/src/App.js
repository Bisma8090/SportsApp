import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLeague, setNavTab } from "./features/uiSlice";
import { useGetMatchesQuery, useGetLeaguesQuery } from "./store/sportsApi";
import { useSocket } from "./hooks/useSocket";
import MatchCard from "./components/MatchCard";
import HeroBanner from "./components/HeroBanner";
import MatchDetail from "./components/MatchDetail";
import LiveFeed from "./components/LiveFeed";
import "./styles/globals.css";

const navItems = [
  { id: "explore", icon: "🏠", label: "Home" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "lineup", icon: "👥", label: "Lineups" },
  { id: "favorites", icon: "⭐", label: "Favorites" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

function Sidebar() {
  const dispatch = useDispatch();
  const navTab = useSelector((s) => s.ui.navTab);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">⚽</div>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`sidebar-btn ${navTab === item.id ? "active" : ""}`}
          title={item.label}
          onClick={() => dispatch(setNavTab(item.id))}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

function MainContent() {
  const dispatch = useDispatch();
  const activeLeague = useSelector((s) => s.ui.activeLeague);
  const connected = useSelector((s) => s.socket.connected);
  const liveMatches = useSelector((s) => s.socket.liveMatches);

  const { data: leagues = [], isLoading: leaguesLoading } = useGetLeaguesQuery();
  const { data: apiMatches = [], isLoading: matchesLoading } = useGetMatchesQuery({ league: activeLeague });

  // Merge socket + API data (socket is source of truth for live)
  const matches = apiMatches.map((am) => {
    const live = liveMatches.find((lm) => lm.id === am.id);
    return live || am;
  });

  const liveList = matches.filter((m) => m.status === "LIVE");
  const finishedList = matches.filter((m) => m.status === "FT");
  const upcomingList = matches.filter((m) => m.status === "NS");

  const featuredMatch = liveList[0] || finishedList[0];

  return (
    <div className="main-content">
      {/* Top Nav */}
      <div className="top-nav">
        <div className="nav-logo">SCOREX</div>
        <div className="nav-tabs">
          {["Explore", "Stats", "Lineup"].map((t) => (
            <button
              key={t}
              className={`nav-tab ${t === "Explore" ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={`connection-dot ${connected ? "" : "offline"}`} title={connected ? "Connected" : "Offline"} />
      </div>

      {/* Hero */}
      {featuredMatch && <HeroBanner featuredMatch={featuredMatch} />}

      {/* Live Events Ticker */}
      <LiveFeed />

      {/* League Filter */}
      <div className="league-filter">
        <button
          className={`league-chip ${activeLeague === "all" ? "active" : ""}`}
          onClick={() => dispatch(setActiveLeague("all"))}
        >
          All Matches
        </button>
        {leaguesLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ width: 90, height: 30, borderRadius: 20 }} />
            ))
          : leagues.map((lg) => (
              <button
                key={lg.id}
                className={`league-chip ${activeLeague === lg.id ? "active" : ""}`}
                onClick={() => dispatch(setActiveLeague(lg.id))}
              >
                {lg.logo} {lg.name}
              </button>
            ))}
      </div>

      {/* Matches */}
      <div className="matches-section">
        {matchesLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </>
        ) : (
          <>
            {liveList.length > 0 && (
              <>
                <div className="section-label">🔴 Live Now ({liveList.length})</div>
                {liveList.map((m) => <MatchCard key={m.id} match={m} />)}
              </>
            )}
            {upcomingList.length > 0 && (
              <>
                <div className="section-label">⏰ Upcoming</div>
                {upcomingList.map((m) => <MatchCard key={m.id} match={m} />)}
              </>
            )}
            {finishedList.length > 0 && (
              <>
                <div className="section-label">✅ Full Time</div>
                {finishedList.map((m) => <MatchCard key={m.id} match={m} />)}
              </>
            )}
            {matches.length === 0 && (
              <div className="empty-state">
                <div className="icon">📋</div>
                <p>No matches found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  useSocket(); // Initialize socket connection globally

  return (
    <div className="app-shell">
      <Sidebar />
      <MainContent />
      <MatchDetail />
    </div>
  );
}
