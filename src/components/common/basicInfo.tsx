"use client";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Users } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

const basicInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

interface Props {
  nextStep: () => void;
}

const BasicInfo = ({ nextStep }: Props) => {
  // const form = useForm<BasicInfoValues>({
  //   resolver: zodResolver(basicInfoSchema),
  //   defaultValues: {
  //     fullName: "",
  //     phoneNumber: "",
  //   },
  // });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
  });

  const onSubmit = async (data: BasicInfoValues) => {
    try {
      const res = await Users.onboard({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
      useUserStore.getState().setUser(res.data.user);
      nextStep();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        key="step1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-purple-600 text-2xl">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label>First Name</Label>
            <Input
              placeholder="Enter your full name"
              className="mb-4"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
            <Label>Last Name</Label>
            <Input
              placeholder="Enter your full name"
              className="mb-4"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}

            <Label>Phone Number</Label>
            <Input
              placeholder="Enter your phone number"
              className="mb-4"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-500 w-full my-8  text-white "
            >
              {isSubmitting ? "Submitting..." : "Next: Emergency Contacts"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </form>
  );
};

export default BasicInfo;
