import { configureStore } from "@reduxjs/toolkit";
import { sportsApi } from "./sportsApi";
import socketReducer from "../features/socketSlice";
import uiReducer from "../features/uiSlice";

export const store = configureStore({
  reducer: {
    [sportsApi.reducerPath]: sportsApi.reducer,
    socket: socketReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sportsApi.middleware),
});
