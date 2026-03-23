import React from "react";
import { useSelector } from "react-redux";

const eventIcons = {
  goal: "⚽",
  yellow_card: "🟨",
  red_card: "🟥",
};

export default function LiveFeed() {
  const events = useSelector((s) => s.socket.recentEvents);
  const liveMatches = useSelector((s) => s.socket.liveMatches);
  const liveCount = liveMatches.filter((m) => m.status === "LIVE").length;

  if (events.length === 0) {
    return (
      <div className="live-feed">
        <span className="live-feed-label">LIVE FEED</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {liveCount > 0 ? `${liveCount} matches in progress — awaiting events…` : "No live matches right now"}
        </span>
      </div>
    );
  }

  return (
    <div className="live-feed">
      <span className="live-feed-label">LIVE</span>
      {events.slice(0, 5).map((ev) => (
        <div key={ev.id} className="feed-event-pill">
          <span>{eventIcons[ev.type] || "📋"}</span>
          <span style={{ fontWeight: 600 }}>{ev.player}</span>
          <span style={{ color: "var(--text-muted)" }}>{ev.minute}'</span>
        </div>
      ))}
    </div>
  );
}
