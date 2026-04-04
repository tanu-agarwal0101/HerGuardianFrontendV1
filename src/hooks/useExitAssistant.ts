
import { create } from "zustand";
import { showLocalNotification } from "@/lib/notificationsService";


export type ExitStep =
  | "idle"
  | "category"
  | "customize"
  | "timer"
  | "ai"
  | "alert";

export type ExitCategory =
  | "emergency"
  | "family"
  | "work"
  | "safety"
  | "other";

export type AvatarType = "initials" | "preset";

export type Tone = "polite" | "urgent" | "subtle";

export type PresetContact = "Mom" | "Friend" | "Boss" | "Custom";

export interface ExitAssistantState {

  isOpen: boolean;
  step: ExitStep;
  selectedCategory: ExitCategory | null;

  contactName: string;
  message: string;
  avatarType: AvatarType;
  presetContact: PresetContact | null;


  aiPerson: string;
  aiContext: string;
  aiTone: Tone;
  generatedMessage: string;
  generatedExcuse: string;
  aiLoading: boolean;

  timerMinutes: number;
  timerActive: boolean;
  timerEndTime: number | null; 
  alertVisible: boolean;

  open: () => void;
  close: () => void;
  setStep: (step: ExitStep) => void;

  selectCategory: (category: ExitCategory) => void;
  setContactName: (name: string) => void;
  setMessage: (message: string) => void;
  setAvatarType: (type: AvatarType) => void;
  selectPreset: (preset: PresetContact) => void;

  setAiPerson: (person: string) => void;
  setAiContext: (context: string) => void;
  setAiTone: (tone: Tone) => void;
  setGeneratedMessage: (msg: string) => void;
  setGeneratedExcuse: (excuse: string) => void;
  setAiLoading: (loading: boolean) => void;

  setTimerMinutes: (minutes: number) => void;
  startTimer: () => void;
  cancelTimer: () => void;

  triggerAlert: () => void;
  triggerQuickExit: (prefs: { contactName: string; message: string }) => void;
  dismissAlert: () => void;

  reset: () => void;
}


export const CONTACT_PRESETS: Record<
  Exclude<PresetContact, "Custom">,
  { name: string; defaultMessages: string[]; toneHint: Tone }
> = {
  Mom: {
    name: "Mom",
    defaultMessages: [
      "Please come pick me up 🙏",
      "Call me ASAP, it's important",
      "I need you right now",
    ],
    toneHint: "urgent",
  },
  Friend: {
    name: "Friend",
    defaultMessages: [
      "Hey, where are you?",
      "Come outside, I'm waiting!",
      "Are you still coming?",
    ],
    toneHint: "subtle",
  },
  Boss: {
    name: "Boss",
    defaultMessages: [
      "Need you for something important",
      "Quick check-in needed, call when you can",
      "Please report to the office urgently",
    ],
    toneHint: "polite"
  },
};

export const CATEGORY_DEFAULTS: Record<
  ExitCategory,
  { preset: PresetContact; message: string }
> = {
  emergency: { preset: "Mom", message: "Call me ASAP, it's important" },
  family: { preset: "Mom", message: "Please come pick me up 🙏" },
  work: { preset: "Boss", message: "Need you for something important" },
  safety: { preset: "Friend", message: "Come outside, I'm waiting!" },
  other: { preset: "Friend", message: "Hey, where are you?" },
};

export const MESSAGE_TEMPLATES = {
  urgent: [
    "Call me ASAP",
    "Come pick me up now",
    "I need to leave immediately",
  ],
  casual: [
    "Hey, where are you?",
    "Are you coming?",
    "Can you call me when you get this?",
  ],
  work: [
    "Need you for something important",
    "Quick check-in needed",
    "Meeting moved up, please come now",
  ],
};


const TIMER_STORAGE_KEY = "hg-exit-timer";

function persistTimer(endTime: number | null): void {
  if (typeof window === "undefined") return;
  if (endTime) {
    localStorage.setItem(TIMER_STORAGE_KEY, String(endTime));
  } else {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  }
}

function loadPersistedTimer(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TIMER_STORAGE_KEY);
  if (!raw) return null;
  const endTime = Number(raw);
  if (isNaN(endTime)) return null;
  return endTime;
}

const initialState = {
  isOpen: false,
  step: "idle" as ExitStep,
  selectedCategory: null as ExitCategory | null,
  contactName: "",
  message: "",
  avatarType: "initials" as AvatarType,
  presetContact: null as PresetContact | null,
  aiPerson: "",
  aiContext: "",
  aiTone: "polite" as Tone,
  generatedMessage: "",
  generatedExcuse: "",
  aiLoading: false,
  timerMinutes: 3,
  timerActive: false,
  timerEndTime: null as number | null,
  alertVisible: false,
};


export const useExitAssistant = create<ExitAssistantState>()((set, get) => ({
  ...initialState,

  ...(loadPersistedTimer()
    ? {
        timerActive: true,
        timerEndTime: loadPersistedTimer(),
      }
    : {}),

  open: () => set({ isOpen: true, step: "category" }),

  close: () => {
    const { timerActive, timerEndTime } = get();
    if (timerActive && timerEndTime) {
      set({ isOpen: false, step: "idle" });
    } else {
      get().reset();
    }
  },

  setStep: (step) => set({ step }),

  selectCategory: (category) => {
    const defaults = CATEGORY_DEFAULTS[category];
    const preset = defaults.preset;
    const presetData =
      preset !== "Custom" ? CONTACT_PRESETS[preset] : undefined;

    set({
      selectedCategory: category,
      presetContact: preset,
      contactName: presetData?.name || "",
      message: defaults.message,
      step: "customize",
    });
  },

  setContactName: (name) => set({ contactName: name }),
  setMessage: (message) => set({ message }),
  setAvatarType: (type) => set({ avatarType: type }),

  selectPreset: (preset) => {
    if (preset === "Custom") {
      set({
        presetContact: "Custom",
        contactName: "",
        message: "",
      });
      return;
    }
    const data = CONTACT_PRESETS[preset];
    set({
      presetContact: preset,
      contactName: data.name,
      aiPerson: data.name, 
      message: data.defaultMessages[0],
      aiTone: data.toneHint,
    });
  },

  setAiPerson: (person) => set({ aiPerson: person }),
  setAiContext: (context) => set({ aiContext: context }),
  setAiTone: (tone) => set({ aiTone: tone }),
  setGeneratedMessage: (msg) => set({ generatedMessage: msg }),
  setGeneratedExcuse: (excuse) => set({ generatedExcuse: excuse }),
  setAiLoading: (loading) => set({ aiLoading: loading }),

  setTimerMinutes: (minutes) => set({ timerMinutes: minutes }),

  startTimer: () => {
    const { timerMinutes } = get();
    const endTime = Date.now() + timerMinutes * 60 * 1000;
    persistTimer(endTime);
    set({
      timerActive: true,
      timerEndTime: endTime,
      step: "timer",
    });
  },

  cancelTimer: () => {
    persistTimer(null);
    set({
      timerActive: false,
      timerEndTime: null,
    });
  },

  triggerAlert: () => {
    const { contactName, message } = get();
    persistTimer(null);
    showLocalNotification(contactName || "Alert", message || "New message received");
    set({
      timerActive: false,
      timerEndTime: null,
      alertVisible: true,
      step: "alert",
    });
  },

  triggerQuickExit: (prefs: { contactName: string; message: string }) => {
    persistTimer(null);
    showLocalNotification(prefs.contactName, prefs.message);
    set({
      timerActive: false,
      timerEndTime: null,
      contactName: prefs.contactName,
      message: prefs.message,
      alertVisible: true,
      step: "alert",
    });
  },

  dismissAlert: () => {
    get().reset();
  },

  reset: () => {
    persistTimer(null);
    set({ ...initialState });
  },
}));
