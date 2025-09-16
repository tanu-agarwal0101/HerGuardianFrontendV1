// components/FakeCall.tsx
import { useState, useEffect } from "react";
import { Phone, PhoneOff } from "lucide-react";

// missed call notification

export default function FakeCall({
  onClose,
  settings,
}: {
  onClose: () => void;
  settings: {
    name: string;
    photo: string;
    ringtone: string;
    voice: string;
  };
}) {
  const [answered, setAnswered] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  useEffect(() => {
    let audio: HTMLAudioElement;

    if (!answered) {
      audio = new Audio(settings.ringtone);
      audio.loop = true;
      audio.play();
    }
    if (!answered && "vibrate" in navigator) {
      navigator.vibrate([500, 200, 500]);
    }
    return () => audio && audio.pause();
  }, [answered]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (answered) {
      const voice = new Audio(settings.voice);
      voice.play();
      interval = setInterval(() => setCallTimer((prev) => prev + 1), 1000);
    }

    return () => clearInterval(interval);
  }, [answered]);

  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60)
      .toString()
      .padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center">
      {!answered ? (
        <>
          <div className="text-center">
            <p className="text-xl text-gray-400 mb-2">Incoming Call</p>
            <h2 className="text-4xl font-bold mb-2">
              {settings.name || "Mom"}
            </h2>
            <img
              src={settings.photo || "/fake-call.png"}
              alt="Caller"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
            />
            <p className="text-md text-gray-300 mb-6">Mobile</p>
          </div>

          <div className="flex justify-center space-x-16 mt-6">
            <button
              onClick={onClose}
              className="bg-red-600 p-5 rounded-full"
              title="Decline call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button
              onClick={() => setAnswered(true)}
              className="bg-green-600 p-5 rounded-full"
              title="Answer call"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-1">
            {settings.name || "Mom"}
          </h2>
          <p className="text-sm text-gray-400 mb-2">Call in progress</p>
          <p className="text-lg font-mono mb-6">{formatTime(callTimer)}</p>
          <img
            src={settings.photo || "/mom.jpg"}
            alt="Caller"
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white"
          />

          <button
            onClick={onClose}
            className="mt-6 bg-red-600 px-4 py-2 rounded-xl"
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
}
