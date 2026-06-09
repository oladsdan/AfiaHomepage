import { CheckCircle, Clock } from "lucide-react";
import type { AdminUserDetail } from "@/lib/types/admin";

interface OnboardingCardProps {
  onboarding: AdminUserDetail["onboarding"];
}

function formatValue(val: unknown): string {
  if (val == null) return "—";
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

export function OnboardingCard({ onboarding }: OnboardingCardProps) {
  if (!onboarding) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Onboarding</h3>
        <p className="text-sm text-gray-400">Not completed.</p>
      </div>
    );
  }

  const fields = [
    { label: "Audience", value: onboarding.audience },
    { label: "Goals", value: onboarding.goals },
    { label: "Content Topics", value: onboarding.contentTopics },
    { label: "Experience Level", value: onboarding.experienceLevel },
    { label: "Social Accounts", value: onboarding.socialAccounts },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-700">Onboarding</h3>
        {onboarding.completedAt ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" /> Incomplete
          </span>
        )}
      </div>
      <div className="space-y-3">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex gap-3">
            <span className="text-xs text-gray-400 w-32 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-gray-700 flex-1">{formatValue(value)}</span>
          </div>
        ))}
      </div>
      {onboarding.completedAt && (
        <p className="mt-4 text-xs text-gray-400">
          Completed {new Date(onboarding.completedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
