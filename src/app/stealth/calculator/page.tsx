"use client";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

export default function Calculator() {
  const [input, setInput] = useState("0");
  const [prevInput, setPrevInput] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const router = useRouter();
  const { dashboardPass, sosPass } = useUserStore((s) => s.stealth);

  const handleDigit = (digit: string) => {
    let newVal = input;
    if (waitingForOperand) {
      newVal = digit;
      setWaitingForOperand(false);
    } else {
      newVal = input === "0" ? digit : input + digit;
    }
    setInput(newVal);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(input);
    
    if (prevInput == null) {
      setPrevInput(input);
    } else if (operator) {
      const result = performCalculation(operator, parseFloat(prevInput), inputValue);
      setInput(String(result));
      setPrevInput(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (op: string, left: number, right: number) => {
    switch(op) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
      default: return right;
    }
  };

  const handleEqual = async () => {
     if (input && input.length >= 4) {
        const isTrigger = await checkTriggers(input);
        if (isTrigger) return;
     }

     if (!operator || prevInput == null) return;
     const inputValue = parseFloat(input);
     const result = performCalculation(operator, parseFloat(prevInput), inputValue);
     
     const resultStr = String(result);
     setInput(resultStr);
     setPrevInput(null);
     setOperator(null);
     setWaitingForOperand(true);
  };

  const handleClear = () => {
    setInput("0");
    setPrevInput(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const checkTriggers = async (val: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/stealth/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: val }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.type === "dashboard") {
            await unlockApp();
            return true;
          } else if (data.type === "sos") {
            triggerSOS();
            setInput("0");
            setPrevInput(null);
            setOperator(null);
            setWaitingForOperand(false);
            return true;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const unlockApp = async () => {
    try {
      await fetch("/api/stealth/unlock", { method: "POST" });
      useUserStore.getState().setStealth({ stealthMode: false }); // optimistic
      router.push("/dashboard"); // Middleware will now allow this because cookie is gone
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-end justify-center pb-12 sm:items-center sm:pb-0">
      <div className="w-full max-w-xs px-4">
        {/* Display */}
        <div className="mb-4 text-right px-4">
           <span className="text-6xl font-light text-white tracking-tight">
             {input}
           </span>
        </div>

        {/* Pad */}
        <div className="grid grid-cols-4 gap-3">
           <CalcButton label="AC" onClick={handleClear} variant="gray" />
           <CalcButton label="+/-" onClick={() => {}} variant="gray" />
           <CalcButton label="%" onClick={() => {}} variant="gray" />
           <CalcButton label="÷" onClick={() => handleOperator("/")} variant="orange" />

           <CalcButton label="7" onClick={() => handleDigit("7")} />
           <CalcButton label="8" onClick={() => handleDigit("8")} />
           <CalcButton label="9" onClick={() => handleDigit("9")} />
           <CalcButton label="×" onClick={() => handleOperator("*")} variant="orange" />

           <CalcButton label="4" onClick={() => handleDigit("4")} />
           <CalcButton label="5" onClick={() => handleDigit("5")} />
           <CalcButton label="6" onClick={() => handleDigit("6")} />
           <CalcButton label="-" onClick={() => handleOperator("-")} variant="orange" />

           <CalcButton label="1" onClick={() => handleDigit("1")} />
           <CalcButton label="2" onClick={() => handleDigit("2")} />
           <CalcButton label="3" onClick={() => handleDigit("3")} />
           <CalcButton label="+" onClick={() => handleOperator("+")} variant="orange" />

           <CalcButton label="0" onClick={() => handleDigit("0")} span={2} />
           <CalcButton label="." onClick={() => handleDigit(".")} />
           <CalcButton label="=" onClick={handleEqual} variant="orange" />
        </div>
      </div>
    </div>
  );
}

function CalcButton({ label, onClick, variant = "dark", span = 1 }: { label: string, onClick: () => void, variant?: "gray" | "orange" | "dark", span?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-20 w-full rounded-full text-3xl font-medium transition-filter active:brightness-125 flex items-center justify-center",
        variant === "gray" && "bg-[#A5A5A5] text-black",
        variant === "orange" && "bg-[#FF9F0A] text-white",
        variant === "dark" && "bg-[#333333] text-white",
        span === 2 ? "col-span-2 pl-9 justify-start" : ""
      )}
    >
      {label}
    </button>
  );
}
