import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { AdminUserDetail } from "@/lib/types/admin";
import { afiaAdmin, AfiaAdminError } from "@/lib/afiaAdminClient";
import { UserProfileCard } from "../../components/UserProfileCard";
import { SocialProfilesCard } from "../../components/SocialProfilesCard";
import { UsageCountersCard } from "../../components/UsageCountersCard";
import { OnboardingCard } from "../../components/OnboardingCard";
import { DeleteUserButton } from "../../components/DeleteUserButton";

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let user: AdminUserDetail | null = null;
  let errorMsg: string | null = null;

  try {
    user = await afiaAdmin.getUser(params.id);
  } catch (e) {
    errorMsg =
      e instanceof AfiaAdminError
        ? e.status === 404
          ? "User not found."
          : e.status === 503
          ? "Admin API key not configured — set AFIA_ADMIN_API_KEY in Replit Secrets."
          : e.status === 429
          ? "Rate limited — wait a moment then refresh the page."
          : e.message
        : "Failed to load user";
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
      </div>

      {errorMsg && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          {errorMsg}
        </div>
      )}

      {user && (
        <div className="space-y-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <UserProfileCard user={user} />
            </div>
            <div className="flex-shrink-0 pt-1">
              <DeleteUserButton userId={user.id} userEmail={user.email} />
            </div>
          </div>

          <UsageCountersCard user={user} />

          {user.creator?.socialProfiles?.length ? (
            <SocialProfilesCard profiles={user.creator.socialProfiles} />
          ) : null}

          <OnboardingCard onboarding={user.onboarding} />
        </div>
      )}
    </div>
  );
}
