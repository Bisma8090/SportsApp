import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeLeague: "all",
    selectedMatchId: null,
    activeTab: "overview",
    navTab: "explore",
  },
  reducers: {
    setActiveLeague: (state, action) => {
      state.activeLeague = action.payload;
    },
    setSelectedMatchId: (state, action) => {
      state.selectedMatchId = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setNavTab: (state, action) => {
      state.navTab = action.payload;
    },
  },
});

export const { setActiveLeague, setSelectedMatchId, setActiveTab, setNavTab } =
  uiSlice.actions;
export default uiSlice.reducer;
