"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Play, Pause, StopCircle } from "lucide-react";
import CircularProgress from '@mui/material/CircularProgress'
import axios from "axios";

export default function SafetyTimer(){

     const [duration, setDuration] = useState(30);
      const [shareLocation, setShareLocation] = useState(false);
      const [countdown, setCountdown] = useState<number | null>(null)
      const [timerActive, setTimerActive] = useState(false)
      const [progress, setProgress] = useState(100)

      const startTimer = async ()=>{
        try{
            const res = await axios.post("http://localhost:5001/timer/start", {
                duration,
                shareLocation
            })
            setCountdown(duration * 60)
            
            setTimerActive(true)
        } 
        catch(e){
            console.error("Failed to start timer")
        }
      }

      const cancelTimer = async ()=>{
        setCountdown(null)
        setTimerActive(false)
        // notify backend
        const res = await axios.patch("http://localhost:5001/timer/cancel")

        if(res.status === 200){
            console.log("Timer cancelled successfully")
        } else {
            console.error("Failed to cancel timer")
        }
      }


      useEffect(()=>{
        let interval: any
        if(countdown && countdown>0 ){
            interval = setInterval(()=>{
                setCountdown((prev)=> (prev ? prev-1: 0))
            }, 1000)
        } else if(countdown === 0){
            setTimerActive(false)
            alert("safety timer expired")
        }

        return ()=> clearInterval(interval)
      }, [countdown])


      useEffect(() => {
  let animationFrame: number;

  const updateProgress = () => {
    if (countdown !== null && duration > 0) {
      const total = duration * 60;
      const elapsed = total - countdown;
      const progressValue = (elapsed / total) * 100;
      setProgress(progressValue);
    }
    animationFrame = requestAnimationFrame(updateProgress);
  };

  animationFrame = requestAnimationFrame(updateProgress);

  return () => cancelAnimationFrame(animationFrame);
}, [countdown, duration]);



      const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
    return(
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card className="m-4 p-6 lg:w-200  w-full flex justify-center">
      <CardTitle className="flex flex-col gap-8">
        <h1 className="text-3xl text-purple-500 font-bold text-center">Safety Timer</h1>
        <p className="text-gray-600">Set a timer for check-ins</p>
      </CardTitle>

      <div className="mt-4">
        <Label>Timer Duration (minutes)</Label>
        <div className="flex items-center gap-3 mt-1">
          <Input
            type="range"
            min="5"
            max="240"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="accent-purple-500"
          />
          <span className="font-bold">{duration} min</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between my-4 gap-4">
        <div className="flex items-center">
          <Switch
            checked={shareLocation}
            onCheckedChange={() => setShareLocation(!shareLocation)}
          />
          <span className="ml-2 text-sm text-gray-700">
            Share location during timer
          </span>
        </div>
        {!timerActive && (
          <Button onClick={startTimer} className="bg-purple-600 text-white">
            <Play className="mr-1" size={16} />
            Start Timer
          </Button>
        )}
      </div>

{/*  Time Left: {formatTime(countdown)} */}
      {timerActive && countdown !== null && (
        <div className="bg-gradient-to-r from-green-300 via-cyan-500 to-purple-500 w-full h-100 my-8 flex items-center justify-center gap-4 flex-col">
          <Card className="p-4 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
  <svg className="transform -rotate-90" width="160" height="160">
    <defs>
      <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00ff95" />
        <stop offset="50%" stopColor="#00e5ff" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <circle
      cx="80"
      cy="80"
      r="70"
      stroke="#e5e7eb"
      strokeWidth="8"
      fill="none"
    />
    <circle
      cx="80"
      cy="80"
      r="70"
      stroke={
    countdown !== null && countdown <= 60
      ? "red"
      : "url(#gradientRing)"
  }
      strokeWidth="8"
      strokeDasharray={440}
      strokeDashoffset={`${440 * (1 - progress / 100)}`}
      strokeLinecap="round"
      fill="none"
      className={`transition-all duration-300 ${
    countdown !== null && countdown <= 60 ? "animate-pulse" : ""
  }`}
    />
  </svg>
  <div className="absolute text-xl font-bold text-gray-800">
    {formatTime(countdown ?? 0)}
  </div>
</div>

          <div>
           <Button onClick={cancelTimer} variant="destructive" className="bg-purple-800 p-6">
            <StopCircle className="mr-1" size={16} />
            Cancel Timer
          </Button>
          </div>
          </Card>
          {countdown !== null && (
  <p className="text-md font-semibold text-white mt-2">
    {Math.floor((duration * 60 - countdown) / 60)} minutes passed
  </p>
)}

          
        </div>
      )}
    </Card>
        </div>
  )
}