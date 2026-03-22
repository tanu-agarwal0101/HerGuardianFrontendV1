"use client";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { ChevronLeft, MoreHorizontal, SquarePen } from "lucide-react";

export default function NotesApp() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const router = useRouter();
  const { dashboardPass, sosPass } = useUserStore((s) => s.stealth);

  const handleSave = async () => {
    if (!note.trim()) return;

    // Check triggers before saving
    if (dashboardPass && note.trim() === dashboardPass) {
       unlockApp();
       return;
    }
    if (sosPass && note.trim() === sosPass) {
       triggerSOS(router);
       // Don't save SOS pass
       setNote("");
       return;
    }

    setSavedNotes([note, ...savedNotes]);
    setNote("");
  };

  const unlockApp = async () => {
    try {
      await fetch("/api/stealth/unlock", { method: "POST" });
      useUserStore.getState().setStealth({ stealthMode: false });
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black font-sans text-black dark:text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-800">
         <div className="flex items-center gap-1 text-orange-500">
            <ChevronLeft className="size-6" />
            <span className="text-lg">Folders</span>
         </div>
         <span className="font-semibold text-lg">All iCloud</span>
         <div className="flex items-center gap-4 text-orange-500">
            <MoreHorizontal className="size-6" />
         </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto">
         <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm">
            {savedNotes.length === 0 && (
                <div className="p-4 text-center text-gray-400">No notes</div>
            )}
            {savedNotes.map((n, i) => (
                <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <h4 className="font-bold mb-1 truncate">{n.split('\n')[0]}</h4>
                    <p className="text-gray-500 text-sm truncate">{n}</p>
                </div>
            ))}
         </div>
      </div>

      {/* Editor/Footer */}
      <div className="bg-white dark:bg-[#1C1C1E] p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4">
         <input 
            className="flex-1 bg-gray-100 dark:bg-[#2C2C2E] rounded-full px-4 py-2 focus:outline-none"
            placeholder="Type a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
         />
         <button title="save" onClick={handleSave}>
             <SquarePen className="size-7 text-orange-500" />
         </button>
      </div>
    </div>
  );
}
