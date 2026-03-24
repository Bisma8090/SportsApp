import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import {
  setConnected,
  setLiveMatches,
  setLiveMatchDetail,
  addMatchEvent,
} from "../features/socketSlice";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Module level pe rakho — React ke bahar
let socketInstance = null;
let listenersAttached = false; // 👈 ye add karo

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sirf ek baar connection banao
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
    }

    // Sirf ek baar listeners lagao
    if (!listenersAttached) {
      listenersAttached = true;

      socketInstance.on("connect", () => {
        dispatch(setConnected(true));
        console.log("✅ Socket connected");
      });

      socketInstance.on("disconnect", () => {
        dispatch(setConnected(false));
        console.log("❌ Socket disconnected");
      });

      socketInstance.on("matches:update", (matches) => {
        dispatch(setLiveMatches(matches));
      });

      socketInstance.on("match:detail", (match) => {
        dispatch(setLiveMatchDetail(match));
      });

      socketInstance.on("match:event", (payload) => {
        dispatch(addMatchEvent(payload));
      });
    }

    // Cleanup mein sirf listeners remove karo, connection nahi todna
    return () => {};
  }, [dispatch]);

  const subscribeToMatch = (matchId) => {
    if (socketInstance) {
      socketInstance.emit("subscribe:match", matchId);
    }
  };

  const unsubscribeFromMatch = (matchId) => {
    if (socketInstance) {
      socketInstance.emit("unsubscribe:match", matchId);
    }
  };

  return { subscribeToMatch, unsubscribeFromMatch };
};