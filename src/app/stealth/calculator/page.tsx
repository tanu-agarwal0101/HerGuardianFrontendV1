"use client";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";

export default function Calculator() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { dashboardPass, sosPass } = useUserStore((s) => s.stealth);

  const handleClick = (value: string) => {
    if (value === "AC") return setInput("");
    if (value === "=") {
      try {
        const result = eval(input).toString();
        setInput(result);
        // SOS pass can be an expression (e.g. 12+34=)
        if (sosPass && input === sosPass) {
          sendSignal(input + "=" + result, "sos");
        }
      } catch {
        setInput("Error");
      }
    } else {
      const newInput = input + value;
      setInput(newInput);
      if (dashboardPass && newInput === dashboardPass) {
        sendSignal(newInput, "dashboard");
      }
      if (sosPass && newInput === sosPass) {
        sendSignal(newInput, "sos");
      }
    }
  };

  const sendSignal = async (signal: string, type: "dashboard" | "sos") => {
    try {
      if (type === "dashboard") {
        router.push("/dashboard");
      } else {
        triggerSOS();
      }
    } catch (err) {
      console.error("Failed to send signal", err);
    }
  };

  const buttons = [
    "1",
    "2",
    "3",
    "+",
    "4",
    "5",
    "6",
    "-",
    "7",
    "8",
    "9",
    "*",
    "AC",
    "0",
    "=",
    "/",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-sm p-4">
        <div className="bg-gray-200 text-right text-2xl p-4 rounded mb-4">
          {input || "0"}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className="p-4 bg-purple-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
