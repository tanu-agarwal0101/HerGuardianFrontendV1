"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import BasicInfo from "@/components/common/basicInfo";
import Contacts from "@/components/common/contacts";
import PermissionBox from "@/components/common/PermissionBox";
import RegistrationComplete from "@/components/common/RegistrationComplete";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="lg:p-50">
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white">
        <div>HerGuardian</div>
        <Link href="/" className="flex text-white hover:text-white/80 transition-colors">
          <ArrowLeft className="mr-2" />
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

      <AnimatePresence mode="wait">
        {step === 1 && <BasicInfo nextStep={nextStep} key="step-1" />}

        {step === 2 && <Contacts nextStep={nextStep} prevStep={prevStep} key="step-2" />}

        {step === 3 && (
          <PermissionBox nextStep={nextStep} prevStep={prevStep} key="step-3" />
        )}

        {step === 4 && <RegistrationComplete prevStep={prevStep} key="step-4" />}
      </AnimatePresence>
    </div>
  );
}
