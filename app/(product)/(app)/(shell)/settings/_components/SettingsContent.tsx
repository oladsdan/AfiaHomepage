"use client";

import Image from "next/image";
import { ChevronRight, Gem, HeartHandshake, Plus } from "lucide-react";
import {
  profileStats,
  connectedAccounts,
  analysisHistoryRow,
  feedbackToneRow,
  supportRow,
  type SettingsRow,
} from "@/lib/web/settings-data";
import { Card } from "../../dashboard/_components/ui/Card";
import { IconBadge } from "../../dashboard/_components/ui/IconBadge";

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-muted">{children}</h2>;
}

function ListRowCard({ row }: { row: SettingsRow }) {
  return (
    <Card className="p-1">
      <button
        type="button"
        className="flex w-full items-center gap-4 rounded-dash px-4 py-3.5 text-left transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <IconBadge icon={row.icon} color={row.color} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-dash-ink">
            {row.title}
          </span>
          <span className="mt-0.5 block text-xs text-dash-muted">
            {row.subtitle}
          </span>
        </span>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-dash-muted"
          aria-hidden="true"
        />
      </button>
    </Card>
  );
}

export function SettingsContent({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}) {
  return (
    <div className="space-y-6">
      <section
        aria-label="Profile overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Card className="flex items-center gap-3 p-4">
          <Image
            src={avatar}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dash-ink">{name}</p>
            <p className="text-xs text-dash-muted">Content Creator</p>
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-dash-muted"
            aria-hidden="true"
          />
        </Card>

        {profileStats.map((stat) => (
          <Card key={stat.id} className="flex items-center gap-3 p-4">
            <IconBadge icon={stat.icon} color={stat.color} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-dash-muted">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-dash-ink">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <div className="flex flex-col gap-4 rounded-dash bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 p-5 shadow-dash-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
            <HeartHandshake className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-bold text-white">Free plan</p>
            <p className="text-sm text-white/80">
              Limited analysis and AI coaching
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-dash-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <Gem className="h-4 w-4" aria-hidden="true" />
          Upgrade to premium
        </button>
      </div>

      <ListRowCard row={analysisHistoryRow} />

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-dash-ink">Connected Accounts</h2>
        <ul className="mt-4 space-y-3">
          {connectedAccounts.map((acct) => {
            const Icon = acct.icon;
            return (
              <li key={acct.id} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-bg"
                  style={{ color: acct.color }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-dash-ink">
                    {acct.label}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-dash-muted">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-red-500"
                      aria-hidden="true"
                    />
                    Not connected
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-dash-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Connect
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <section className="space-y-3">
        <SectionTitle>AI Coach preference</SectionTitle>
        <ListRowCard row={feedbackToneRow} />
      </section>

      <section className="space-y-3">
        <SectionTitle>Support</SectionTitle>
        <ListRowCard row={supportRow} />
      </section>
    </div>
  );
}
