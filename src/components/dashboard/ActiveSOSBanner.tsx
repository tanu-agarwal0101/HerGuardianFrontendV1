"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Search, Loader2 } from "lucide-react";
import { SOS } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function ActiveSOSBanner() {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const res = await SOS.getActiveSession();
      if (res.data?.active && res.data?.id) {
        toast.success("Active SOS session found. Redirecting...");
        router.push(`/dashboard/sos?sessionId=${res.data.id}`);
      } else {
        toast.info("No active SOS session found at this time.", {
           description: "If you just resolved it, it may take a moment to sync."
        });
      }
    } catch (err) {
      console.error("Manual SOS check failed:", err);
      toast.error("Unable to check SOS status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="mb-8">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden p-[1px] rounded-2xl bg-gradient-to-r from-red-900/40 via-gray-800 to-gray-800 shadow-2xl transition-all duration-300 group"
      >
        <div className="relative flex flex-col sm:flex-row items-center justify-between p-5 bg-black/60 backdrop-blur-xl rounded-[15px] z-10 gap-5 border border-white/5">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 group-hover:border-red-500/50 transition-all duration-500 shadow-inner">
                <Shield className="h-7 w-7 text-gray-400 group-hover:text-red-500 transition-colors duration-500" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-0 group-hover:opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 opacity-0 group-hover:opacity-100"></span>
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-lg tracking-tight">
                SOS TRACKING STATUS
              </h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                Check if your emergency tracking session is still active or needs resolution.
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckNow}
            disabled={isChecking}
            className="w-full sm:w-auto flex items-center justify-center gap-3 relative min-w-[140px] px-6 py-3.5 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed group/btn active:scale-95 border border-white/10"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5 group-hover/btn:scale-120 transition-transform" />
                <span>Check Status</span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent group-hover:via-red-400 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}
