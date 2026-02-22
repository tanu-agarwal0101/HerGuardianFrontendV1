"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Auth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
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
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-red-500 mt-16">
            <CardHeader className="text-center space-y-4 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-800">Invalid Link</CardTitle>
                <CardDescription>
                    No reset token found. Please request a new password reset link.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/forgot-password" className="block mt-4">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6">
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
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-purple-600 mt-16">
        <CardHeader className="text-center space-y-2">
            {!success ? (
                <>
                    <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your new password below to regain access to your account.
                    </CardDescription>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <CardTitle className="text-2xl font-bold">Password Reset Complete</CardTitle>
                </div>
            )}
        </CardHeader>
        <CardContent>
            {!success ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="At least 8 characters"
                            className="py-6"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            className="py-6"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 py-6 mt-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <p className="text-gray-600">
                        Your password has been successfully reset. You can now use your new password to log in.
                    </p>
                    <Link href="/login" className="block">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6" variant="default">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-0 left-0 w-full p-4 bg-purple-500 text-white flex justify-between items-center shadow-md">
        <div className="font-bold text-lg">HerGuardian</div>
      </div>
      <Suspense fallback={<Loader2 className="animate-spin text-purple-600 h-12 w-12" />}>
        <ResetPasswordInner />
      </Suspense>
    </div>
  );
}
