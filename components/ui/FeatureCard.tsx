import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  iconBgColor = "bg-teal-50",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
