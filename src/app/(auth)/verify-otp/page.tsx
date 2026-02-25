"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
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
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to resend code.");
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
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center text-red-500">
          No email provided. Please go back to the login page.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-4 shadow-lg border-2 border-purple-100">
      <CardHeader className="text-center space-y-2 pt-8">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Verify Your Email
        </CardTitle>
        <p className="text-gray-500 text-sm">
          We sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8 space-y-6">
        
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={status === "loading" || status === "success"}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} className="w-12 h-14 text-xl border-purple-200" />
            <InputOTPSlot index={1} className="w-12 h-14 text-xl border-purple-200" />
            <InputOTPSlot index={2} className="w-12 h-14 text-xl border-purple-200" />
            <InputOTPSlot index={3} className="w-12 h-14 text-xl border-purple-200" />
            <InputOTPSlot index={4} className="w-12 h-14 text-xl border-purple-200" />
            <InputOTPSlot index={5} className="w-12 h-14 text-xl border-purple-200" />
          </InputOTPGroup>
        </InputOTP>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg mt-4"
          disabled={otp.length !== 6 || status === "loading" || status === "success"}
          onClick={() => handleVerify(otp)}
        >
          {status === "loading" ? <Loader2 className="animate-spin mr-2" /> : "Verify Code"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive a code?</p>
          <Button
            variant="outline"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4 p-4 text-purple-700 font-bold text-xl">
        HerGuardian
      </div>
      <Suspense fallback={<Loader2 className="animate-spin text-purple-600" />}>
        <VerifyOtpInner />
      </Suspense>
    </div>
  );
}
