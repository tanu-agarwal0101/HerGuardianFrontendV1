"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SafetyTimerCard() {
  const router = useRouter();
  return (
    // <Card className="flex flex-col p-4 items-center justify-between">
    //   <CardHeader className="p-0 mb-2 text-center">
    //     <CardTitle className="text-purple-600 text-xl font-semibold">
    //       Safety Timer
    //     </CardTitle>
    //     <p className="text-gray-600 text-sm">
    //       Set a timer for activities and check-ins.
    //     </p>
    //   </CardHeader>
    //   <CardContent className="p-0 mt-4">
    //     <Button
    //       className="bg-purple-600 hover:bg-purple-700 w-36 h-36 rounded-full text-white"
    //       onClick={() => router.push("/actions/timer")}
    //       aria-label="Open safety timer"
    //     >
    //       Go
    //     </Button>
    //   </CardContent>
    // </Card>

    <Card className="p-4 h-70 flex flex-col items-center justify-around w-sm md:w-lg">
      <CardTitle>
        <h1 className="text-2xl text-purple-500 font-bold text-center">
          Safety Timer
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Set a timer for activities and check-ins
        </p>
      </CardTitle>
      <CardContent className="w-full flex justify-center">
        <Button
          className="bg-purple-500 rounded-full w-40 h-40 hover:bg-purple-800"
          onClick={() => router.push("/actions/timer")}
        >
          Go Set Timer
        </Button>
      </CardContent>
    </Card>
  );
}
