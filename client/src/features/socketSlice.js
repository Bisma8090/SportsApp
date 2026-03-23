import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    liveMatches: [],
    liveMatchDetail: null,
    recentEvents: [],
    connected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setLiveMatches: (state, action) => {
      state.liveMatches = action.payload;
    },
    setLiveMatchDetail: (state, action) => {
      state.liveMatchDetail = action.payload;
    },
    addMatchEvent: (state, action) => {
      const { matchId, event, match } = action.payload;

      // Update live match detail if it matches
      if (state.liveMatchDetail?.id === matchId) {
        state.liveMatchDetail = match;
      }

      // Add to recent events (keep last 10)
      state.recentEvents = [
        { ...event, matchId, id: Date.now() },
        ...state.recentEvents,
      ].slice(0, 10);

      // Update the match in liveMatches
      state.liveMatches = state.liveMatches.map((m) =>
        m.id === matchId ? match : m
      );
    },
  },
});

export const { setConnected, setLiveMatches, setLiveMatchDetail, addMatchEvent } =
  socketSlice.actions;
export default socketSlice.reducer;
