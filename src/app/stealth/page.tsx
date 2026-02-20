"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/userStore";

export default function StealthPage() {
  const router = useRouter();
  const stealthType = useUserStore((s) => s.stealth.stealthType);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    const target = stealthType || user?.stealthType || "calculator";
    router.replace(`/stealth/${target}`);
  }, [router, stealthType, user]);
  return null;
}
