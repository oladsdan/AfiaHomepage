"use client";

import Image from "next/image";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export function TopBar({
  greetingName,
  title,
  userAvatar,
  onOpenSidebar,
}: {
  greetingName?: string;
  title?: string;
  userAvatar: string;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-dash-border bg-dash-surface px-4 py-3 sm:px-6 lg:gap-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open menu"
        className="rounded-lg p-2 text-dash-ink hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <h1 className="flex shrink-0 items-center gap-1.5 text-lg font-bold text-dash-ink sm:text-xl">
        {title ? (
          title
        ) : (
          <>
            Hey {greetingName}
            <span aria-hidden="true">👋</span>
          </>
        )}
      </h1>

      <div className="relative ml-auto hidden max-w-md flex-1 md:block lg:mx-auto">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted"
          aria-hidden="true"
        />
        <label htmlFor="dash-search" className="sr-only">
          Search
        </label>
        <input
          id="dash-search"
          type="search"
          placeholder="Search anything..."
          className="w-full rounded-xl border border-dash-border bg-dash-bg py-2.5 pl-10 pr-12 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-dash-border bg-white px-1.5 py-0.5 text-[11px] font-medium text-dash-muted lg:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-dash-ink hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-1.5 rounded-full p-0.5 hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <Image
            src={userAvatar}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <ChevronDown
            className="hidden h-4 w-4 text-dash-muted sm:block"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
