"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Bell,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

interface Props {
  prevStep: () => void;
  nextStep: () => void;
}

const permissions = [
  {
    id: "1",
    symbol: "",
    title: "Location Access",
    desc: "We need your location to send accurate coordinates to your emergency contacts and to enable safety features like route tracking and safe area alerts.",
  },
  {
    id: "2",
    symbol: "",
    title: "Notifications",
    desc: "We send notifications for safety check-ins, emergency alerts, and important updates about your account and safety features.",
  },
  {
    id: "3",
    symbol: "",
    title: "Browser Notifications",
    desc: "Enable browser notifications to receive instant alerts about safety check-ins and emergency updates while using our web platform.",
  },
];

const PermissionBox = ({ prevStep, nextStep }: Props) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-purple-600 text-2xl">
            App Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>
            HerGuardian needs certain permissions to keep you safe. Here&apos;s why
            we need them and how they&apos;re used.
          </p>
          {permissions.map((permission) => (
            <Card key={permission.id}>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Bell className="rounded-full text-purple-600 bg-purple-200 p-1" />
                  <h1>{permission.title}</h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <p>{permission.desc}</p>
                <div className="flex items-center mt-4">
                  <Input
                    type="checkbox"
                    id={permission.id}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={permission.id} className="ml-2">
                    Allow {permission.title}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="submit"
            className="bg-purple-500 w-full mt-8  text-white "
            onClick={() => prevStep()}
          >
            <ArrowLeft /> Back
          </Button>
          <Button
            type="submit"
            className="bg-purple-500 w-full mb-8  text-white "
            onClick={() => nextStep()}
          >
            Next: Finish Registration
            <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PermissionBox;
