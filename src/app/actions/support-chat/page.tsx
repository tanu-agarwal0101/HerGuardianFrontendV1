"use client";
import { Button } from "@/components/ui/button";
import { MoveLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected", socket.id);
});

export default function ChatPage() {
  const [messages, setMessages] = useState<
    {
      sender: "bot" | "user";
      text: string;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [newChat, setNewChat] = useState(true);
  const router = useRouter();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io("http://localhost:5001", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;
    console.log("Current socket:", socketRef.current);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("botReply", (msg) => {
      console.log("Bot reply received", msg);
      setMessages((prev) => [...prev, { sender: "bot", text: msg }]);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const sendMessage = () => {
    if (!input) return;

    console.log("Current socket:", socketRef.current);

    if (input.trim()) {
      setMessages((prev) => [...prev, { sender: "user", text: input }]);

      console.log("Sending message:", input);
      socketRef.current.emit("userMessage", input);
      setInput("");
      setNewChat(false);
    }
  };

  return (
    <div className="border rounded-lg w-full p-4  min-h-[500px] flex flex-col justify-between items-center shadow-lg ">
      <div className="w-full">
        <Button className="bg-purple-500 text-white hover:bg-purple-800 mb-4"
        onClick={()=> router.push("/actions")}><MoveLeft/>Back</Button>
      </div>
      <h2 className="text-xl underline bg-slate-200 w-full text-center p-4 font-bold">
        Ask Guardian
      </h2>

      {newChat ? (
        <div className="space-y-2 mb-4 flex flex-col gap-2 px-4">
          {[
            "What if I'm being followed?",
            "How can I stay safe at night?",
            "What to do in case of harassment?",
          ].map((q) => (
            <Button
              key={q}
              onClick={() => {
                setInput(q);
                sendMessage();
              }}
              className="text-sm text-white bg-purple-500 px-4 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              {q}
            </Button>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto bg-gray-100 p-4 rounded h-full w-full  flex flex-col gap-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                m.sender === "user"
                  ? "bg-purple-200 self-end"
                  : "bg-purple-500 text-white self-start"
              }`}
            >
              <div>
                <span className="font-bold underline">
                  {m.sender === "bot" ? " Guardian: " : "You: "} 
                </span>
                <br />
                {m.text.split("\n").map((line, idx) => (
                  <p key={idx} className="text-sm">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex justify-center items-center gap-2 p-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="w-4/5 border p-2 rounded"
          placeholder="Type your question here..."
        />
        <Button
          onClick={sendMessage}
          className="bg-purple-600 text-white p-2 rounded"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
