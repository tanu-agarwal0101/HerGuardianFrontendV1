import { useEffect, useRef, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { notifyError } from "@/lib/httpErrors";

export const useChatSocket = () => {
  const [connecting, setConnecting] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const baseUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.PUBLIC_API_URL ||
      "http://localhost:5000"
    );
  }, []);

  useEffect(() => {
    let active = true;
    setConnecting(true);
    const s = io(baseUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = s;

    const onConnect = () => {
      if (!active) return;
      setConnecting(false);
    };

    const onConnectError = (err: any) => {
      console.error("Socket connection error:", err);
      // notifyError(err); // Optional: suppress if polling fallback is expected
      setConnecting(false);
    };
    
    const onError = (err: any) => {
        console.error("Socket error:", err);
    };

    s.on("connect", onConnect);
    s.on("connect_error", onConnectError);
    s.on("error", onError);

    return () => {
      active = false;
      try {
        s.off("connect", onConnect);
        s.off("connect_error", onConnectError);
        s.off("error", onError);
        s.disconnect();
      } catch {}
    };
  }, [baseUrl]);

  return { socket: socketRef.current, connecting };
};
