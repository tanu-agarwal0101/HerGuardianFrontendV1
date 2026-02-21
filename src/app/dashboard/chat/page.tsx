"use client";
import { useEffect, useRef, useState } from "react";
// import RequireAuth from "@/components/common/RequireAuth"; // Handled by layout
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notifyError } from "@/lib/httpErrors";
// import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSocket } from "@/hooks/useChatSocket";

type ChatMessage = {
  id: string;
  from: "user" | "bot";
  text: string;
  at: number;
};

const STORAGE_KEY = "hg-chat-history";

const mockMessages: Omit<ChatMessage, "id" | "at">[] = [
  { from: "bot", text: "Hello! I'm HerGuardian. How can I help you stay safe today?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Use custom hook for socket connection
  const { socket, connecting } = useChatSocket();

  // Load from storage + seed mock if empty
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : null;
      const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
      if (parsed.length > 0) {
        setMessages(parsed);
      } else {
        const seeded: ChatMessage[] = mockMessages.map((m, idx) => ({
          id: `seed-${idx}`,
          from: m.from,
          text: m.text,
          at: Date.now() + idx,
        }));
        setMessages(seeded);
      }
    } catch {}
  }, []);

  // Persist to storage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Handle incoming bot replies
  useEffect(() => {
    if (!socket) return;
    
    // Event listener for backend response (expects string)
    const onBotReply = (replyText: string) => {
      // console.log("Frontend received botReply payload:", replyText);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, from: "bot", text: replyText, at: Date.now() },
      ]);
    };

    socket.on("botReply", onBotReply);

    return () => {
      socket.off("botReply", onBotReply);
    };
  }, [socket]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
      at: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    try {
      setIsTyping(true);
      // Backend expects "userMessage" event and raw string payload
      socket?.emit("userMessage", text); 
      // Safety timeout to remove typing if server is slow (increased to 45s)
      window.setTimeout(() => setIsTyping(false), 45000);
    } catch (e) {
      setIsTyping(false);
      notifyError(e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto bg-card rounded-2xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Bot size={24} />
            </div>
            {!connecting && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
              HerGuardian AI <Sparkles size={16} className="text-yellow-500" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {connecting ? "Connecting..." : "Online • Safety Assistant"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isUser = m.from === "user";
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                 {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-xs",
                  isUser ? "bg-primary" : "bg-muted text-muted-foreground"
                )}>
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border text-card-foreground rounded-bl-none"
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2 mr-auto max-w-[85%]"
          >
             <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
                <Bot size={14} />
            </div>
            <div className="bg-card border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            className="pr-12 py-6 rounded-full border-input bg-muted/50 focus:bg-background focus:ring-primary/20 transition-all shadow-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim()}
            className={cn(
              "absolute right-1.5 w-9 h-9 rounded-full transition-all",
              input.trim() 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send size={16} className={input.trim() ? "ml-0.5" : ""} />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          AI generated responses. For emergencies, always call local authorities.
        </p>
      </div>
    </div>
  );
}


