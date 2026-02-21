import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/helpers/type";

export const useChatSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const baseUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.PUBLIC_API_URL ||
      "http://localhost:5000"
    );
  }, []);

  useEffect(() => {
    const s = io(baseUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = s;

    s.on("connect", () => setIsConnected(true));
    s.on("disconnect", () => setIsConnected(false));
    
    s.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    s.on("botReply", (reply: string) => {
        setMessages((prev) => [
            ...prev,
            {
                id: `bot-${Date.now()}`,
                senderId: "support-bot",
                receiverId: "user",
                message: reply,
                createdAt: new Date().toISOString()
            } as Message
        ]);
    });

    return () => {
      s.disconnect();
    };
  }, [baseUrl]);

  const joinRoom = useCallback((userId: string) => {
    socketRef.current?.emit("join", userId);
  }, []);

  const sendMessage = useCallback((payload: Pick<Message, 'senderId' | 'receiverId' | 'message'>) => {
    if (socketRef.current) {
      // Optimistically add user message if it's for the support bot
      const userMsg = {
        id: `user-${Date.now()}`,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        message: payload.message,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, userMsg as Message]);
      
      // Emit to backend
      socketRef.current.emit("userMessage", payload.message);
    }
  }, []);

  return { 
    socket: socketRef.current, 
    isConnected, 
    connecting: !isConnected,
    messages, 
    sendMessage, 
    joinRoom 
  };
};
