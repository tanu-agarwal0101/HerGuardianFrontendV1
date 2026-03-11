//import RegistrationForm from "../../../components/auth/RegistrationForm";
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

// import { Metadata } from "next";
import { CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Auth, Users } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const [showStealthDialog, setShowStealthDialog] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [rememberWarning, setRememberWarning] = useState("");
  const setUser = useUserStore((s) => s.setUser);

  // If already logged in with rememberMe, skip auth page
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookies = document.cookie;
    const hasSession = /(?:^|; )(accessToken|refreshToken)=/.test(cookies);
    if (hasSession) router.replace("/dashboard");
  }, [router]);
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      // Call login API
      const response = await Auth.login({ ...data, rememberMe });
      // Hydrate user in store (prefer response.user, else fetch profile)
      if (response?.data?.user) {
        setUser(response.data.user);
      } else {
        try {
          const profile = await Users.getProfile();
          setUser(profile as unknown as import("@/helpers/type").User);
        } catch {}
      }
      // STEALTH ONBOARDING: TEMPORARILY DISABLED (feature paused)
      // Preserved for when stealth is re-enabled. Remove `false &&` to restore.
      if (
        false &&
        response.data.user &&
        !response.data.user.stealthMode &&
        !response.data.user.stealthOnboardingSkipped
      ) {
        if (!rememberMe) {
          setRememberWarning(
            "Stealth mode requires 'Remember Me' to be enabled. Please check the box to proceed."
          );
          setIsSubmitting(false);
          return;
        }
        setShowStealthDialog(true);
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const axiosErr = error as { response?: { status?: number, data?: { message?: string, isVerified?: boolean } } };
      
      const isUnverified = 
        axiosErr?.response?.status === 403 && 
        (axiosErr.response.data?.isVerified === false || axiosErr.response.data?.message?.toLowerCase().includes("verify"));

      // If user is unverified, push them to the OTP page instantly
      if (isUnverified) {
         router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
         return;
      }

      if (axiosErr?.response?.data?.message) {
         setRememberWarning(axiosErr.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnableStealth = () => {
    // Call API to enable stealth mode for user
    setShowStealthDialog(false);
    router.push("/stealth");
  };

  const handleSkipStealth = () => {
    // Call API to skip onboarding for user
    setShowStealthDialog(false);
    router.push("/dashboard");
  };

  return (
    <>
      <Dialog open={showStealthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Stealth Mode?</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            Stealth mode disguises the app for your safety. Would you like to
            enable it now?
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={handleEnableStealth}
              className="bg-purple-600 text-white"
            >
              Enable Stealth
            </Button>
            <Button onClick={handleSkipStealth} variant="outline">
              Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            href="/" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative">
            {/* Subtle card glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
            
            <CardHeader className="space-y-3 pb-6 px-6 sm:px-8 pt-8 sm:pt-10">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transform rotate-12">
                  <Shield className="w-6 h-6 text-primary -rotate-12" />
                </div>
              </div>
              <CardTitle>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground">
                  Welcome Back
                </h1>
                <h2 className="text-sm sm:text-base text-muted-foreground mt-2 text-center font-medium">
                  Log in to your safety command center
                </h2>
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="flex flex-col px-6 sm:px-8 pb-8 sm:pb-10 space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <span className="text-xs text-destructive font-medium">{errors.email.message}</span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                    type="password"
                    {...register("password")}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 pb-4">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-medium text-muted-foreground cursor-pointer">
                    Remember me <span className="text-xs opacity-70">(Required for Stealth Mode)</span>
                  </Label>
                </div>

                {rememberWarning && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg text-sm font-medium mb-4 text-center">
                    {rememberWarning}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
                </Button>
                <div className="flex items-center gap-4 my-2">
                  <Separator className="flex-1 bg-border/40" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OR</span>
                  <Separator className="flex-1 bg-border/40" />
                </div>

                <div className="pt-4 text-center">
                  <span className="text-sm font-medium text-muted-foreground mr-1">
                    New to HerGuardian?
                  </span>
                  <Link
                    href="/registration"
                    className="text-sm font-semibold text-primary hover:underline transition-all"
                  >
                    Create a free account
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
