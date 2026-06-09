"use client";

export type Granularity = "day" | "week" | "month";

const OPTIONS: Array<{ value: Granularity; label: string }> = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

interface GranularityToggleProps {
  value: Granularity;
  onChange: (g: Granularity) => void;
  disabled?: boolean;
}

export function GranularityToggle({
  value,
  onChange,
  disabled,
}: GranularityToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-gray-50 border border-gray-100">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
              active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            } ${disabled && !active ? "opacity-50" : ""}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
