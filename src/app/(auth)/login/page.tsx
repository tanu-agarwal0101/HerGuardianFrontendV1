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
import { ArrowLeft, Globe } from "lucide-react";
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
      console.error("Login failed", error);
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
      <div>
        <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
          <div>HerGuardian</div>
          <Link href="/" className="flex">
            <ArrowLeft />
            <span>Back To Home</span>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-2 py-12 px-4">
          <Card className="lg:w-2xl md:w-xl px-6 w-auto">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-extrabold text-purple-800 text-center my-4">
                  Login to HerGuardian
                </h1>
                <h2 className="text-gray-500 mt-2 text-center">
                  Welcome Back! <br />
                  Your safety companion is just a login away.
                </h2>
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="flex flex-col items-center justify-center py-4 w-full">
                <div className="p-4 flex gap-2 justify-left items-center w-full ">
                  <Label htmlFor="email" className="w-1/4">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    className="w-3/4"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <span className="text-red-500">{errors.email.message}</span>
                  ) : null}
                </div>
                <div className="p-4 flex gap-2 justify-left items-center w-full ">
                  <Label htmlFor="password" className="w-1/4">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    className="w-3/4"
                    type="password"
                    {...register("password")}
                  />
                </div>
                <div className="w-full flex justify-end px-4 mt-1 mb-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="flex items-center gap-2 my-2 w-full">
                  <input
                    title="Remember Me (required for Stealth Mode)"
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember Me (required for Stealth Mode)
                  </Label>
                </div>
                {rememberWarning && (
                  <div className="bg-yellow-200 text-yellow-800 p-2 rounded mb-2 max-w-md text-center">
                    {rememberWarning}
                  </div>
                )}
                <Button
                  type="submit"
                  className="bg-purple-500 lg:w-md md:w-md lg:px-0 md:px-0 text-white px-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="flex items-center gap-4 my-6 lg:w-md w-sm">
                  <Separator className="flex-1" />
                  <span className="text-sm">OR</span>
                  <Separator className="flex-1" />
                </div>
                <Button
                  className="bg-white my-2 text-black lg:w-md border border-black hover:bg-gray-200"
                  type="button"
                >
                  <Globe />
                  Login with Google
                </Button>
                <div className="flex flex-col gap-2 w-full items-center">
                  <span className="text-gray-500 text-sm">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href="/registration"
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Register here
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
