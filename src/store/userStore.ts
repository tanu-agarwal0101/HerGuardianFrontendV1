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

interface UserState {
  user: User | null;
  stealth: StealthPrefs;
  loadingUser: boolean;
  authError: string | null;
  loadingStealth: boolean;
  setUser: (user: User) => void;
  updateUser: (fields: Partial<User>) => void;
  setStealth: (data: Partial<StealthPrefs>) => void;
  loadStealth: () => Promise<void>;
  saveStealth: (data: Partial<StealthPrefs>) => Promise<void>;
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
      loadingUser: false,
      authError: null,
      loadingStealth: false,
      _hasHydrated: false,

      setUser: (user) => {
          console.log("Store: setUser called with:", user);
          // Auto-sync stealth state when user is set (e.g. login)
          const stealthUpdates = {
              stealthMode: user.stealthMode ?? false,
              stealthType: user.stealthType ?? null,
              dashboardPass: user.dashboardPass ?? null,
              sosPass: user.sosPass ?? null,
          };
          console.log("Store: Syncing stealth state:", stealthUpdates);
          set({ 
              user, 
              stealth: { ...get().stealth, ...stealthUpdates } 
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

      hydrateUser: async () => {
        if (typeof window === "undefined") return;
        if (get().user || get().loadingUser) return;
        try {
          set({ loadingUser: true, authError: null });
          const { Users } = await import("@/lib/api");
          const profile = await Users.getProfile();
          console.log("Store: hydrateUser fetched profile:", profile);
          
          // Sync stealth state from profile
          const stealthUpdates = {
              stealthMode: profile.stealthMode ?? false,
              stealthType: profile.stealthType ?? null,
              dashboardPass: profile.dashboardPass ?? null,
              sosPass: profile.sosPass ?? null
          };

          set({ 
              user: profile as unknown as User,
              stealth: { ...get().stealth, ...stealthUpdates },
              authError: null 
          });
        } catch (e) {
          // Capture and expose error for UI
          try {
            const err = e as { response?: { status?: number, data?: { message?: string } }, message?: string };
            const status = err?.response?.status;
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to hydrate user";
            // If server unavailable, provide clear message
            if (status === 503) {
              set({ authError: "Server unavailable. Please try again later." });
            } else if (status === 500) {
              set({ authError: msg });
            } else if (status === 401 || status === 403) {
              set({ authError: "Session invalid. Please sign in again." });
            } else {
              set({ authError: String(msg) });
            }
            console.error("hydrateUser error:", e);
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
        }
        set({
          user: null,
          stealth: {
            stealthMode: false,
            stealthType: null,
            dashboardPass: null,
            sosPass: null,
          },
          loadingUser: false,
        });
      },
    }),
    {
      name: "user-storage", // key used in localStorage
      // only persist user and stealth, ignore loading states
      partialize: (state) => ({
        user: state.user,
        stealth: state.stealth,
      }),
      // ensure transient state is clean on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loadingUser = false;
          state.loadingStealth = false;
          state.authError = null;
          state._hasHydrated = true;
        } else {
            // If state is null (e.g. storage empty/error), we must still assume hydration "finished" (using defaults)
            useUserStore.setState({ _hasHydrated: true });
        }
      },
    }
  )
);
