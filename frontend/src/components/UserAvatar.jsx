import { getInitials } from "../utils/mappers";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-rose-600",
];

export default function UserAvatar({ name, avatarIndex = 1, size = "md" }) {
  const sizeClass =
    size === "lg" ? "w-20 h-20 text-2xl" : size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sizeClass} ${AVATAR_COLORS[(avatarIndex - 1) % AVATAR_COLORS.length]} rounded-full flex items-center justify-center text-white font-bold shrink-0 border border-white/20`}
      aria-label={`Avatar for ${name || "user"}`}
    >
      {getInitials(name)}
    </div>
  );
}
