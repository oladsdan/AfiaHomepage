import { Crown, User, Calendar, RefreshCw } from "lucide-react";
import type { AdminUserDetail } from "@/lib/types/admin";

interface UserProfileCardProps {
  user: AdminUserDetail;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-16 h-16 object-cover" />
          ) : (
            <User className="w-7 h-7 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 font-geist">
              {user.fullName ?? "No name set"}
            </h2>
            {user.isProSubscriber ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                <Crown className="w-3 h-3" /> Pro
              </span>
            ) : (
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Free
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{user.id}</p>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-50 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs mb-1">Joined</p>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        {user.usageResetAt && (
          <div>
            <p className="text-gray-400 text-xs mb-1">Usage resets</p>
            <div className="flex items-center gap-1.5 text-gray-700">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              {new Date(user.usageResetAt).toLocaleDateString()}
            </div>
          </div>
        )}
        <div>
          <p className="text-gray-400 text-xs mb-1">Total Analyses</p>
          <p className="font-semibold text-gray-900">{user.totalAnalyses}</p>
        </div>
        {user.creator && (
          <div>
            <p className="text-gray-400 text-xs mb-1">Social Status</p>
            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {user.creator.socialAuthStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
