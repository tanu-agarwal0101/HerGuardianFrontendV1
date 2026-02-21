"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Play, Shield } from "lucide-react";
import React from "react";
import { useUserStore } from "@/store/userStore";

export function HeroCard() {
  const user = useUserStore((s) => s.user);
  
  return (
    <section className="w-full">
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Shield className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    Welcome back, {user?.firstName || "Guardian"}
                </h1>
                <p className="text-primary-foreground/90 text-lg md:text-xl">
                    Your safety command center is active. All systems are monitoring normally.
                </p>
                
                 <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                    <Button 
                        variant="secondary" 
                        className="gap-2 font-semibold shadow-sm"
                        onClick={() => {}} // Tutorial trigger
                    >
                        <Play className="w-4 h-4" /> 
                        Quick Tutorial
                    </Button>
                    <Button
                        variant="ghost"
                        className="gap-2 text-primary-foreground hover:bg-white/20 hover:text-white opacity-60 cursor-not-allowed"
                        disabled
                    >
                        <Settings className="w-4 h-4" /> 
                        Stealth Mode — Coming Soon
                    </Button>
                </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-6 shadow-inner ring-1 ring-white/20">
                <Shield className="w-24 h-24 text-white drop-shadow-md" />
            </div>
        </div>
      </Card>
    </section>
  );
}
