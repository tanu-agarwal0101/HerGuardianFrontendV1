"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/helpers/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Send, MoveLeft, User, Bot, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';


export default function SupportChat() {
  const router = useRouter();
  const { messages, sendMessage, joinRoom, isConnected } = useChatSocket();
  const [input, setInput] = useState("");
  const user = useUserStore((state) => state.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false); // Visual typing indicator for bot

  useEffect(() => {
    if (user?.id) {
      joinRoom(user.id);
    }
  }, [user, joinRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  const handleSend = () => {
    if (!input.trim()) return;
    
    // Optimistic UI update or just rely on socket echo if robust enough
    // Ideally, sendMessage returns promise or socket emits back 'messageReceived'
    // For now, assume socket handles state updates via 'receive_message' event

    sendMessage({
      senderId: user?.id,
      receiverId: "support-bot", 
      message: input,
    });
    setInput("");
    setIsTyping(true); 
    
    // Simulate bot thinking/typing time if needed, or rely on actual backend response
    // If backend is fast, we might not need artificial delay, but `messages` update will clear typing
  };

  // Listen for new messages to clear typing indicator
  useEffect(() => {
     if(messages.length > 0 && messages[messages.length-1].senderId !== user?.id) {
         setIsTyping(false);
     }
  }, [messages, user?.id]);


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto bg-card rounded-2xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/actions")}>
                <MoveLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Bot className="h-6 w-6" />
                 </div>
                 {isConnected && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                 )}
            </div>
            <div>
                 <h1 className="font-semibold leading-none">Support Assistant</h1>
                 <p className="text-xs text-muted-foreground mt-1">
                    {isConnected ? "Online" : "Connecting..."}
                 </p>
            </div>
        </div>
      </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20" ref={scrollRef}>
        {messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id; // Or however you distinguish self
            return (
                <div key={idx} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn(
                        "flex max-w-[80%] gap-2",
                        isMe ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                            isMe ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        )}>
                            {isMe ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl shadow-sm text-sm overflow-hidden", // Added overflow-hidden
                             isMe 
                             ? "bg-primary text-primary-foreground rounded-tr-none" 
                             : "bg-card border rounded-tl-none"
                        )}>
                            {/* Render Markdown content primarily for bot messages */}
                           {/* { <p className="whitespace-pre-wrap">{msg.message}</p>} */}
                           <ReactMarkdown className={cn("prose dark:prose-invert max-w-none text-sm break-words", isMe ? "text-primary-foreground" : "")}> 
                              {msg.message}
                            </ReactMarkdown>

                        </div>
                    </div>
                </div>
            )
        })}
        {isTyping && (
             <div className="flex w-full justify-start">
                  <div className="flex max-w-[80%] gap-2 flex-row">
                      <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-1">
                           <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-card border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                          <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                      </div>
                  </div>
             </div>
        )}
       </div>


        {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 relative"
        >
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-12 py-6 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary focus-visible:ring-offset-0"
                disabled={!isConnected}
            />
            <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 bottom-1 h-auto w-10 rounded-full"
                disabled={!input.trim() || !isConnected}
            >
                {isConnected ? <Send className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin"/>}
                <span className="sr-only">Send</span>
            </Button>
        </form>
      </div>
    </div>
  );
}
