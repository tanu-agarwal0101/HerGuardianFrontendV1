import { useState, useEffect, useCallback } from "react";
import { getProfile } from "@/lib/api/users";

export function useGuardianStatus(pollingInterval = 60000) {
  const [status, setStatus] = useState<{
    activeCount: number;
    pendingCount: number;
    anyActiveRecently: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const user = await getProfile();
      if (user.guardianStatus) {
        setStatus(user.guardianStatus);
      }
    } catch (error) {
      console.error("Failed to fetch guardian status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    
    const interval = setInterval(fetchStatus, pollingInterval);
    
    return () => clearInterval(interval);
  }, [fetchStatus, pollingInterval]);

  return { 
    status, 
    loading, 
    refetch: fetchStatus,
    activeGuardianCount: status?.activeCount ?? 0,
    pendingGuardianCount: status?.pendingCount ?? 0,
    anyActiveRecently: status?.anyActiveRecently ?? false
  };
}
