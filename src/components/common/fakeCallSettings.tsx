import { useState } from "react";

export default function FakeCallSettings({
  onSave,
}: {
  onSave: (settings: { name: string; photo: string; ringtone: string; voice: string }) => void;
}) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("/fake-photo.jpg");
  const [ringtone, setRingtone] = useState("/fake-ring.mp3");
  const [voice, setVoice] = useState("/fake-voice.mp3");

  const handleSubmit = () => {
    onSave({ name, photo, ringtone, voice });
  };
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Fake Call Settings</h2>

      <label className="block mb-2">Caller Name</label>
      <input
        type="text"
        className="w-full border px-2 py-1 rounded mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        title="Caller Name"
        placeholder="Enter caller name"
      />

      <label className="block mb-2">Photo URL</label>
      <input
        type="text"
        className="w-full border px-2 py-1 rounded mb-4"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        title="Photo URL"
        placeholder="Enter photo URL"
      />

      <label className="block mb-2">Ringtone</label>
      <select
        className="w-full mb-4"
        value={ringtone}
        onChange={(e) => setRingtone(e.target.value)}
        title="Ringtone"
      >
        <option value="/fake-ring.mp3">Classic</option>
        <option value="/ring2.mp3">iPhone</option>
        <option value="/ring3.mp3">Android</option>
      </select>

      <label className="block mb-2">Voice Script</label>
      <select
        className="w-full mb-4"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        title="Voice Script"
      >
        <option value="/voice1.mp3">Mom: &quot;Hey, where are you?&quot;</option>
        <option value="/voice2.mp3">Boss: &quot;We need you back at work!&quot;</option>
        <option value="/voice3.mp3">Friend: &quot;Let’s meet up now.&quot;</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded mt-4 w-full"
      >
        Save Changes
      </button>
    </div>
  );
}
