"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  LocateIcon,
  MoreHorizontal,
  PhoneCall,
} from "lucide-react";

const tools = [
  {
    id: 1,
    Component: () => <Clock />,
    title: "Quick Timer",
  },
  {
    id: 2,
    Component: () => <Check />,
    title: "Check In",
  },
  {
    id: 3,
    Component: () => <PhoneCall />,
    title: "Call Contact",
  },
  {
    id: 4,
    Component: () => <LocateIcon />,
    title: "Share Location",
  },
];

export function QuickActionsCard() {
  const router = useRouter();
  return (
    <Card className="p-4 flex flex-col items-center justify-center gap-4 relative w-sm md:w-lg h-110">
  <CardTitle className="text-center">
    <h1 className="text-2xl text-purple-500 font-bold">Quick Actions</h1>
    <span
      className="absolute right-4 top-2"
      onClick={() => router.push("/actions")}
    >
      <MoreHorizontal />
    </span>
    <p className="text-gray-600">Frequently used safety tools</p>
  </CardTitle>
  <CardContent className="grid gap-4 justify-center items-center">
    {tools.map((tool) => (
      <div
        key={tool.id}
        className="flex items-center gap-2 border w-auto h-15 p-8 rounded-xl"
      >
        <tool.Component />
        <span>{tool.title}</span>
      </div>
    ))}
  </CardContent>
</Card>

  );
}


