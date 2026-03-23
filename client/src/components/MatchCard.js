import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMatchId } from "../features/uiSlice";

const leagueNames = {
  pl: "Premier League",
  ucl: "UCL",
  laliga: "La Liga",
  bundesliga: "Bundesliga",
};

const leagueEmoji = {
  pl: "🏴",
  ucl: "⭐",
  laliga: "🇪🇸",
  bundesliga: "🇩🇪",
};

export default function MatchCard({ match }) {
  const dispatch = useDispatch();
  const selectedId = useSelector((s) => s.ui.selectedMatchId);
  const liveMatches = useSelector((s) => s.socket.liveMatches);

  const liveVersion = liveMatches.find((m) => m.id === match.id);
  const m = liveVersion || match;

  const isSelected = selectedId === m.id;

  const handleClick = () => {
    dispatch(setSelectedMatchId(m.id));
  };

  return (
    <div
      className={`match-card ${m.status === "LIVE" ? "live" : ""} ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="match-card-header">
        <span className="match-league-tag">
          <span>{leagueEmoji[m.league]}</span>
          {leagueNames[m.league] || m.league}
        </span>
        <span className={`status-badge status-${m.status}`}>
          {m.status === "LIVE"
            ? `🔴 ${m.minute}'`
            : m.status === "NS"
            ? m.kickoff || "Soon"
            : "FT"}
        </span>
      </div>

      <div className="match-teams">
        <div className="match-team">
          <div className="team-logo-circle">
            <img
              src={m.homeTeam.logo}
              alt={m.homeTeam.name}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div className="team-name">{m.homeTeam.short}</div>
        </div>

        <div className="match-score-center">
          <div className={`score-display ${m.status === "LIVE" ? "live-score" : ""}`}>
            {m.status === "NS" ? "vs" : `${m.homeScore} - ${m.awayScore}`}
          </div>
          {m.status === "LIVE" && <div className="match-minute-small">● LIVE</div>}
        </div>

        <div className="match-team">
          <div className="team-logo-circle">
            <img
              src={m.awayTeam.logo}
              alt={m.awayTeam.name}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div className="team-name">{m.awayTeam.short}</div>
        </div>
      </div>
    </div>
  );
}