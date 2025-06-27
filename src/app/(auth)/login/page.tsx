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
import { useUserStore } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowBigRight, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "node:module";
import { useForm } from "react-hook-form";
import * as z from "zod";

// export const metadata: Metadata = {
//   title: "Registration",
// };

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const {register, handleSubmit, formState: {
    errors, isSubmitting
  }} = form;

  const onSubmit = async (data: LoginValues) => {
    console.log("Form data:", data);
    try {
      const res = await axios.post("http://localhost:5001/users/login", {
        email: data.email,
        password: data.password,
      },
      { withCredentials: true });
      console.log("Response:", res);
      useUserStore.getState().setUser(res.data.user);
      // setUser(res.data.user);
      if (res.status === 200) {
        console.log("Login successful");
        // Redirect to dashboard or show success message
        router.push("/dashboard");
      };
    } catch (error) {
      console.error("Login error:", error);
      // Handle error (e.g., show a notification)

    }
  }


  return (
    <div className="">
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
        <div>HerGuardian</div>
        <Link href="/" className="flex">
          <ArrowLeft />
          <span>Back To Home</span>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-2 py-24 px-4">
        <Card className="lg:w-2xl md:w-xl px-6 w-md">
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
              <Label htmlFor="email" className="w-1/4">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                className="w-3/4"
                type="email"
                {...register("email")}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div className="p-4 flex gap-2 justify-left items-center w-full ">
              <Label htmlFor="password" className="w-1/4">Password</Label>
              <Input
                id="password"
                placeholder="Enter your password"
                className="w-3/4"
                type="password"
                {...register("password")}
              />
            </div>
              <Button
                type="submit"
                className="bg-purple-500 lg:w-md md:w-md lg:px-0 md:px-0 text-white px-12 mt-4"
              >
                {isSubmitting ? "Logging in..." : "Login" }
              </Button>
            
            <div className="flex items-center gap-4 my-6 lg:w-md w-sm">
      <Separator className="flex-1" />
      <span className="text-sm">OR</span>
      <Separator className="flex-1" />
    </div>
              <Button className="bg-white text-black lg:w-md md:w-md  border border-black hover:bg-gray-200">
                <Globe />
                Sign In with Google
              </Button>
          </CardContent>
        </form>
        
      </Card>
      <div className="mt-4">
        <div>Don&apos;t have an account? &nbsp; 
          <Link href="/registration" className="text-blue-500 font-semibold">
          Register</Link>
      </div>
      <div>Forgot Password? 
        &nbsp; 
          <Link href="/auth/reset-password" className="text-blue-500 font-semibold">
          Reset here</Link></div>
      </div>
      </div>
    </div>
  );
}
