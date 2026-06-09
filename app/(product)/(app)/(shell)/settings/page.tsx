"use client";

import { Bell, Check } from "lucide-react";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { userAvatar } from "@/lib/web/dashboard-data";
import { SettingsContent } from "./_components/SettingsContent";

function firstName(fullName: string | null, email: string): string {
  if (fullName && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }
  const handle = email.split("@")[0];
  return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : "there";
}

export default function SettingsPage() {
  const { user } = useAuth();
  const name = user ? firstName(user.fullName, user.email) : "there";
  const displayName = user?.fullName?.trim() || name;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dash-ink">Profile</h1>
          <p className="mt-1 text-sm text-dash-muted">
            Manage your account, preferences and connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-dash-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Complete your setup
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg border border-dash-border bg-dash-surface p-2.5 text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      <SettingsContent name={displayName} avatar={userAvatar} />
    </>
  );
}
