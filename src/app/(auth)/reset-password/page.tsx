"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Suspense } from "react";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ResetPasswordInner() {
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" }
  });

  if (!token) {
    return (
        <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-destructive opacity-50" />
            <CardHeader className="text-center space-y-4 pt-8">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Invalid Link</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground">
                    No reset token found. Please request a new password reset link.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/forgot-password" className="block mt-4">
                    <Button className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                        Go to Forgot Password
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
  }

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      await Auth.resetPassword(token, data.newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to reset password. The link may be invalid or expired.");
    }
  };

  return (
      <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative">
        {/* Subtle card glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
        
        <CardHeader className="space-y-3 pb-6 px-6 sm:px-8 pt-8 sm:pt-10">
            {!success ? (
                <>
                    <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transform rotate-12">
                            <Shield className="w-6 h-6 text-primary -rotate-12" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground">Create New Password</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-2 text-center font-medium">
                        Enter your new password below to regain access to your account.
                    </CardDescription>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground text-center">Password Reset Complete</CardTitle>
                </div>
            )}
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10">
            {!success ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="At least 8 characters"
                            className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="text-xs text-destructive font-medium">{errors.newPassword.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl mt-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</span>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <p className="text-sm font-medium text-muted-foreground">
                        Your password has been successfully reset. You can now use your new password to log in.
                    </p>
                    <Link href="/login" className="block pt-2">
                        <Button className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                            Login Now
                        </Button>
                    </Link>
                </div>
            )}
        </CardContent>
      </Card>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordInner />
        </Suspense>
      </div>
    </div>
  );
}
