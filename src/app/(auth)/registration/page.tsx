//import RegistrationForm from "../../../components/auth/RegistrationForm";
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
// import { Metadata } from "next";
import { CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Shield } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Auth } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
// No local rememberMe state; using RHF directly.
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
// export const metadata: Metadata = {
//   title: "Registration",
// };

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(4, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(4, { message: "Password must be at least 8 characters long" }),
    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

// Old implementation commented out for reference; cleaned styling below.

export default function RegistrationForm() {
  const router = useRouter();
  // If already logged in, attempt to hydrate user from httpOnly cookies and skip auth page
  const loadingUser = useUserStore((s) => s.loadingUser);
  const user = useUserStore((s) => s.user);
  useEffect(() => {
    // trigger hydration once
    useUserStore.getState().hydrateUser?.();
  }, []);
  useEffect(() => {
    if (loadingUser) return;
    if (user) router.replace("/dashboard");
  }, [loadingUser, user, router]);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: true,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterValues) => {
    // FIX: Manually set loading to true (RHF isSubmitting sometimes hangs if unmounted)
    useUserStore.setState({ loadingUser: true });
    try {
      const res = await Auth.register({
        // firstName: "", // not collected yet
        // lastName: "", // not collected yet
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      if (res.status === 201) {
        toast.success("Verify Email");
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      const status = err?.response?.status;
      if (status === 409) {
        toast.error(
          "An account with this email already exists. Try logging in instead."
        );
      }
    } finally {
      // FIX: Never leave the button spinning indefinitely
      useUserStore.setState({ loadingUser: false });
    }
  };
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
                Join HerGuardian
              </h1>
              <h2 className="text-sm sm:text-base text-muted-foreground mt-2 text-center font-medium">
                Create your account to start your journey toward enhanced personal safety.
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
                {errors.email && (
                  <span className="text-xs text-destructive font-medium">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-xs text-destructive font-medium">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-destructive font-medium">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 pb-4">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                  {...register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-muted-foreground cursor-pointer">
                  Remember me <span className="text-xs opacity-70">(Required for Stealth Mode)</span>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Creating Account...</span>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="flex items-center gap-4 my-2">
                <Separator className="flex-1 bg-border/40" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OR</span>
                <Separator className="flex-1 bg-border/40" />
              </div>

              <div className="pt-4 text-center">
                <span className="text-sm font-medium text-muted-foreground mr-1">
                  Already have an account?
                </span>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-primary hover:underline transition-all"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
