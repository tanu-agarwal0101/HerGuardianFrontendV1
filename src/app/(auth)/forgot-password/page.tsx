"use client";

import { useState } from "react";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-0 left-0 w-full p-4 bg-purple-500 text-white flex justify-between items-center shadow-md">
        <div className="font-bold text-lg">HerGuardian</div>
        <Link href="/login" className="flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-purple-600 mt-16">
        <CardHeader className="text-center space-y-2">
            {!success ? (
                <>
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription className="text-sm">
                        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                    <MailCheck className="h-16 w-16 text-green-500" />
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                </div>
            )}
        </CardHeader>
        <CardContent>
            {!success ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="py-6"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 py-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link...</>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <p className="text-gray-600">
                        We have sent password reset instructions to your email address. Please check your inbox and spam folder.
                    </p>
                    <Link href="/login" className="block">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6" variant="default">
                            Return to Login
                        </Button>
                    </Link>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
