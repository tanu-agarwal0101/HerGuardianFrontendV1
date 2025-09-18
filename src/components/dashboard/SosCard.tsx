"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerSOS } from "@/lib/sosTrigger";
import { motion } from "motion/react";

export function SosCard() {
  return (
    // <Card className="relative flex flex-col items-center gap-4 p-4">
    //   <h2 className="text-xl font-semibold text-purple-600">Emergency SOS</h2>
    //   <p className="text-gray-600 text-center text-sm">
    //     Activate in case of emergency to alert your contacts.
    //   </p>
    //   <div className="relative">
    //     <Button
    //       aria-label="Activate emergency SOS"
    //       className="relative z-10 bg-red-600 hover:bg-red-700 text-white rounded-full w-40 h-40 text-center flex items-center justify-center font-semibold text-lg"
    //       onClick={triggerSOS}
    //     >
    //       Activate
    //     </Button>
    //     <motion.span
    //       aria-hidden
    //       className="absolute inset-0 w-40 h-40 rounded-full bg-red-400/40"
    //       initial={{ scale: 0.7, opacity: 0.6 }}
    //       animate={{ scale: [0.7, 1.4], opacity: [0.6, 0] }}
    //       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    //     />
    //   </div>
    //   <p className="text-gray-500 text-xs">
    //     Long press mobile power + Activate for escalation (future hint)
    //   </p>
    // </Card>

    <Card className="flex flex-col justify-center items-center gap-4 h-100 p-2 w-sm md:w-lg">
      <h1 className="text-2xl font-bold text-purple-500 text">Emergency SOS</h1>
      <p className="text-gray-600">
        Activate in case of emergency to alert your contacts
      </p>
      <Button
        className="bg-red-500 text-white rounded-full w-40 text-center h-40 hover:bg-red-700"
        onClick={triggerSOS}
      >
        Activate SOS
        {/* <AnimatePresence>
            
            </AnimatePresence> */}
        <motion.div
          className="absolute bg-white w-40 h-40 rounded-full border-6 border-red-00"
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{
            opacity: [0.5, 0],
            scale: [1, 1.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
      </Button>
      <p className="text-gray-600">
        Long press to activate emergency mode and alert everyone
      </p>
    </Card>
  );
}
