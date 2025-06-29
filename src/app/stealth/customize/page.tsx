"use client"
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useState } from "react";
import { CheckCircle } from 'lucide-react';
import Dashboard from './../../dashboard/page';
import Image from "next/image";

export default function CustomizeStealthPage() {
    const [stealthMode, setStealthMode] = useState(false);
    const [stealthType, setStealthType] = useState("calculator");

    const onSubmit = async () => {
  try {
    const res = await axios.patch(
      "http://localhost:5001/users/update-stealth",
      {
        stealthMode,
        stealthType,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert("Stealth mode configured successfully!");
    // Optionally redirect
    // router.push("/dashboard") or show success UI
  } catch (error) {
    console.error("Error setting stealth mode:", error);
    alert("Failed to set stealth mode. Please try again.");
  }
};

    return (
        <div className="min-h-screen">
            <Header/>
            <div className=" p-4 w-full flex flex-col justify-center items-center">
                <div className="flex gap-2 w-full p-4 justify-center items-center">
                    <Label className="text-2xl">Enable Stealth Mode</Label>
                    {/* <Switch
                    id="stealth-mode"
                    label="Enable Stealth Mode"
                /> */}
                <Input
                    type="checkbox"
                    id="stealth-mode"
                    className="h-4 w-4"
                    checked={stealthMode}
                    onChange={(e) => setStealthMode(e.target.checked)}
                  />
                </div>
                <div className="flex flex-wrap justify-center items-center">
                    <Card className="m-4 p-4 w-fit">
                        <CardTitle>Calculator App</CardTitle>
                        <CardContent className="w-full flex justify-center items-center">
                            <Image src="/calculator.png" alt="Calculator App" className=" object-cover border" width={200} height={100} />
                        </CardContent>
                        <CardFooter className="flex justify-between items-center italic gap-4 font-semibold">
                            <ul>
                                 <li>
                                    "1234" -&gt; /dashboard
                                </li>
                                <li>"12+34=" -&gt; sos</li>
                            </ul>
                            <Button onClick={() => setStealthType("calculator")} 
                            disabled={stealthType==="calculator"} className=" bg-purple-600 hover:bg-purple-800 ">Choose Calculator</Button>
                        </CardFooter>
                    </Card>
                    <Card className="m-4 p-4 w-fit">
                        <CardTitle>Notes App</CardTitle>
                        <CardContent className="w-full flex justify-center items-center">
                            <Image src="/notes.png" alt="Notes App" className=" object-cover border" width={300} height={200} />
                        </CardContent>
                        <CardFooter className="flex justify-between items-center gap-4 italic font-semibold">
                            <ul>
                                <li>
                                    "1234" -&gt; /dashboard
                                </li>
                                <li>"alert" -&gt; sos</li>
                            </ul>
                            <Button onClick={() => setStealthType("notes")} 
                            disabled={stealthType==="notes"}
                            className=" bg-purple-600 hover:bg-purple-800 ">Choose Notes</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex justify-center items-center gap-4 p-4 w-full">
                    <Button onClick={()=> onSubmit()} className="bg-purple-600 hover:bg-purple-800">Finalize</Button>
                </div>
            </div>
        </div>
    )
}