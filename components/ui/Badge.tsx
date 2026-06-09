import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "teal" | "white";
}

export function Badge({ children, className, variant = "teal" }: BadgeProps) {
  const variants = {
    teal: "bg-[#0FA37F] text-white",
    white: "bg-white text-[#0FA37F]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
