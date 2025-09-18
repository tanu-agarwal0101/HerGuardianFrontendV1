//import RegistrationForm from "../../../components/auth/RegistrationForm";
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
// import { Metadata } from "next";
import { CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Globe, Loader } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Auth } from "@/lib/api";
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
      .min(4, { message: "Password must be at least 4 characters long" }),
    confirmPassword: z
      .string()
      .min(4, { message: "Password must be at least 4 characters long" }),
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

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterValues) => {
    try {
      const res = await Auth.register({
        // firstName: "", // not collected yet
        // lastName: "", // not collected yet
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      if (res.status === 201) {
        toast.success("Registration successful! Welcome to HerGuardian.");
        router.push("/onboarding");
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 409) {
        toast.error(
          "An account with this email already exists. Try logging in instead."
        );
      } else {
        console.error("Registration error:", error);
        toast.error("Registration failed. Please try again.");
      }
    }
  };
  return (
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
                Join HerGuardian
              </h1>
              <h2 className="text-gray-500 mt-2 text-center">
                Create your account to start your journey toward enhanced
                personal safety and peace of mind.
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

                
              </div>
              {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
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
              {errors.password && (
                <span className="text-red-500 text-sm capitalize">
                  {errors.password.message}
                </span>
              )}
              <div className="p-4 flex gap-2 justify-left items-center w-full ">
                <Label htmlFor="confirmPassword" className="w-1/4">
                  Confirm
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-3/4"
                  type="password"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm capitalize">
                  {errors.confirmPassword.message}
                </div>
              )}
              <div className="flex items-center gap-2 my-2 w-full">
                <input
                  title="Remember Me (required for Stealth Mode)"
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4"
                  {...register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember Me (required for Stealth Mode)
                </Label>
              </div>
              <Button
                type="submit"
                className="bg-purple-500 lg:w-md md:w-md lg:px-0 md:px-0 text-white px-12 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="text-white" /> : "Continue"}
              </Button>
              <div className="flex items-center gap-4 my-6 lg:w-md w-sm">
                <Separator className="flex-1" />
                <span className="text-sm">OR</span>
                <Separator className="flex-1" />
              </div>
              <Button
                className="bg-white text-black lg:w-md border border-black hover:bg-gray-200"
                type="button"
              >
                <Globe />
                Sign In with Google
              </Button>
              <div className="flex flex-col gap-2 w-full items-center mt-6">
                <span className="text-gray-500 text-sm">
                  Already have an account?
                </span>
                <Link
                  href="/login"
                  className="text-purple-600 hover:underline text-sm"
                >
                  Login
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
