"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

function VerifyEmailInner() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await Auth.verifyEmail(token);
        setStatus("success");
        setMessage("Email verified! Redirecting you to onboarding...");
        
        // Auto-login: Hydrate the user from the backend response
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }

        // Redirect directly to onboarding after a short delay
        setTimeout(() => {
          router.push("/onboarding");
        }, 1500);

      } catch (err: unknown) {
        setStatus("error");
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setMessage(axiosErr.response?.data?.message || "Failed to verify email. The link may be invalid or expired.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="max-w-md w-full mx-4 shadow-lg border-2 border-purple-100">
      <CardHeader className="text-center space-y-4 pt-8">
        <div className="flex justify-center">
          {status === "loading" && <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-8 space-y-6">
        <p className="text-gray-600 text-lg">
          {message}
        </p>
        
        <div className="pt-4 flex flex-col gap-3">
            {status === "success" && (
                <Button disabled className="w-full bg-purple-600/50 text-white rounded-full py-6 text-lg">
                    Redirecting...
                </Button>
            )}
            
            {status === "error" && (
                <div className="space-y-3 w-full">
                    <Link href="/login" className="w-full block">
                      <Button className="w-full" variant="outline">
                          Go to Login
                      </Button>
                    </Link>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4 p-4 text-purple-700 font-bold text-xl">
        HerGuardian
      </div>
      <Suspense fallback={<Loader2 className="animate-spin text-purple-600" />}>
        <VerifyEmailInner />
      </Suspense>
    </div>
  );
}
