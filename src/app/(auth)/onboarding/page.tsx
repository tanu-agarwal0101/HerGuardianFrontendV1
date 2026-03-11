"use client";

import { Shield } from "lucide-react";
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
    <div className="flex flex-col min-h-screen relative z-10 p-4 sm:p-6 md:p-8">
      
      {/* Sleek transparent header */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-4 sm:mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">HerGuardian</span>
        </Link>
        <Link 
          href="/" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto pt-4 sm:pt-10">
        <div className="mb-8 w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground text-center">
                Configure HerGuardian
            </h1>
            <h2 className="text-sm sm:text-base text-muted-foreground mt-3 text-center font-medium max-w-md mx-auto">
                Set up your profile, emergency contacts, and stealth priorities to activate your personalized safety shield.
            </h2>
        </div>

        <div className="w-full relative shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-card/80 backdrop-blur-2xl border border-white/20 dark:border-white/10">
            {/* Subtle card glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50 z-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 && <BasicInfo nextStep={nextStep} key="step-1" />}

        {step === 2 && <Contacts nextStep={nextStep} prevStep={prevStep} key="step-2" />}

        {step === 3 && (
          <PermissionBox nextStep={nextStep} prevStep={prevStep} key="step-3" />
        )}

        {step === 4 && <RegistrationComplete prevStep={prevStep} key="step-4" />}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
