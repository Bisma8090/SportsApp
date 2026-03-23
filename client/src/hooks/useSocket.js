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

let socketInstance = null;

export const useSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
    }
    socketRef.current = socketInstance;

    const socket = socketRef.current;

    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    socket.on("matches:update", (matches) => {
      dispatch(setLiveMatches(matches));
    });

    socket.on("match:detail", (match) => {
      dispatch(setLiveMatchDetail(match));
    });

    socket.on("match:event", (payload) => {
      dispatch(addMatchEvent(payload));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("matches:update");
      socket.off("match:detail");
      socket.off("match:event");
    };
  }, [dispatch]);

  const subscribeToMatch = (matchId) => {
    if (socketRef.current) {
      socketRef.current.emit("subscribe:match", matchId);
    }
  };

  const unsubscribeFromMatch = (matchId) => {
    if (socketRef.current) {
      socketRef.current.emit("unsubscribe:match", matchId);
    }
  };

  return { subscribeToMatch, unsubscribeFromMatch };
};
