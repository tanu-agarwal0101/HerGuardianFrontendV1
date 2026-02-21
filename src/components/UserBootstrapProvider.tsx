"use client";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { Users } from "@/lib/api";

function hasSessionCookie() {
  if (typeof document === "undefined") return false;
  const c = document.cookie;
  return /(?:^|; )(accessToken|refreshToken)=/.test(c);
}

export const UserBootstrapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (user) return;
    if (!hasSessionCookie()) return;
    fetchedRef.current = true;
    Users.getProfile()
      .then((u) => setUser(u as unknown as import("@/helpers/type").User))
      .catch(() => {
        fetchedRef.current = false; // allow retry later
      });
  }, [user, setUser]);

  return <>{children}</>;
};
