"use client";
import { UserPlus, Users, Lock, CheckCircle } from "lucide-react";

const steps = [
  { title: "Basic Info", icon: <UserPlus size={32} /> },
  { title: "Contacts", icon: <Users size={32} /> },
  { title: "Permissions", icon: <Lock size={32} /> },
  { title: "Complete", icon: <CheckCircle size={32} /> },
];

export default function HorizontalStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  const percentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex justify-between mb-2 text-sm text-purple-800 font-medium">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
        <span>{percentage}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-purple-700 h-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps with Icons */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            className="flex flex-col items-center text-center w-1/4"
            key={index}
          >
            <div
              className={`rounded-full p-2 mb-1 ${index === currentStep ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-400"}`}
            >
              {step.icon}
            </div>
            <p
              className={`text-xs ${index === currentStep ? "text-purple-800 font-semibold" : "text-purple-400"}`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
