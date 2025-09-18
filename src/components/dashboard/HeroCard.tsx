"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Settings, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useUserStore } from "@/store/userStore";

export function HeroCard() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  return (
    // <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
    //   <div className="absolute inset-0 bg-black/10" />
    //   <CardHeader className="relative z-10">
    //     <CardTitle className="text-3xl font-extrabold lg:text-4xl text-center">
    //       Welcome {user?.firstName || "User"}
    //     </CardTitle>
    //   </CardHeader>
    //   <CardContent className="relative z-10 flex flex-col items-center gap-4 pb-8">
    //     <p className="text-center max-w-xl text-sm md:text-base">
    //       Your personal safety companion is ready. Use the quick actions below
    //       to stay protected wherever you go.
    //     </p>
    //     <div className="flex gap-3 flex-wrap justify-center">
    //       <Button className="bg-purple-600 hover:bg-purple-700 flex gap-2 items-center">
    //         <Play className="w-4 h-4" /> Quick Tutorial
    //       </Button>
    //       <Button
    //         variant="secondary"
    //         className="bg-white text-purple-600 hover:text-purple-800 hover:bg-white flex gap-2 items-center"
    //         onClick={() => router.push("/stealth/customize")}
    //       >
    //         <Settings className="w-4 h-4" /> Customize Stealth Mode
    //       </Button>
    //     </div>
    //     <div className="mt-4 rounded-full p-4 bg-white text-purple-600 shadow-inner">
    //       <ShieldAlert className="w-20 h-20" />
    //     </div>
    //   </CardContent>
    // </Card>

    <section className="my-2  w-full">
      <Card className=" h-fit my-4 py-12 text-white text-center bg-transparent border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold lg:text-4xl w-full text-center mb-2 capitalize">
            Welcome to Your Safety Dashboard {user?.firstName || "User"}!
          </CardTitle>
          <p>
            Your personal safety companion is ready to help. Use the quick
            actions below to stay protected wherever you go.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4">
          <div className="flex gap-2 w-full justify-center flex-wrap ">
            <Button className="bg-purple-500 text-white flex items-center justify-center border hover:bg-purple-800">
              <Play />
              Quick Tutorial
            </Button>
            <Button
              className="bg-white text-purple-500 flex items-center justify-center hover:text-purple-800 hover:bg-white"
              onClick={() => router.push("/stealth/customize")}
            >
              <Settings />
              Customize Stealth Mode
            </Button>
          </div>
          <div className="bg-white text-purple-600 mt-6">
            <ShieldAlert
              width={100}
              height={100}
              className="bg-purple-500 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
