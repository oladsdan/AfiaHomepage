"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import type { NavLink } from "@/lib/web/dashboard-types";
import { primaryNav, secondaryNav } from "@/lib/web/dashboard-data";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { cn } from "@/lib/utils";

function NavItem({ link }: { link: NavLink }) {
  const Icon = link.icon;
  const pathname = usePathname();
  const active = link.href ? pathname === link.href : false;

  const classes = cn(
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 focus-visible:ring-offset-dash-sidebar",
    active
      ? "bg-dash-brand text-white shadow-dash-md"
      : "text-dash-sidebar-muted hover:bg-dash-sidebar-hover hover:text-white",
  );

  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{link.label}</span>
    </>
  );

  if (link.href) {
    return (
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {content}
    </button>
  );
}

function UserMenu({
  userName,
  userAvatar,
}: {
  userName: string;
  userAvatar: string;
}) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointer = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setOpen(false);
    await logout();
  };

  return (
    <div ref={containerRef} className="relative">
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-white/10 bg-dash-sidebar-hover shadow-dash-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex w-full items-center gap-3 rounded-xl bg-dash-sidebar-hover px-3 py-2.5 text-left transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <Image
          src={userAvatar}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">
            {userName}
          </span>
          <span className="block text-xs text-dash-sidebar-muted">Creator</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-dash-sidebar-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function Sidebar({
  userName,
  userAvatar,
}: {
  userName: string;
  userAvatar: string;
}) {
  return (
    <div className="flex h-full flex-col bg-dash-sidebar">
      <div className="flex items-center gap-2 px-6 py-6">
        <Image
          src="/afia-icon.png"
          alt="Afia logo"
          width={36}
          height={36}
          className="h-9 w-9 rounded-xl"
        />
        <span className="text-xl font-bold text-white">afia</span>
      </div>

      <nav
        aria-label="Primary"
        className="flex-1 space-y-1 overflow-y-auto px-4 scrollbar-hide"
      >
        {primaryNav.map((link) => (
          <NavItem key={link.id} link={link} />
        ))}

        <div className="my-3 border-t border-white/10" />

        {secondaryNav.map((link) => (
          <NavItem key={link.id} link={link} />
        ))}
      </nav>

      <div className="p-4">
        <UserMenu userName={userName} userAvatar={userAvatar} />
      </div>
    </div>
  );
}
