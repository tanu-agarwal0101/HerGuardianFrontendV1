"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

export default function DebugAuthState() {
  const [visible, setVisible] = useState(false);
  const loadingUser = useUserStore((s) => s.loadingUser);
  const user = useUserStore((s) => s.user);
  const authError = (useUserStore as any)((s: any) => s.authError);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("debug") === "1") setVisible(true);
    } catch (_) {}
  }, []);

  if (!visible) return null;

  return (
    <div className="hg-debug-auth-overlay">
      <div className="hg-debug-auth-box">
        <div className="hg-debug-auth-title">Auth Debug</div>
        <div>
          <strong>loadingUser:</strong> {String(loadingUser)}
        </div>
        <div>
          <strong>authError:</strong> {String(authError)}
        </div>
        <div className="hg-debug-auth-user-label">
          <strong>user:</strong>
        </div>
        <pre className="hg-debug-auth-pre">
          {user ? JSON.stringify(user, null, 2) : "null"}
        </pre>
      </div>
    </div>
  );
}
