"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { checkInviteToken, acceptInvite, rejectInvite } from "@/lib/api/guardian";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/userStore";

function AcceptGuardianInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviter, setInviter] = useState<{ firstName: string; lastName: string } | null>(null);
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | "error">("pending");

  const user = useUserStore((s) => s.user);
  const loadingUser = useUserStore((s) => s.loadingUser);

  useEffect(() => {
    if (!token) {
      setError("No invitation token found in the URL.");
      setStatus("error");
      setIsLoading(false);
      return;
    }

    const checkToken = async () => {
      try {
        const data = await checkInviteToken(token);
        setInviter(data.inviter);
      } catch (err: unknown) {
          const typedErr = err as { response?: { data?: { message?: string } } };
          setError(typedErr.response?.data?.message || "Invalid or expired invitation link.");
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [token]);

  useEffect(() => {
    if (status === "accepted") {
      const timer = setTimeout(() => {
        router.push("/dashboard/guardian");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const handleAccept = useCallback(async () => {
    if (!token) return;
    setIsProcessing(true);
    try {
      await acceptInvite(token);
      setStatus("accepted");
      toast.success("You are now a guardian!");
    } catch (err: unknown) {
      const typedErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (typedErr.response?.status === 401) {
        toast.info("Registering your account to join the safety network...", {
            description: "You will be brought back here automatically after sign up."
        });
        sessionStorage.setItem("pendingInviteAcceptToken", token);
        sessionStorage.setItem("postAuthRedirect", window.location.href);
        router.push("/registration");
      } else {
        toast.error(typedErr.response?.data?.message || "Failed to accept invitation.");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [token, router]);

  const handleReject = useCallback(async () => {
    if (!token) return;
    setIsProcessing(true);
    try {
      await rejectInvite(token);
      setStatus("rejected");
      toast.info("Invitation declined.");
    } catch {
      toast.error("Failed to decline invitation.");
    } finally {
      setIsProcessing(false);
    }
  }, [token]);

  useEffect(() => {
    if (loadingUser) return;
    if (!user || !token) return;
    
    const pendingToken = sessionStorage.getItem("pendingInviteAcceptToken");
    if (pendingToken === token && status === "pending") {
      sessionStorage.removeItem("pendingInviteAcceptToken");
      sessionStorage.removeItem("postAuthRedirect");
      handleAccept();
    }
  }, [user, loadingUser, token, status, handleAccept]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Guardian Invitation</CardTitle>
          <CardDescription className="text-sm pt-2">
            You&apos;ve been asked to join a safety network.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center text-red-500 gap-2">
              <AlertCircle className="w-12 h-12" />
              <p className="font-medium">{error}</p>
            </div>
          ) : status === "accepted" ? (
            <div className="flex flex-col items-center text-emerald-500 gap-2">
              <CheckCircle className="w-12 h-12" />
              <p className="font-medium">Invitation Accepted!</p>
              <p className="text-sm text-foreground/70">Redirecting you to the dashboard...</p>
            </div>
          ) : status === "rejected" ? (
            <div className="flex flex-col items-center text-muted-foreground gap-2">
              <XCircle className="w-12 h-12" />
              <p className="font-medium">Invitation Declined</p>
            </div>
          ) : (
            <div className="bg-muted min-h-24 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Invited by</p>
              <p className="font-bold text-lg">{inviter?.firstName} {inviter?.lastName}</p>
            </div>
          )}
        </CardContent>
        {status === "pending" && !isLoading && !error && (
          <CardFooter className="flex gap-4 flex-col sm:flex-row pb-8 pt-4">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-12"
              onClick={handleReject}
              disabled={isProcessing}
            >
              Decline
            </Button>
            <Button
              className="w-full sm:flex-1 h-12 bg-primary hover:bg-primary/90"
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : "Accept as Guardian"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function AcceptGuardianInvitePage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <AcceptGuardianInviteContent />
        </Suspense>
    );
}
