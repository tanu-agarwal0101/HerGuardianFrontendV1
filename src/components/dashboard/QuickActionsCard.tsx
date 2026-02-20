"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-primary">Quick Actions</CardTitle>
        <div title="Go to Actions">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/actions")}>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 flex-1">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex flex-col items-center justify-center gap-2 border rounded-xl p-4 hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer text-center"
            onClick={() => {
                const routes: Record<number, string> = {
                    1: "/dashboard", // Quick Timer
                    2: "/dashboard/actions/check-in",
                    3: "/dashboard/actions/calls",
                    4: "/dashboard/actions/location"
                };
                if(routes[tool.id]) router.push(routes[tool.id]);
            }}
          >
            <div className="p-2 bg-primary/10 rounded-full text-primary">
                <tool.Component />
            </div>
            <span className="text-sm font-medium">{tool.title}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


