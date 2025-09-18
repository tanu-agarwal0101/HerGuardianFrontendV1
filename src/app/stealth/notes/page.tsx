"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";

export default function NotesApp() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const router = useRouter();
  const { dashboardPass, sosPass } = useUserStore((s) => s.stealth);

  const handleSave = async () => {
    if (!note.trim()) return;

    setSavedNotes([...savedNotes, note]);
    setNote("");

    // Check for triggers
    if (dashboardPass && note === dashboardPass) {
      await sendSignal(note, "dashboard");
    } else if (sosPass && note === sosPass) {
      await sendSignal(note, "sos");
    }
  };

  const sendSignal = async (message: string, type: "dashboard" | "sos") => {
    try {
      if (type === "dashboard") {
        router.push("/dashboard");
      } else {
        triggerSOS();
      }
    } catch (err) {
      console.error("Failed to send signal", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 my-8">
        <CardTitle className="text-2xl font-bold mb-4 text-center">
          Notes App
        </CardTitle>

        <textarea
          className="w-full border rounded p-3 mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex w-full justify-center gap-4 items-center">
          <Button
            className=" bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 rounded my-2"
            onClick={handleSave}
          >
            Save Note
          </Button>

          <Button
            className=" bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 rounded"
            onClick={() => setSavedNotes([])}
          >
            Delete all
          </Button>
        </div>
      </Card>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Saved Notes</h2>
        <ul className="space-y-2">
          {savedNotes.map((n, i) => (
            <li key={i} className="bg-white p-3 rounded shadow-sm border">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
