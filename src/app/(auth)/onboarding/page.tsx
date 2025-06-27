// import Onboarding from '@/components/onboarding/Onboarding';
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Bell,
  LocateIcon,
  ArrowRight,
  Check,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicInfo from "@/components/common/basicInfo";
import Contacts from "@/components/common/contacts";
import PermissionBox from "@/components/common/PermissionBox";
import RegistrationComplete from "@/components/common/RegistrationComplete";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { AnimatePresence, motion } from 'framer-motion';
// import HorizontalStepper from "@/components/common/horizontalStepper";

const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  contacts: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      phone: z.string().min(1, "Phone number is required"),
    }),
  ),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [contacts, setContacts] = useState([
    { id: 1, name: "", relationship: "", phone: "" },
  ]);

  const [formData, setFormData] = useState<OnboardingValues>({
    name: "",
    phone: "",
    contacts: [],
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      phone: "",
      contacts: [],
    },
  });

  const handleSubmit = (data: OnboardingValues) => {
    // api call
    console.log(data);
  };

  // const addContact = () => {
  //   setContacts([
  //     ...contacts,
  //     {
  //       id: contacts.length + 1,
  //       name: "",
  //       relationship: "",
  //       phone: "",
  //     },
  //   ]);
  // };

  // const handleInputChange = (id: number, field: string, value: string) => {
  //   setContacts(
  //     contacts.map((contact) =>
  //       contact.id === id
  //         ? {
  //             ...contact,
  //             [field]: value,
  //           }
  //         : contact
  //     )
  //   );
  // };

  return (
    <div className="lg:p-50">
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
        <div>HerGuardian</div>
        <Link href="/" className="flex">
          <ArrowLeft />
          <span>Back To Home</span>
        </Link>
      </div>
      <div className="m-2 my-10">
        <h1 className="text-3xl font-extrabold text-purple-800 text-center">
          Join HerGuardian
        </h1>
        <h2 className="text-gray-500 mt-4 text-center">
          Create your account to start your journey toward enhanced personal
          safety and peace of mind.
        </h2>
      </div>
      {/* <form onSubmit={form.handleSubmit(handleSubmit)}>
      
      </form> */}
      <AnimatePresence mode="wait">
        {step === 1 && <BasicInfo nextStep={nextStep} />}

        {step === 2 && <Contacts nextStep={nextStep} prevStep={prevStep} />}

        {step === 3 && (
          <PermissionBox nextStep={nextStep} prevStep={prevStep} />
        )}

        {step === 4 && <RegistrationComplete prevStep={prevStep} />}
      </AnimatePresence>
    </div>
  );
}
