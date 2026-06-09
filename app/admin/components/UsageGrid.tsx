import { Video, Type, FileText, Lightbulb, MessageCircle } from "lucide-react";

interface UsageGridProps {
  usage: {
    videoAnalyses: number;
    captionGenerations: number;
    scriptGenerations: number;
    ideaGenerations: number;
    coachMessages: number;
  };
}

const items = [
  { key: "videoAnalyses", label: "Video Analyses", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "captionGenerations", label: "Captions Generated", icon: Type, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "scriptGenerations", label: "Scripts Generated", icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
  { key: "ideaGenerations", label: "Ideas Generated", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50" },
  { key: "coachMessages", label: "Coach Messages", icon: MessageCircle, color: "text-teal-500", bg: "bg-teal-50" },
] as const;

export function UsageGrid({ usage }: UsageGridProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-5">All-Time Usage</h2>
      <div className="space-y-4">
        {items.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {usage[key].toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
