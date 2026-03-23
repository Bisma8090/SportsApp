const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ─── Mock Data ───────────────────────────────────────────────────────────────

const leagues = [
  { id: "pl", name: "Premier League", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { id: "ucl", name: "Champions League", logo: "⭐", country: "Europe" },
  { id: "laliga", name: "La Liga", logo: "🇪🇸", country: "Spain" },
];

const teams = {
  man_city: { 
    id: "man_city", 
    name: "Man City", 
    short: "MCI", 
    color: "#6CABDD", 
    logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" 
  },
  man_utd: { 
    id: "man_utd", 
    name: "Man United", 
    short: "MNU", 
    color: "#DA291C", 
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" 
  },
  arsenal: { 
    id: "arsenal", 
    name: "Arsenal", 
    short: "ARS", 
    color: "#EF0107", 
    logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" 
  },
  chelsea: { 
    id: "chelsea", 
    name: "Chelsea", 
    short: "CHE", 
    color: "#034694", 
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" 
  },
  liverpool: { 
    id: "liverpool", 
    name: "Liverpool", 
    short: "LIV", 
    color: "#C8102E", 
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" 
  },
  tottenham: { 
    id: "tottenham", 
    name: "Tottenham", 
    short: "TOT", 
    color: "#132257", 
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg"
  },
  barcelona: { 
    id: "barcelona", 
    name: "Barcelona", 
    short: "BAR", 
    color: "#A50044", 
    logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" 
  },
  real_madrid: { 
    id: "real_madrid", 
    name: "Real Madrid", 
    short: "RMA", 
    color: "#FEBE10", 
    logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" 
  },
  bayern: { 
    id: "bayern", 
    name: "Bayern Munich", 
    short: "BAY", 
    color: "#DC052D", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/FC_Bayern_München_logo_%282017%29.svg/120px-FC_Bayern_München_logo_%282017%29.svg.png"
  },
  dortmund: { 
    id: "dortmund", 
    name: "B. Dortmund", 
    short: "BVB", 
    color: "#FDE100", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" 
  },
};

let matches = [
  {
    id: "m1",
    league: "pl",
    homeTeam: teams.man_city,
    awayTeam: teams.arsenal,
    homeScore: 2,
    awayScore: 1,
    status: "LIVE",
    minute: 67,
    venue: "Etihad Stadium",
    date: "2025-03-19",
    events: [
      { minute: 12, team: "man_city", player: "Haaland", type: "goal" },
      { minute: 34, team: "arsenal", player: "Saka", type: "goal" },
      { minute: 58, team: "man_city", player: "De Bruyne", type: "goal" },
      { minute: 45, team: "arsenal", player: "Rice", type: "yellow_card" },
    ],
  },
  {
    id: "m2",
    league: "ucl",
    homeTeam: teams.barcelona,
    awayTeam: teams.real_madrid,
    homeScore: 1,
    awayScore: 1,
    status: "LIVE",
    minute: 83,
    venue: "Camp Nou",
    date: "2025-03-19",
    events: [
      { minute: 23, team: "barcelona", player: "Yamal", type: "goal" },
      { minute: 71, team: "real_madrid", player: "Vinicius", type: "goal" },
    ],
  },
  {
    id: "m3",
    league: "pl",
    homeTeam: teams.chelsea,
    awayTeam: teams.liverpool,
    homeScore: 0,
    awayScore: 2,
    status: "FT",
    minute: 90,
    venue: "Stamford Bridge",
    date: "2025-03-19",
    events: [
      { minute: 11, team: "liverpool", player: "Salah", type: "goal" },
      { minute: 77, team: "liverpool", player: "Núñez", type: "goal" },
      { minute: 55, team: "chelsea", player: "Jackson", type: "yellow_card" },
    ],
  },
 
  {
    id: "m5",
    league: "laliga",
    homeTeam: teams.real_madrid,
    awayTeam: teams.barcelona,
    homeScore: 3,
    awayScore: 2,
    status: "FT",
    minute: 90,
    venue: "Santiago Bernabéu",
    date: "2025-03-18",
    events: [
      { minute: 5, team: "real_madrid", player: "Bellingham", type: "goal" },
      { minute: 22, team: "barcelona", player: "Lewandowski", type: "goal" },
      { minute: 44, team: "real_madrid", player: "Vinicius", type: "goal" },
      { minute: 60, team: "barcelona", player: "Raphinha", type: "goal" },
      { minute: 88, team: "real_madrid", player: "Rodrygo", type: "goal" },
    ],
  },
  {
    id: "m6",
    league: "pl",
    homeTeam: teams.tottenham,
    awayTeam: teams.man_utd,
    homeScore: 0,
    awayScore: 0,
    status: "NS",
    minute: 0,
    venue: "Tottenham Hotspur Stadium",
    date: "2025-03-20",
    kickoff: "16:00",
    events: [],
  },
];

// ─── REST Endpoints (RTK Query) ───────────────────────────────────────────────

app.get("/api/leagues", (req, res) => {
  res.json(leagues);
});

app.get("/api/matches", (req, res) => {
  const { league, status } = req.query;
  let result = matches;
  if (league && league !== "all") result = result.filter((m) => m.league === league);
  if (status) result = result.filter((m) => m.status === status);
  res.json(result);
});

app.get("/api/matches/:id", (req, res) => {
  const match = matches.find((m) => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });
  res.json(match);
});

app.get("/api/standings/:league", (req, res) => {
  const standings = [
    { pos: 1, team: teams.man_city, played: 28, won: 20, drawn: 5, lost: 3, gd: 42, points: 65 },
    { pos: 2, team: teams.arsenal, played: 28, won: 19, drawn: 5, lost: 4, gd: 38, points: 62 },
    { pos: 3, team: teams.liverpool, played: 28, won: 18, drawn: 6, lost: 4, gd: 35, points: 60 },
    { pos: 4, team: teams.chelsea, played: 28, won: 14, drawn: 7, lost: 7, gd: 18, points: 49 },
    { pos: 5, team: teams.tottenham, played: 28, won: 12, drawn: 8, lost: 8, gd: 10, points: 44 },
    { pos: 6, team: teams.man_utd, played: 28, won: 10, drawn: 6, lost: 12, gd: -5, points: 36 },
  ];
  res.json(standings);
});

// ─── Socket.IO Real-time Updates ─────────────────────────────────────────────

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("matches:update", matches);

  socket.on("subscribe:match", (matchId) => {
    socket.join(`match:${matchId}`);
    const match = matches.find((m) => m.id === matchId);
    if (match) socket.emit("match:detail", match);
  });

  socket.on("unsubscribe:match", (matchId) => {
    socket.leave(`match:${matchId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ─── Simulate Live Match Updates ─────────────────────────────────────────────

const randomGoalScorers = {
  man_city: ["Haaland", "De Bruyne", "Foden", "Bernardo"],
  arsenal: ["Saka", "Martinelli", "Havertz", "Trossard"],
  barcelona: ["Yamal", "Lewandowski", "Raphinha", "Pedri"],
  real_madrid: ["Vinicius", "Bellingham", "Rodrygo", "Mbappé"],
};

setInterval(() => {
  const liveMatches = matches.filter((m) => m.status === "LIVE");
  if (liveMatches.length === 0) return;

  liveMatches.forEach((match) => {
    // Advance minute
    match.minute = Math.min(match.minute + 1, 90);

    // Random event ~15% chance per tick
    if (Math.random() < 0.15) {
      const isHome = Math.random() > 0.5;
      const scoringTeam = isHome ? match.homeTeam : match.awayTeam;
      const eventType = Math.random() < 0.7 ? "goal" : "yellow_card";
      const scorers = randomGoalScorers[scoringTeam.id] || ["Player"];
      const player = scorers[Math.floor(Math.random() * scorers.length)];

      const event = { minute: match.minute, team: scoringTeam.id, player, type: eventType };
      match.events.push(event);

      if (eventType === "goal") {
        if (isHome) match.homeScore++;
        else match.awayScore++;
      }

      io.to(`match:${match.id}`).emit("match:event", { matchId: match.id, event, match });
    }

    if (match.minute >= 90) {
      match.status = "FT";
    }
  });

  io.emit("matches:update", matches);
}, 5000); // every 5 seconds

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
