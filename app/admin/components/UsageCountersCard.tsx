import { Video, Type, FileText, Lightbulb, MessageCircle } from "lucide-react";
import type { AdminUserDetail } from "@/lib/types/admin";

interface UsageCountersCardProps {
  user: AdminUserDetail;
}

export function UsageCountersCard({ user }: UsageCountersCardProps) {
  const counters = [
    { label: "Video Analyses", value: user.videoAnalysisCount, icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Captions", value: user.captionGenerationCount, icon: Type, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Scripts", value: user.scriptGenerationCount, icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Ideas", value: user.ideaGenerationCount, icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Coach Messages", value: user.coachMessageCount, icon: MessageCircle, color: "text-teal-500", bg: "bg-teal-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">Usage Counters</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {counters.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl p-4 ${bg}`}>
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
