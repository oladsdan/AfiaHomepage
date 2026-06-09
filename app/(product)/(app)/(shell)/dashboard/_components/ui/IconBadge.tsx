import type { LucideIcon } from "lucide-react";

export function IconBadge({
  icon: Icon,
  color,
  size = "md",
}: {
  icon: LucideIcon;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg" ? "w-12 h-12" : size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize =
    size === "lg" ? "w-6 h-6" : size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${box}`}
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <Icon className={iconSize} aria-hidden="true" />
    </span>
  );
}
