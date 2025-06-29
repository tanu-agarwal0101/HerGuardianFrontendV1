"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotesApp() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const router = useRouter();
  const signalTriggers = ['1234', 'alert', 'secret'];

  const handleSave = async () => {
    if (!note.trim()) return;

    setSavedNotes([...savedNotes, note]);
    setNote("");

    // Check for trigger words
    const lowerNote = note.toLowerCase();
    if (signalTriggers.some(trigger => lowerNote.includes(trigger))) {
      await sendSignal(note);
    }
  };

  
  const sendSignal = async (message: string) => {
    alert(`Signal sent for: "${message}"`);
    try {
    //   await fetch('/api/signal', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ message }),
    //   });


    if(message === '1234') {
      router.push("/dashboard")
    }
    else if(message === 'alert') {
        alert("sos signal")
    }
    else{
        alert("Signal sent: " + message);
    }
    } catch (err) {
      console.error('Failed to send signal', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 my-8">
        <CardTitle className="text-2xl font-bold mb-4 text-center">Notes App</CardTitle>

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
        className=" bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 rounded" onClick={() => setSavedNotes([])}>Delete all</Button>
        </div>
      </Card>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Saved Notes</h2>
        <ul className="space-y-2">
          {savedNotes.map((n, i) => (
            <li key={i} className="bg-white p-3 rounded shadow-sm border">{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
