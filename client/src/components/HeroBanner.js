import React from "react";
import { useSelector } from "react-redux";

export default function HeroBanner({ featuredMatch }) {
  const liveMatches = useSelector((s) => s.socket.liveMatches);

  const liveVersion = liveMatches.find((m) => m.id === featuredMatch?.id);
  const m = liveVersion || featuredMatch;

  if (!m) return null;

  return (
    <div className="hero-banner">
      <div className="hero-label">
        <span className="live-badge">LIVE</span>
        Match of the Day
      </div>

      <div className="hero-score-row">
        <div className="hero-team">
          <div className="hero-team-logo">
            <img
              src={m.homeTeam.logo}
              alt={m.homeTeam.name}
              style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <span>{m.homeTeam.name}</span>
        </div>

        <div className="hero-vs-score">
          {m.homeScore} – {m.awayScore}
        </div>

        <div className="hero-team">
          <div className="hero-team-logo">
            <img
              src={m.awayTeam.logo}
              alt={m.awayTeam.name}
              style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <span>{m.awayTeam.name}</span>
        </div>
      </div>

      <div className="hero-meta">
        <span>🏟 {m.venue}</span>
        {m.status === "LIVE" && <span className="hero-minute">{m.minute}'</span>}
        <span>📅 {m.date}</span>
      </div>
    </div>
  );
}