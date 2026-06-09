import Link from "next/link";
import { Crown, User } from "lucide-react";
import type { RecentUsersResponse } from "@/lib/types/admin";

interface RecentUsersCardProps {
  data: RecentUsersResponse | null;
  error?: string;
}

function initials(name: string | null, email: string): string {
  const src = name?.trim() || email;
  return src
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function RecentUsersCard({ data, error }: RecentUsersCardProps) {
  const users = (data?.users ?? []).slice(0, 7);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Recent Users</h2>
        <Link
          href="/admin/users"
          className="text-xs text-[#0FA37F] hover:text-[#0c8267] font-medium"
        >
          View all
        </Link>
      </div>

      {error ? (
        <div className="py-8 text-center text-sm text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">No recent users</div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                href={`/admin/users/${u.id}`}
                className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="w-9 h-9 object-cover"
                    />
                  ) : initials(u.fullName, u.email) ? (
                    <span className="text-[11px] font-semibold text-gray-500">
                      {initials(u.fullName, u.email)}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {u.fullName || u.email}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                {u.isProSubscriber ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
                    <Crown className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                    Free
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
