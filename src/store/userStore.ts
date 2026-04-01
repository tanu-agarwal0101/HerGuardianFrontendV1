// stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/helpers/type"; // adjust this path if needed

interface StealthPrefs {
  stealthMode: boolean;
  stealthType: string | null;
  dashboardPass: string | null;
  sosPass: string | null;
}

interface VoiceSOSPrefs {
  enabled: boolean;
  triggerPhrase: string;
  hasOnboardedVoice: boolean;   // user has seen the privacy gate
  isPermissionGranted: boolean; // mic permission confirmed
  sessionExpiry: number | null; // epoch ms — null means always-on
}

interface UserState {
  user: User | null;
  stealth: StealthPrefs;
  voiceSOS: VoiceSOSPrefs;
  loadingUser: boolean;
  authError: string | null;
  loadingStealth: boolean;
  setUser: (user: User) => void;
  updateUser: (fields: Partial<User>) => void;
  setStealth: (data: Partial<StealthPrefs>) => void;
  setVoiceSOS: (data: Partial<VoiceSOSPrefs>) => void;
  enableVoiceSOS: () => void;
  disableVoiceSOS: () => void;
  onboardVoice: () => void;
  setSessionExpiry: (durationMs: number | null) => void;
  loadStealth: () => Promise<void>;
  saveStealth: (data: Partial<StealthPrefs>) => Promise<void>;
  saveVoiceSOS: (data: { triggerPhrase: string; enabled?: boolean }) => Promise<void>;
  hydrateUser: () => Promise<void>;
  logout: () => void;
  _hasHydrated: boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      stealth: {
        stealthMode: false,
        stealthType: null,
        dashboardPass: null,
        sosPass: null,
      },
      voiceSOS: {
        enabled: false,
        triggerPhrase: "Activate Emergency",
        hasOnboardedVoice: false,
        isPermissionGranted: false,
        sessionExpiry: null,
      },
      loadingUser: false,
      authError: null,
      loadingStealth: false,
      _hasHydrated: false,

      setUser: (user) => {

          const stealthUpdates = {
              stealthMode: user.stealthMode ?? false,
              stealthType: user.stealthType ?? null,
              dashboardPass: user.dashboardPass ?? null,
              sosPass: user.sosPass ?? null,
          };
          const voiceSOSUpdates = {
              triggerPhrase: user.voiceTriggerPhrase || "Activate Emergency",
          };
          set({ 
              user, 
              stealth: { ...get().stealth, ...stealthUpdates },
              voiceSOS: { ...get().voiceSOS, ...voiceSOSUpdates }
          });
      },

      updateUser: (fields) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...fields } });
        }
      },

      setStealth: (data) => {
        set({ stealth: { ...get().stealth, ...data } });
      },

      setVoiceSOS: (data) => {
        set({ voiceSOS: { ...get().voiceSOS, ...data } });
      },

      enableVoiceSOS: () => {
        set({ voiceSOS: { ...get().voiceSOS, enabled: true } });
      },

      disableVoiceSOS: () => {
        set({ voiceSOS: { ...get().voiceSOS, enabled: false, sessionExpiry: null } });
      },

      onboardVoice: () => {
        set({ voiceSOS: { ...get().voiceSOS, hasOnboardedVoice: true, isPermissionGranted: true } });
      },

      setSessionExpiry: (durationMs) => {
        const expiry = durationMs !== null ? Date.now() + durationMs : null;
        set({ voiceSOS: { ...get().voiceSOS, sessionExpiry: expiry } });
      },

      loadStealth: async () => {
        try {
          set({ loadingStealth: true });
          const { Stealth } = await import("@/lib/api");
          const settings = await Stealth.getSettings();
          set({
            stealth: { ...get().stealth, ...settings },
            loadingStealth: false,
          });
        } catch {
          set({ loadingStealth: false });
        }
      },

      saveStealth: async (data) => {
        const { Stealth } = await import("@/lib/api");
        await Stealth.updateSettings(data);
        set({ stealth: { ...get().stealth, ...data } });
      },

      saveVoiceSOS: async (data) => {
        const { Users } = await import("@/lib/api");
        if (data.triggerPhrase) {
           await Users.updateVoiceTrigger({ voiceTriggerPhrase: data.triggerPhrase });
        }
        set({ voiceSOS: { ...get().voiceSOS, ...data } });
      },

      hydrateUser: async () => {
        if (typeof window === "undefined") return;
        
        
        const hasAuthCookie = typeof document !== "undefined" && /(?:^|; )isAuthenticated=true/.test(document.cookie);
        
        if (!hasAuthCookie) {
          
          if (get().user) {
            get().logout();
          }
          return;
        }

        
        if (get().loadingUser) return;
        
        try {
          set({ loadingUser: true, authError: null });
          const { Users } = await import("@/lib/api");
          const profile = await Users.getProfile();
          
          
          const stealthUpdates = {
              stealthMode: profile.stealthMode ?? false,
              stealthType: profile.stealthType ?? null,
              dashboardPass: profile.dashboardPass ?? null,
              sosPass: profile.sosPass ?? null
          };
          
          const voiceSOSUpdates = {
              triggerPhrase: profile.voiceTriggerPhrase || "Activate Emergency",
          };

          set({ 
              user: profile as unknown as User,
              stealth: { ...get().stealth, ...stealthUpdates },
              voiceSOS: { ...get().voiceSOS, ...voiceSOSUpdates },
              authError: null 
          });
        } catch (e) {
          try {
            const err = e as { response?: { status?: number, data?: { message?: string } }, message?: string };
            const status = err?.response?.status;
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to hydrate user";
            if (status === 503) {
              set({ authError: "Server unavailable. Please try again later." });
            } else if (status === 500) {
              set({ authError: msg });
            } else if (status === 401 || status === 403) {
              get().logout();
              set({ authError: null }); 
            } else {
              set({ authError: String(msg) });
            }
          } catch {
            set({ authError: "Failed to hydrate user" });
          }
        } finally {
          set({ loadingUser: false });
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          useUserStore.persist?.clearStorage();
          try {
            const bc = new BroadcastChannel("auth");
            bc.postMessage({ type: "logout" });
            bc.close();
          } catch {
            
          }
        }
        set({
          user: null,
          stealth: {
            stealthMode: false,
            stealthType: null,
            dashboardPass: null,
            sosPass: null,
          },
          voiceSOS: {
            enabled: false,
            triggerPhrase: "Activate Emergency",
            hasOnboardedVoice: false,
            isPermissionGranted: false,
            sessionExpiry: null,
          },
          loadingUser: false,
        });
      },
    }),
    {
      name: "user-storage", 
      partialize: (state) => ({
        user: state.user,
        stealth: state.stealth,
        voiceSOS: state.voiceSOS,
      }),
      
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loadingUser = false;
          state.loadingStealth = false;
          state.authError = null;
          state._hasHydrated = true;
        } else {
            useUserStore.setState({ _hasHydrated: true });
        }
      },
    }
  )
);
