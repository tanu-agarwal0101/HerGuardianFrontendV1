"use client";
import React, { useEffect, useState } from "react";
import { usePassiveRefresh } from "@/lib/usePassiveRefresh";
import { useUserStore } from "@/store/userStore";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export const SessionRefresherProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    setRemember(readCookie("rememberMe") === "true");
    const interval = setInterval(() => {
      // poll occasionally in case cookie flips after login
      setRemember(readCookie("rememberMe") === "true");
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  usePassiveRefresh(!!user && remember);
  return <>{children}</>;
};
