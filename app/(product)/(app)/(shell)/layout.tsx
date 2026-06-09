"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { userAvatar } from "@/lib/web/dashboard-data";
import { Shell } from "./dashboard/_components/layout/Shell";

function firstName(fullName: string | null, email: string): string {
  if (fullName && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }
  const handle = email.split("@")[0];
  return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : "there";
}

const PAGE_TITLES: Record<string, string> = {
  "/ai-chat": "AI coach",
  "/video-analyzer": "Video analyzer",
  "/caption-generator": "Caption generator",
  "/script-generator": "Script generator",
  "/content-ideas": "Content Ideas & Hooks",
  "/recent-videos": "Analysis history",
  "/settings": "Profile",
};

export default function ShellLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const name = user ? firstName(user.fullName, user.email) : "there";
  const displayName = user?.fullName?.trim() || name;
  const isDashboard = pathname === "/dashboard";

  return (
    <Shell
      greetingName={isDashboard ? name : undefined}
      title={isDashboard ? undefined : PAGE_TITLES[pathname]}
      userName={displayName}
      userAvatar={userAvatar}
    >
      {children}
    </Shell>
  );
}
