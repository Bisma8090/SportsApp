import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab, setSelectedMatchId } from "../features/uiSlice";
import { useGetStandingsQuery } from "../store/sportsApi";
import { useSocket } from "../hooks/useSocket";

const eventIcons = {
  goal: "⚽",
  yellow_card: "🟨",
  red_card: "🟥",
};

function OverviewTab({ match }) {
  const statsData = [
    { label: "Possession", home: 58, away: 42 },
    { label: "Shots", home: 7, away: 5 },
    { label: "On Target", home: 4, away: 2 },
    { label: "Corners", home: 5, away: 3 },
    { label: "Fouls", home: 9, away: 11 },
  ];

  return (
    <div>
      <p className="events-title" style={{ marginBottom: 16 }}>Match Stats</p>
      {statsData.map((stat) => {
        const total = stat.home + stat.away;
        const homePct = ((stat.home / total) * 100).toFixed(0);
        const awayPct = ((stat.away / total) * 100).toFixed(0);
        return (
          <div key={stat.label} className="stat-row">
            <span className="stat-val" style={{ textAlign: "right" }}>{stat.home}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginBottom: 4, fontFamily: "var(--font-display)", letterSpacing: 1 }}>
                {stat.label}
              </div>
              <div className="stat-bar-wrap">
                <div className="stat-bar-home" style={{ width: `${homePct}%` }} />
                <div className="stat-bar-away" style={{ width: `${awayPct}%` }} />
              </div>
            </div>
            <span className="stat-val">{stat.away}</span>
          </div>
        );
      })}
    </div>
  );
}

function EventsTab({ match }) {
  const sorted = [...(match.events || [])].sort((a, b) => b.minute - a.minute);

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">⏱</div>
        <p>No events yet</p>
      </div>
    );
  }

  return (
    <div>
      <p className="events-title">Match Events</p>
      {sorted.map((ev, i) => (
        <div key={i} className="event-row">
          <span className="event-minute">{ev.minute}'</span>
          <div className={`event-icon ${ev.type}`}>
            {eventIcons[ev.type] || "📋"}
          </div>
          <div className="event-info">
            <div className="event-player">{ev.player}</div>
            <div className="event-team">{ev.team.replace("_", " ")}</div>
          </div>
          <span style={{ fontSize: 10, color: ev.type === "goal" ? "var(--green-live)" : "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
            {ev.type.replace("_", " ")}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineupsTab({ match }) {
  const homeLineup = [
    { number: 1, name: "Ederson", pos: "GK" },
    { number: 3, name: "Rúben Dias", pos: "CB" },
    { number: 6, name: "Akanji", pos: "CB" },
    { number: 5, name: "Stones", pos: "RB" },
    { number: 11, name: "Grealish", pos: "LB" },
    { number: 8, name: "Rodrigo", pos: "CDM" },
    { number: 17, name: "De Bruyne", pos: "CM" },
    { number: 47, name: "Foden", pos: "CAM" },
    { number: 10, name: "Bernardo", pos: "RW" },
    { number: 7, name: "Sterling", pos: "LW" },
    { number: 9, name: "Haaland", pos: "ST" },
  ];

  return (
    <div>
      <p className="events-title" style={{ marginBottom: 12 }}>{match.homeTeam.name}</p>
      {homeLineup.map((p) => (
        <div key={p.number} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ width: 22, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}>{p.number}</span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
          <span style={{ fontSize: 10, color: "var(--purple-light)", fontWeight: 600, letterSpacing: 1 }}>{p.pos}</span>
        </div>
      ))}
    </div>
  );
}

export default function MatchDetail() {
  const dispatch = useDispatch();
  const selectedId = useSelector((s) => s.ui.selectedMatchId);
  const activeTab = useSelector((s) => s.ui.activeTab);
  const liveMatches = useSelector((s) => s.socket.liveMatches);
  const liveDetail = useSelector((s) => s.socket.liveMatchDetail);
  const { subscribeToMatch, unsubscribeFromMatch } = useSocket();

  useEffect(() => {
    if (selectedId) {
      subscribeToMatch(selectedId);
      return () => unsubscribeFromMatch(selectedId);
    }
  }, [selectedId]);

  if (!selectedId) {
    return (
      <div className="detail-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <div className="icon">⚽</div>
          <p>Select a match to view details</p>
        </div>
      </div>
    );
  }

  const socketMatch = liveMatches.find((m) => m.id === selectedId);
  const match = (liveDetail?.id === selectedId ? liveDetail : null) || socketMatch;

  if (!match) {
    return (
      <div className="detail-panel">
        <div className="skeleton-card" style={{ margin: 16, height: 180 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ margin: "8px 16px", height: 50 }} />
        ))}
      </div>
    );
  }

  const tabs = ["Overview", "Stats", "Lineups"];

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <button className="detail-back-btn" onClick={() => dispatch(setSelectedMatchId(null))}>← Back</button>

        <div className="detail-score-block">
          {/* Home Team */}
          <div className="detail-team">
            <div className="detail-team-logo">
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} style={{ width: 52, height: 52, borderRadius: "50%" }} />
            </div>
            <div className="detail-team-name">{match.homeTeam.name}</div>
          </div>

          {/* Score */}
          <div style={{ textAlign: "center" }}>
            <div className="detail-score">{match.status === "NS" ? "vs" : `${match.homeScore}–${match.awayScore}`}</div>
            <span className={`status-badge status-${match.status}`} style={{ fontSize: 11 }}>
              {match.status === "LIVE" ? `🔴 ${match.minute}'` : match.status}
            </span>
          </div>

          {/* Away Team */}
          <div className="detail-team">
            <div className="detail-team-logo">
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} style={{ width: 52, height: 52, borderRadius: "50%" }} />
            </div>
            <div className="detail-team-name">{match.awayTeam.name}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`detail-tab ${activeTab === tab.toLowerCase() ? "active" : ""}`}
            onClick={() => dispatch(setActiveTab(tab.toLowerCase()))}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* Body */}
      <div className="detail-body">
        {activeTab === "overview" && <OverviewTab match={match} />}
{activeTab === "events" && <EventsTab match={match} />}
        {activeTab === "lineups" && <LineupsTab match={match} />}
      </div>
    </div>
  );
}
