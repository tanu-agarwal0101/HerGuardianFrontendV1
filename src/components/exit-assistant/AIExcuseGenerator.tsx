"use client";

import React, { useState } from "react";
import { useExitAssistant, type Tone } from "@/hooks/useExitAssistant";
import { Excuse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, Wand2, User, MessageCircle, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const quickContexts = [
  "awkward date",
  "creepy situation",
  "boring meeting",
  "uncomfortable gathering",
  "unwanted conversation",
];

const toneOptions: { id: Tone; label: string; emoji: string }[] = [
  { id: "polite", label: "Polite", emoji: "🤝" },
  { id: "urgent", label: "Urgent", emoji: "⚡" },
  { id: "subtle", label: "Subtle", emoji: "🤫" },
];

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "late night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function AIExcuseGenerator() {
  const aiPerson = useExitAssistant((s) => s.aiPerson);
  const aiContext = useExitAssistant((s) => s.aiContext);
  const aiTone = useExitAssistant((s) => s.aiTone);
  const generatedMessage = useExitAssistant((s) => s.generatedMessage);
  const generatedExcuse = useExitAssistant((s) => s.generatedExcuse);
  const aiLoading = useExitAssistant((s) => s.aiLoading);
  const setAiPerson = useExitAssistant((s) => s.setAiPerson);
  const setAiContext = useExitAssistant((s) => s.setAiContext);
  const setAiTone = useExitAssistant((s) => s.setAiTone);
  const setGeneratedMessage = useExitAssistant((s) => s.setGeneratedMessage);
  const setGeneratedExcuse = useExitAssistant((s) => s.setGeneratedExcuse);
  const setAiLoading = useExitAssistant((s) => s.setAiLoading);
  const setMessage = useExitAssistant((s) => s.setMessage);
  const setContactName = useExitAssistant((s) => s.setContactName);
  const setStep = useExitAssistant((s) => s.setStep);

  const [locationType] = useState<string>("");

  const inferLocationContext = async (): Promise<string> => {
    if (locationType) return locationType;

    if (!navigator?.geolocation) return "";

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(""), 2000);

      navigator.geolocation.getCurrentPosition(
        () => {
          clearTimeout(timeout);
          const hour = new Date().getHours();
          if (hour >= 18 || hour < 5) {
            resolve("evening venue");
          } else if (hour >= 12) {
            resolve("daytime location");
          } else {
            resolve("morning setting");
          }
        },
        () => {
          clearTimeout(timeout);
          resolve(""); 
        },
        { timeout: 2000 }
      );
    });
  };

  const generateExcuse = async () => {
    if (!aiContext.trim()) return;

    setAiLoading(true);
    setGeneratedMessage("");
    setGeneratedExcuse("");

    try {
      const loc = await inferLocationContext();
      const result = await Excuse.generateExcuse({
        person: aiPerson,
        context: aiContext,
        tone: aiTone,
        timeOfDay: getTimeOfDay(),
        locationType: loc || undefined,
      });
      setGeneratedMessage(result.message);
      setGeneratedExcuse(result.excuse);
    } catch {
      const pLower = (aiPerson || "Mom").toLowerCase();
      const isWork = pLower.includes("boss") || pLower.includes("work") || pLower.includes("manager") || pLower.includes("office");
      
      if (isWork) {
        setGeneratedMessage(`URGENT: There's an issue that needs your immediate attention.`);
        setGeneratedExcuse(`I'm so sorry, my ${pLower} just notified me of an urgent work issue. I need to handle this right away.`);
      } else {
        setGeneratedMessage(`Hey, ${aiPerson || "Mom"} here. Please come home!`);
        setGeneratedExcuse(`I just got a message from my ${pLower}, I need to head out. Sorry about this.`);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const useResult = () => {
    if (generatedMessage) {
      if (aiPerson) setContactName(aiPerson);
      setMessage(generatedMessage);
      setStep("customize");
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">AI Excuse Generator</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe your situation and get a natural excuse
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {quickContexts.map((ctx) => (
          <button
            key={ctx}
            onClick={() => setAiContext(ctx)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer",
              aiContext === ctx
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
            )}
          >
            {ctx}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Who is this from?
          </label>
          <Input
            value={aiPerson}
            onChange={(e) => setAiPerson(e.target.value)}
            placeholder="e.g. Mom, Boss, Sister..."
            className="bg-background/50 border-border/50 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            Situation Context
          </label>
          <Textarea
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
            placeholder="Describe your situation... (e.g. 'stuck at a boring dinner party')"
            className="bg-background/50 border-border/50 rounded-xl resize-none"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Tone
        </span>
        <div className="flex gap-2">
          {toneOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => setAiTone(t.id)}
              className={cn(
                "flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                aiTone === t.id
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/20"
              )}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={generateExcuse}
        disabled={!aiContext.trim() || aiLoading}
        className="w-full h-11 rounded-2xl font-bold shadow-md"
      >
        {aiLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Generate Message & Excuse
          </span>
        )}
      </Button>

      <AnimatePresence>
        {(generatedMessage || generatedExcuse) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-primary/15 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 space-y-4">
              {generatedMessage && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <MessageCircle className="w-3 h-3" />
                    Their Message (Alert Content)
                  </div>
                  <p className="text-sm text-foreground leading-relaxed italic">
                    &ldquo;{generatedMessage}&rdquo;
                  </p>
                </div>
              )}

              {generatedExcuse && (
                <div className="space-y-1.5 pt-2 border-t border-primary/10">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Quote className="w-3 h-3" />
                    Your Excuse (To tell others)
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{generatedExcuse}&rdquo;
                  </p>
                </div>
              )}

              <Button
                onClick={useResult}
                size="sm"
                className="w-full rounded-xl gap-1.5 mt-2"
              >
                <Check className="w-3.5 h-3.5" />
                Use This Setup
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
