"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUserStore } from "@/store/userStore";
import { VoiceSOSOverlay } from "@/components/dashboard/VoiceSOSOverlay";
import { VoiceActiveIndicator } from "@/components/dashboard/VoiceActiveIndicator";
import { toast } from "sonner";
import { fuzzyMatchesTrigger } from "@/lib/fuzzyMatch";

// ─── Context Interface ─────────────────────────────────────────────────────────
interface VoiceSOSContextType {
  isListening: boolean;
  isPaused: boolean;           // true when tab is hidden
  isTriggered: boolean;
  startListening: () => void;
  stopListening: () => void;
  cancelTrigger: () => void;
}

const VoiceSOSContext = createContext<VoiceSOSContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const VoiceSOSProvider = ({ children }: { children: React.ReactNode }) => {
  const { voiceSOS, setVoiceSOS } = useUserStore();

  const [isListening, setIsListening]   = useState(false);
  const [isPaused,    setIsPaused]       = useState(false);
  const [isTriggered, setIsTriggered]   = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef  = useRef<any>(null);
  const isStartedRef    = useRef(false);
  const pausedByVisRef  = useRef(false); 
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startEngine = useCallback(() => {
    if (!recognitionRef.current || isStartedRef.current) return;
    try {
      recognitionRef.current.start();
      isStartedRef.current = true;
    } catch (e) {
      console.error("[VoiceSOS] Failed to start engine:", e);
    }
  }, []);

  const stopEngine = useCallback(() => {
    if (!recognitionRef.current || !isStartedRef.current) return;
    try {
      recognitionRef.current.onend = null; 
      recognitionRef.current.stop();
      isStartedRef.current = false;
    } catch (e) {
      console.error("[VoiceSOS] Failed to stop engine:", e);
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("[VoiceSOS] Web Speech API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous      = true;
    recognition.interimResults  = false;
    recognition.lang            = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      isStartedRef.current = true;
    };

    recognition.onend = () => {
      setIsListening(false);
      isStartedRef.current = false;

      const { voiceSOS: current } = useUserStore.getState();
      if (current.enabled && !pausedByVisRef.current) {
        startEngine();
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      const { voiceSOS: current } = useUserStore.getState();
      const matched = fuzzyMatchesTrigger(transcript, current.triggerPhrase);

      if (matched) {
        console.log("[VoiceSOS] Trigger phrase detected:", transcript);
        setIsTriggered(true);
        stopEngine();

        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") return;

      console.error("[VoiceSOS] Error:", event.error);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        toast.error("Microphone access denied. Re-enable it in your browser settings to use Voice SOS.");
        setVoiceSOS({ enabled: false, isPermissionGranted: false });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        isStartedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceSOS.triggerPhrase, startEngine, stopEngine]);

  useEffect(() => {
    if (voiceSOS.enabled && !isTriggered && !pausedByVisRef.current) {
      startEngine();
    } else if (!voiceSOS.enabled || isTriggered) {
      stopEngine();
    }
  }, [voiceSOS.enabled, isTriggered, startEngine, stopEngine]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const { voiceSOS: current } = useUserStore.getState();
      if (!current.enabled) return;

      if (document.hidden) {
        pausedByVisRef.current = true;
        setIsPaused(true);
        stopEngine();
        toast.warning("⚠ Voice SOS paused — keep the app open for hands-free protection.", {
          id: "voice-sos-pause", 
          duration: 5000,
        });
      } else {
        pausedByVisRef.current = false;
        setIsPaused(false);
        if (!isTriggered) startEngine();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isTriggered, startEngine, stopEngine]);

  useEffect(() => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);

    const { sessionExpiry } = voiceSOS;
    if (!sessionExpiry || !voiceSOS.enabled) return;

    const remaining = sessionExpiry - Date.now();
    if (remaining <= 0) {
      setVoiceSOS({ enabled: false, sessionExpiry: null });
      toast.info("Voice SOS session ended. Re-enable from the SOS card.");
      return;
    }

    sessionTimerRef.current = setTimeout(() => {
      setVoiceSOS({ enabled: false, sessionExpiry: null });
      toast.info("Voice SOS session ended. Re-enable from the SOS card.");
    }, remaining);

    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceSOS.sessionExpiry, voiceSOS.enabled]);

    const startListening = useCallback(() => {
    setVoiceSOS({ enabled: true });
  }, [setVoiceSOS]);

  const stopListening = useCallback(() => {
    setVoiceSOS({ enabled: false });
  }, [setVoiceSOS]);

  const cancelTrigger = useCallback(() => {
    setIsTriggered(false);
  }, []);

  return (
    <VoiceSOSContext.Provider
      value={{ isListening, isPaused, isTriggered, startListening, stopListening, cancelTrigger }}
    >
      {children}
      <VoiceActiveIndicator />
      {isTriggered && <VoiceSOSOverlay onCancel={cancelTrigger} />}
    </VoiceSOSContext.Provider>
  );
};

export const useVoiceSOS = () => {
  const context = useContext(VoiceSOSContext);
  if (!context) throw new Error("useVoiceSOS must be used within VoiceSOSProvider");
  return context;
};
