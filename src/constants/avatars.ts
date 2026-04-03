/**
 * Preset avatar options for the profile avatar picker.
 * Images are stored in /public/avatars/ — single source of truth.
 * To add more avatars, simply add more entries to this array.
 */

export interface PresetAvatar {
  id: string;
  src: string;
  label: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: "avatar-1", src: "/avatars/avatar-1.png", label: "Dark Bun" },
  { id: "avatar-2", src: "/avatars/avatar-2.png", label: "Curly Afro" },
  { id: "avatar-3", src: "/avatars/avatar-3.png", label: "Hijab" },
  { id: "avatar-4", src: "/avatars/avatar-4.png", label: "Short Blonde" },
  { id: "avatar-5", src: "/avatars/avatar-5.png", label: "Long Brown" },
  { id: "avatar-6", src: "/avatars/avatar-6.png", label: "Glasses" },
  { id: "avatar-7", src: "/avatars/avatar-7.png", label: "Braids" },
  { id: "avatar-8", src: "/avatars/avatar-8.png", label: "Red Hair" },
];
