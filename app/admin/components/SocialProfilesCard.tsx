import { Users, TrendingUp, Clock } from "lucide-react";
import type { SocialProfile } from "@/lib/types/admin";

interface SocialProfilesCardProps {
  profiles: SocialProfile[];
}

const platformColors: Record<string, string> = {
  TIKTOK: "bg-black text-white",
  INSTAGRAM: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
};

export function SocialProfilesCard({ profiles }: SocialProfilesCardProps) {
  if (!profiles.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Connected Socials</h3>
        <p className="text-sm text-gray-400">No social accounts connected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Connected Socials</h3>
      <div className="space-y-4">
        {profiles.map((p) => (
          <div key={p.platform} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${platformColors[p.platform] ?? "bg-gray-200 text-gray-700"}`}>
              {p.platform}
            </span>
            <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Handle</p>
                <p className="font-medium text-gray-800">@{p.username ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />Followers</p>
                <p className="font-medium text-gray-800">{p.followers?.toLocaleString() ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Eng. Rate</p>
                <p className="font-medium text-gray-800">{p.engagementRate != null ? `${p.engagementRate.toFixed(2)}%` : "—"}</p>
              </div>
              {p.lastSyncAt && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last sync: {new Date(p.lastSyncAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
