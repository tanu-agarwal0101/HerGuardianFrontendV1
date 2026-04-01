"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/store/userStore";
import {
  Mic,
  Play,
  Square,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  TabletSmartphone,
  Ear,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { fuzzyMatchesTrigger } from "@/lib/fuzzyMatch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


type TestState = "idle" | "listening" | "matched" | "failed";
type DialogStep = "settings" | "onboarding";

const SESSION_OPTIONS: { label: string; ms: number | null }[] = [
  { label: "30 min",   ms: 30 * 60 * 1000 },
  { label: "1 hour",   ms: 60 * 60 * 1000 },
  { label: "Always on", ms: null },
];

const PRIVACY_POINTS = [
  {
    icon: <Ear className="w-4 h-4 text-primary shrink-0" />,
    title: "Audio stays on your device",
    desc: "Processed entirely by your browser. Never sent to our servers.",
  },
  {
    icon: <TabletSmartphone className="w-4 h-4 text-amber-500 shrink-0" />,
    title: "Works only when app is open",
    desc: "Pauses automatically when you switch tabs.",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />,
    title: "You're in control",
    desc: "Disable at any time from the SOS card or this dialog.",
  },
];


export function VoiceSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    voiceSOS,
    saveVoiceSOS,
    onboardVoice,
    setSessionExpiry,
    disableVoiceSOS,
  } = useUserStore();

  const [step,            setStep]            = useState<DialogStep>("settings");
  const [triggerPhrase,   setTriggerPhrase]   = useState(voiceSOS.triggerPhrase);
  const [draftEnabled,    setDraftEnabled]    = useState(voiceSOS.enabled);
  const [saving,          setSaving]          = useState(false);
  const [testState,       setTestState]       = useState<TestState>("idle");
  const [testTranscript,  setTestTranscript]  = useState("");
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testRecognitionRef = useRef<any>(null);
  const testStartedRef     = useRef(false);

 
  useEffect(() => {
    if (open) {
      setTriggerPhrase(voiceSOS.triggerPhrase);
      setDraftEnabled(voiceSOS.enabled);
      setStep("settings");
      setTestState("idle");
      setTestTranscript("");
    }
  }, [open, voiceSOS.triggerPhrase, voiceSOS.enabled]);


  const startTest = useCallback(() => {
    const SR =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported in this browser."); return; }

    const recognition = new SR();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const t = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join("")
        .toLowerCase()
        .trim();
      setTestTranscript(t);
      if (event.results[0].isFinal) {
        setTestState(fuzzyMatchesTrigger(t, triggerPhrase) ? "matched" : "failed");
        testStartedRef.current = false;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") {
        setTestState("failed");
        setTestTranscript("Nothing detected. Please try again.");
      } else if (event.error === "not-allowed") {
        toast.error("Microphone access denied.");
      }
      testStartedRef.current = false;
    };

    recognition.onend = () => {
      if (testStartedRef.current) setTestState("failed");
      testStartedRef.current = false;
    };

    testRecognitionRef.current = recognition;
    try {
      recognition.start();
      testStartedRef.current = true;
      setTestState("listening");
      setTestTranscript("");
    } catch (e) {
      console.error("[Test]", e);
    }
  }, [triggerPhrase]);

  const stopTest = useCallback(() => {
    if (testRecognitionRef.current && testStartedRef.current) {
      testRecognitionRef.current.stop();
      testStartedRef.current = false;
    }
    setTestState("idle");
  }, []);

  useEffect(() => { if (!open) stopTest(); }, [open, stopTest]);

  const handleToggle = (checked: boolean) => {
    setDraftEnabled(checked);
    if (checked && !voiceSOS.hasOnboardedVoice) {
      setStep("onboarding");
    }
  };

  const saveAndEnable = async () => {
    if (!triggerPhrase.trim()) { toast.error("Trigger phrase cannot be empty."); return; }
    setSaving(true);
    try {
      if (draftEnabled) {
        await saveVoiceSOS({ triggerPhrase: triggerPhrase.trim(), enabled: true });
        if (selectedSession !== undefined) setSessionExpiry(selectedSession);
        toast.success("Voice SOS enabled.");
      } else {
        await saveVoiceSOS({ triggerPhrase: triggerPhrase.trim(), enabled: false });
        disableVoiceSOS();
        toast.info("Voice SOS settings saved.", { id: "voice-sos-disabled" });
      }
      onOpenChange(false);
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleOnboardingConfirm = async () => {
    onboardVoice();
    setStep("settings");
    setDraftEnabled(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 bg-card border-white/10 shadow-2xl rounded-2xl overflow-hidden">

        <AnimatePresence mode="wait">
          {step === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex flex-col"
            >
              <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-4 text-center border-b border-white/5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Mic className="w-6 h-6" />
                </div>
                <DialogTitle className="text-lg font-bold">Enable Voice SOS?</DialogTitle>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Before we activate the microphone, here&apos;s what you should know.
                </p>
              </div>

              <div className="px-6 py-4 space-y-3">
                {PRIVACY_POINTS.map((p) => (
                  <div key={p.title} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                    <div className="mt-0.5">{p.icon}</div>
                    <div>
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6 flex flex-col gap-2">
                <Button onClick={handleOnboardingConfirm} className="w-full rounded-xl font-bold" disabled={saving}>
                  <Mic className="mr-2 h-4 w-4" /> Allow Microphone & Enable
                </Button>
                <Button variant="ghost" onClick={() => setStep("settings")} className="w-full rounded-xl text-muted-foreground">
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {step === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="flex flex-col"
            >
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold leading-tight">Voice SOS Settings</DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Hands-free emergency activation</p>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="px-6 py-4 space-y-5">

                  <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/40">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">Voice SOS</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Listen for your phrase while app is open
                      </p>
                    </div>
                    <Switch
                      id="voice-sos-toggle"
                      checked={draftEnabled}
                      onCheckedChange={handleToggle}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phrase" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Trigger Phrase
                    </Label>
                    <div className="relative">
                      <Input
                        id="phrase"
                        value={triggerPhrase}
                        onChange={(e) => {
                          setTriggerPhrase(e.target.value);
                          setTestState("idle");
                          setTestTranscript("");
                        }}
                        placeholder="e.g. Activate Emergency"
                        className="h-10 bg-background/50 border-white/5 rounded-xl pr-10 focus:ring-2 focus:ring-primary/20"
                      />
                      {triggerPhrase.trim() && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 text-primary/50" />
                      2–3 unique words work best
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Test Your Phrase
                    </Label>
                    <div className="rounded-xl border border-white/5 bg-muted/30 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        {testState === "idle" && (
                          <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg gap-1.5 text-xs"
                            onClick={startTest} disabled={!triggerPhrase.trim()}>
                            <Play className="w-3 h-3" /> Say Your Phrase
                          </Button>
                        )}
                        {testState === "listening" && (
                          <Button type="button" size="sm" variant="destructive" className="h-8 rounded-lg gap-1.5 text-xs animate-pulse"
                            onClick={stopTest}>
                            <Square className="w-3 h-3" /> Stop
                          </Button>
                        )}
                        {(testState === "matched" || testState === "failed") && (
                          <Button type="button" size="sm" variant="ghost" className="h-8 rounded-lg text-xs"
                            onClick={() => { setTestState("idle"); setTestTranscript(""); }}>
                            Try Again
                          </Button>
                        )}
                      </div>

                      <AnimatePresence mode="wait">
                        {testState === "listening" && (
                          <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-xs text-muted-foreground">
                            <motion.span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
                              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                            Listening — say your phrase now
                          </motion.div>
                        )}
                        {testTranscript && testState !== "listening" && (
                          <motion.p key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-[11px] text-muted-foreground italic truncate">
                            Heard: &quot;{testTranscript}&quot;
                          </motion.p>
                        )}
                        {testState === "matched" && (
                          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-green-500 text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> Phrase detected — Voice SOS will work!
                          </motion.div>
                        )}
                        {testState === "failed" && (
                          <motion.div key="no" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-destructive text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Not recognized — try speaking more clearly
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Timer className="w-3 h-3" /> Session Duration
                    </Label>
                    <div className="flex gap-2">
                      {SESSION_OPTIONS.map((opt) => (
                        <button key={opt.label} type="button"
                          onClick={() => draftEnabled && setSelectedSession(opt.ms)}
                          disabled={!draftEnabled}
                          aria-disabled={!draftEnabled}
                          className={cn(
                            "flex-1 text-xs py-2 px-3 rounded-lg border transition-all font-medium",
                            !draftEnabled
                              ? "opacity-40 cursor-not-allowed border-white/5 text-muted-foreground"
                              : selectedSession === opt.ms
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          )}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground/50">
                      Auto-disables after the selected duration. &quot;Always on&quot; keeps it active until you close the app.
                    </p>
                  </div>

                </div>
              </ScrollArea>

              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5 bg-card">
                <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={saveAndEnable} disabled={saving || !triggerPhrase.trim()}
                  className="rounded-xl font-bold px-6">
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </DialogContent>
    </Dialog>
  );
}
