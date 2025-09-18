"use client";
import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, PhoneCall } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const FakeCall = dynamic(() => import("@/components/common/fakeCall"), {
  ssr: false,
});
const FakeCallSettings = dynamic(
  () => import("@/components/common/fakeCallSettings"),
  { ssr: false }
);

interface Settings {
  name: string;
  photo: string;
  ringtone: string;
  voice: string;
}

export function FakeCallCard() {
  const [openSettings, setOpenSettings] = useState(false);
  const [fakeCall, setFakeCall] = useState(false);
  const [delay, setDelay] = useState(10);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    name: "Mom",
    photo: "/mom.jpg",
    ringtone: "/fake-ring.mp3",
    voice: "/voice1.mp3",
  });

  const schedule = () => {
    setPending(true);
    setCountdown(delay);
  };

  useEffect(() => {
    if (!pending || countdown === null) return;
    if (countdown === 0) {
      setPending(false);
      setCountdown(null);
      setFakeCall(true);
      return;
    }
    const id = setTimeout(
      () => setCountdown((prev) => (prev !== null ? prev - 1 : null)),
      1000
    );
    return () => clearTimeout(id);
  }, [pending, countdown]);

  return (
    <Card className="relative flex flex-col items-center gap-4 p-4 w-sm md:w-lg">
      <CardTitle className="text-center">
        <h1 className="text-2xl text-purple-500 font-bold">Fake Call</h1>
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-purple-600"
          onClick={() => setOpenSettings(true)}
          aria-label="Open fake call settings"
        >
          <Settings2 />
        </button>
        <p className="text-gray-600 text-center text-sm max-w-sm">
          Trigger a fake incoming call to help exit unsafe or uncomfortable
          situations.
        </p>
      </CardTitle>

      <Button
        className="w-36 h-36 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex flex-col items-center justify-center"
        onClick={schedule}
        disabled={pending}
        aria-live="polite"
      >
        <PhoneCall className="w-10 h-10" />
        {pending && countdown !== null && (
          <span className="mt-2 text-sm font-semibold animate-pulse">
            In {countdown}s
          </span>
        )}
      </Button>
      <div className="text-gray-600 text-sm">
        Delay:{" "}
        <select
          className="bg-white text-black rounded px-3 py-1 border"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          aria-label="Fake call delay"
        >
          {[0, 5, 10, 30].map((v) => (
            <option value={v} key={v}>
              {v}s
            </option>
          ))}
        </select>
      </div>
      {openSettings && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-40">
          <FakeCallSettings
            onSave={(s: any) => {
              setSettings(s);
              setOpenSettings(false);
            }}
          />
        </div>
      )}
      {fakeCall && (
        <FakeCall onClose={() => setFakeCall(false)} settings={settings} />
      )}
    </Card>
  );
}



//     const [fakeCall, setFakeCall] = useState(false);
//   const scheduleFakeCall = () => {
//     setFakeCallPending(true);
//     setCountdown(delay);
//   };

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (fakeCallPending && countdown !== null && countdown > 0) {
//       timer = setInterval(() => {
//         setCountdown((prev) => (prev !== null ? prev - 1 : null));
//       }, 1000);
//     } else if (fakeCallPending && countdown === 0) {
//       document.documentElement.requestFullscreen();
//       setFakeCall(true);
//       setFakeCallPending(false);
//       setCountdown(null);
//     }
//     return () => clearInterval(timer);
//   }, [fakeCallPending, countdown]);

//   const [openSettings, setOpenSettings] = useState(false);
//   const [settings, setSettings] = useState({
//     name: "Mom",
//     photo: "/mom.jpg",
//     ringtone: "/fake-ring.mp3",
//     voice: "/voice1.mp3",
//   });


{/* <Card className="flex flex-col justify-center items-center gap-4 lg:w-1/2 w-full h-100 my-2 p-4 relative">
  <h1 className="text-2xl font-bold text-purple-500">Fake Call</h1>
  <button
    className="absolute right-4 top-4"
    onClick={() => setOpenSettings(true)}
    aria-label="Open fake call settings"
    title="Open fake call settings"
  >
    <Settings2 />
  </button>
  <p className="text-gray-600">
    Trigger a fake incoming call to help escape uncomfortable situations.
  </p>
  <Button
    className="w-40 h-40 rounded-full bg-purple-500 text-white hover:bg-purple-700 flex flex-col items-center justify-center"
    onClick={() => scheduleFakeCall()}
    disabled={fakeCallPending}
  >
    <PhoneCall width={200} height={200} className="font-bold" />
    {fakeCallPending && countdown !== null && (
      <span className="mt-2 text-lg font-bold animate-pulse">
        Fake call in {countdown}s
      </span>
    )}
  </Button>

  <p className="text-gray-600">
    Trigger a Fake Call in{" "}
    <select
      className="bg-white text-black rounded px-3 py-1"
      value={delay}
      onChange={(e) => setDelay(Number(e.target.value))}
      aria-label="Fake call delay"
      title="Fake call delay"
    >
      <option value={0}>0s</option>
      <option value={5}>5s</option>
      <option value={10}>10s</option>
      <option value={30}>30s</option>
    </select>{" "}
    seconds
  </p>

  {openSettings && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
      <FakeCallSettings
        onSave={(newSettings) => {
          setSettings(newSettings);
          setOpenSettings(false);
        }}
      />
    </div>
  )}
  {fakeCall && (
    <FakeCall onClose={() => setFakeCall(false)} settings={settings} />
  )}
</Card>; */}