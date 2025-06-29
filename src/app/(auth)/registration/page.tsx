//import RegistrationForm from "../../../components/auth/RegistrationForm";
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useForm, useFormContext } from "react-hook-form";
// import { Metadata } from "next";
import { CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowBigRight, ArrowLeft, Globe, Loader } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

// export default function RegistrationPage() {
//   const [formData, setFormData] = useState<any>({});
//   const [step, setStep] = useState(0);
//   const router = useRouter();
//   const form = useForm<registerValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const nextStep = () => {
//     setStep(1);
//   };

//   const prevStep = () => {
//     setStep(0);
//   };

//   const handleSubmit = async (values: registerValues) => {
//     const modifiedValues = {
//       ...values,
//     };
//     setFormData((prev: any) => ({
//       ...prev,
//       ...modifiedValues,
//     }));

//     try {
//       console.log("Submitting registration data:", formData);
//       const res = await axios.post("http://localhost:5001/auth/register", formData);
//       if (res.status === 200) {
//         console.log("Registration successful");
//         // const userId = res.data.user.id;
//         router.push("/onboarding");

//       } else {
//         console.error("Registration failed:", res.data);
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       // Handle error (e.g., show a notification)
//     }

//   };

//   return (
//     <div className="">
//       <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
//         <div>HerGuardian</div>
//         <Link href="/" className="flex">
//           <ArrowLeft />
//           <span>Back To Home</span>
//         </Link>
//       </div>
//       <form onSubmit={form.handleSubmit(handleSubmit)}>
//         <Card className="m-24">
//           <CardHeader>
//             <CardTitle>
//               <h1 className="text-3xl font-extrabold text-purple-800 text-center">
//                 Join HerGuardian
//               </h1>
//               <h2 className="text-gray-500 mt-2">
//                 Create your account to start your journey toward enhanced
//                 personal safety and peace of mind.
//               </h2>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="p-4 flex gap-4 justify-left items-center">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 placeholder="Enter your email"
//                 className="ml-6"
//                 type="email"
//                 // value={form.watch("email")}
//               />
//             </div>
//             <div className="p-4 flex gap-4 justify-left items-center">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 placeholder="Enter your password"
//                 className=""
//                 type="password"
//                 // value={form.watch("password")}
//               />
//             </div>
//             <div className="p-4 flex gap-4 justify-left items-center">
//               <Label htmlFor="confirm-password">Confirm Password</Label>
//               <Input
//                 id="confirm-password"
//                 placeholder="Confirm your password"
//                 className=""
//                 type="password"
//                 // value={form.watch("confirmPassword")}
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={form.formState.isSubmitting}
//               className="bg-purple-500 w-full my-8  text-white "
//             >
//               {form.formState.isSubmitting ? (
//                 <Loader className="text-white" />
//               ) : (
//                 "Continue"
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       </form>
//     </div>
//   );
// }

export default function RegistrationForm() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterValues) => {
    console.log("Form data:", data);
    try {
      const res = await axios.post(
        "http://localhost:5001/users/register",
        {
          email: data.email,
          password: data.password,
          rememberMe: rememberMe,
        },
        { withCredentials: true }
      );
      console.log("Response:", res);
      if (res.status === 201) {
        console.log("Registration successful");
        // Redirect to onboarding page or show success message
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error (e.g., show a notification)
    }
  };
  return (
    <div className="">
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
        <div>HerGuardian</div>
        <Link href="/" className="flex">
          <ArrowLeft />
          <span>Back To Home</span>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-2 py-16 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:w-2xl md:w-xl w-sm"
        >
          <Card className="">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-extrabold text-purple-800 text-center">
                  Join HerGuardian
                </h1>
                <h2 className="text-gray-500 mt-2">
                  Create your account to start your journey toward enhanced
                  personal safety and peace of mind.
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="p-4 flex gap-4 justify-left items-center w-full">
                <Label htmlFor="email" className="w-1/4">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  className="w-2/3"
                  type="email"
                  {...register("email")}
                  // value={form.watch("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="p-4 flex gap-4 justify-left items-center w-full">
                <Label htmlFor="password" className="w-1/4">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  className="w-2/3"
                  type="password"
                  {...register("password")}
                  // value={form.watch("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="p-4 flex gap-4 justify-left items-center w-full">
                <Label htmlFor="confirm-password" className="w-1/4">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  placeholder="Confirm your password"
                  className="w-2/3"
                  type="password"
                  {...register("confirmPassword")}
                  // value={form.watch("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                // disabled={}
                className="bg-purple-500 lg:w-md md:w-md lg:px-0 md:px-0 px-12 mt-8 text-white hover:bg-purple-700"
              >
                {isSubmitting ? <Loader className="text-white" /> : "Continue"}
              </Button>

              <div className="flex items-center gap-2 my-6 lg:w-md w-sm px-4">
                <Separator className="flex-1" />
                <span className="text-sm">OR</span>
                <Separator className="flex-1" />
              </div>
              <Button className="bg-white text-black lg:w-md border border-black hover:bg-gray-200">
                <Globe />
                Sign In with Google
              </Button>
            </CardContent>
          </Card>
        </form>
        <div>
          Already have an account? &nbsp;
          <Link href="/login" className="text-blue-500 font-semibold">
            Login
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="remember">Remember Me</Label>
          <Input
            id="remember"
            type="checkbox"
            className="h-4 w-4"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}
