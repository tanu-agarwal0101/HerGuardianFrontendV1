"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function VerifyOtpInner() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  // Timer for Resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP Submission
  const handleVerify = async (code = otp) => {
    if (code.length !== 6 || !email) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await Auth.verifyEmail(email, code);
      setStatus("success");
      toast.success("Registration successful! Redirecting to onboarding...");
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }

      setTimeout(() => {
        router.push("/onboarding");
      }, 1000);

    } catch (err: unknown) {
      setStatus("error");
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || "Invalid verification code.";
      setErrorMessage(msg);
      // Removed duplicate toast.error(msg) as per user request (inline error is sufficient)
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await Auth.resendVerification(email);
      toast.success("Verification code resent! Please check your inbox.");
      setCountdown(60); // Reset timer
    } catch {
      // Handled by global interceptor
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!email) {
    return (
      <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative">
        <CardContent className="pt-6 text-center text-destructive font-medium">
          No email provided. Please go back to the login page.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
      
      <CardHeader className="space-y-3 pb-6 px-6 sm:px-8 pt-8 sm:pt-10">
        <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transform rotate-12">
                <Shield className="w-6 h-6 text-primary -rotate-12" />
            </div>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground">
          Verify Your Email
        </CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 text-center font-medium">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center px-6 sm:px-8 pb-8 sm:pb-10 space-y-6">
        
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={status === "loading" || status === "success"}
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                    key={index}
                    index={index} 
                    className="w-12 h-14 sm:w-14 sm:h-16 text-xl sm:text-2xl border-white/10 dark:border-white/5 bg-background/50 focus-visible:ring-primary rounded-lg transition-all" 
                />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {errorMessage && (
          <p className="text-sm text-destructive font-medium">{errorMessage}</p>
        )}

        <Button 
          className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl mt-4"
          disabled={otp.length !== 6 || status === "loading" || status === "success"}
          onClick={() => handleVerify(otp)}
        >
          {status === "loading" ? <span className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Verifying...</span> : "Verify Code"}
        </Button>

        <div className="text-center mt-2 w-full pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-3 font-medium">Didn&apos;t receive a code?</p>
          <Button
            variant="outline"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
            className="w-full h-10 border-white/10 bg-background/30 hover:bg-background/50 transition-colors"
          >
            {isResending ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : countdown > 0 ? (
              `Resend code in ${countdown}s`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="flex flex-col min-h-screen relative z-10 p-4 sm:p-6 md:p-8">
      
      {/* Sleek transparent header */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-8 sm:mb-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">HerGuardian</span>
        </Link>
        <Link 
          href="/login" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          ← Back to Login
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <Suspense fallback={<Loader2 className="animate-spin text-primary w-8 h-8" />}>
          <VerifyOtpInner />
        </Suspense>
      </div>
    </div>
  );
}
