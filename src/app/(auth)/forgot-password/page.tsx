"use client";

import { useState } from "react";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck, Shield } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await Auth.forgotPassword(data.email);
      setSuccess(true);
      toast.success("Reset link sent!");
    } catch {
      // Error handled by global interceptor
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
          href="/login" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          ← Back to Login
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full">
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
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-2 text-center font-medium">
                        Enter the email associated with your account, and we&apos;ll send a reset link.
                    </CardDescription>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                        <MailCheck className="h-8 w-8 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground text-center">Check your email</CardTitle>
                </div>
            )}
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10">
            {!success ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="w-full bg-background/50 border-white/10 dark:border-white/5 focus-visible:ring-primary h-11 transition-all"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending link...</span>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <p className="text-sm font-medium text-muted-foreground">
                        We have sent password reset instructions to your email address. Please check your inbox and spam folder.
                    </p>
                    <Link href="/login" className="block pt-2">
                        <Button className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                            Return to Login
                        </Button>
                    </Link>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
