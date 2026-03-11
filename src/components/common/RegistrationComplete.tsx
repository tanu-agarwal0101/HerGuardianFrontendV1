"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface Props {
  prevStep: () => void;
}

const features = [
  {
    id: "1",
    symbol: "lock",
    desc: "256-bit Encryption",
  },
  {
    id: "2",
    symbol: "shield",
    desc: "SSL Secure",
  },
  {
    id: "3",
    symbol: "key",
    desc: "Privacy Protected",
  },
];
const RegistrationComplete = ({ prevStep }: Props) => {
  const router = useRouter();
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Card className="border-none shadow-none bg-transparent py-6">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center">
            <Check
              width={80}
              height={80}
              className="bg-purple-200 text-purple-600 rounded-full p-4 m-2"
            />
            <h1 className="text-2xl text-purple-800">Registration Complete!</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center">
          <p className="text-center lg:w-120 md:w-120">
            Your account has been successfully created. You can now access all
            safety features through our web platform.
          </p>
          <Card className="my-8 w-fit p-4 bg-slate-50">
            <h1 className="text-purple-600 text-xl text-center font-bold mt-2">
              Get Started Now
            </h1>
            <div className="flex flex-col gap-4 items-center justify-between">
              <p className="lg:w-100 md:w-100 text-center">
                Access your dashboard to set up your safety features and
                emergency contacts.
              </p>
              <Button
                type="submit"
                className="bg-purple-500 w-fit mb-4 text-white "
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight />
              </Button>
            </div>
          </Card>
          <div className="flex gap-3 justify-center items-center">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="flex gap-2 items-center border-b text-purple-600 bg-purple-50 w-fit p-2 text-[12px] rounded-lg"
              >
                <Lock width={20} height={20} />
                <h1 className="text-black">{feat.desc}</h1>
              </div>
            ))}
          </div>
          <Button
            className="bg-white text-black flex gap-2 p-2 border mt-4"
            onClick={() => prevStep()}
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegistrationComplete;
