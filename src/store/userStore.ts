// stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/helpers/type"; // adjust this path if needed

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (fields: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateUser: (fields) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...fields } });
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          useUserStore.persist?.clearStorage();
        }
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // key used in localStorage
    //   skipHydration: true, // helps prevent hydration mismatch in Next.js
    }
  )
);
