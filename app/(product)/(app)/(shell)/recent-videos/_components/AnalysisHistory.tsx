"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import type { AnalysisHistoryItem } from "@/lib/web/dashboard-types";
import { cn } from "@/lib/utils";
import { Card } from "../../dashboard/_components/ui/Card";
import { DurationBadge } from "../../dashboard/_components/ui/DurationBadge";

const PAGE_SIZE = 5;

const DATE_RANGES = [
  { id: "all", label: "All time", days: Infinity },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
] as const;

type RangeId = (typeof DATE_RANGES)[number]["id"];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

function StatusBadge({ status }: { status: AnalysisHistoryItem["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Completed
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
      Failed
    </span>
  );
}

function HistoryRow({ item }: { item: AnalysisHistoryItem }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6 sm:px-5">
      {/* Video thumbnail */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-dash bg-dash-border sm:w-40">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white">
            <Play className="h-4 w-4 translate-x-0.5 fill-current" aria-hidden="true" />
          </span>
        </span>
        <DurationBadge duration={item.duration} />
      </div>

      {/* Title & notes */}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-dash-ink">
          {item.title}
        </h3>
        <p className="mt-1 truncate text-sm text-dash-muted">{item.note}</p>
        <div className="mt-2">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Analyzed on */}
      <div className="text-sm sm:text-right">
        <p className="font-medium text-dash-ink">{formatDate(item.date)}</p>
        <p className="mt-0.5 text-xs text-dash-muted">{item.time}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:justify-end">
        <button
          type="button"
          aria-label={`Open report for ${item.title}`}
          className="rounded-lg p-2 text-dash-brand transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Delete analysis for ${item.title}`}
          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function AnalysisHistory({ items }: { items: AnalysisHistoryItem[] }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeId>("all");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Use the newest item's date as "today" so demo data stays in-range.
  const referenceDate = useMemo(() => {
    return items.reduce((max, i) => (i.date > max ? i.date : max), "");
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = DATE_RANGES.find((r) => r.id === range);
    const cutoff =
      selected && Number.isFinite(selected.days)
        ? new Date(
            new Date(referenceDate).getTime() -
              selected.days * 24 * 60 * 60 * 1000,
          )
        : null;

    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);
      const matchesRange = !cutoff || new Date(item.date) >= cutoff;
      return matchesQuery && matchesRange;
    });
  }, [items, query, range, referenceDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const rangeLabel = DATE_RANGES.find((r) => r.id === range)?.label ?? "All time";

  return (
    <div className="space-y-5">
      {/* Search + date filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted"
            aria-hidden="true"
          />
          <label htmlFor="analysis-search" className="sr-only">
            Search analysis by title or keyword
          </label>
          <input
            id="analysis-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search analysis by title or keyword"
            className="w-full rounded-xl border border-dash-border bg-dash-surface py-3 pl-11 pr-4 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
          />
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setRangeOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={rangeOpen}
            className="inline-flex w-full items-center gap-2 rounded-xl border border-dash-border bg-dash-surface px-4 py-3 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand sm:w-44"
          >
            <CalendarDays className="h-4 w-4 text-dash-muted" aria-hidden="true" />
            <span className="flex-1 text-left">{rangeLabel}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-dash-muted transition-transform",
                rangeOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {rangeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setRangeOpen(false)}
              />
              <ul
                role="listbox"
                aria-label="Date range"
                className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-dash-border bg-dash-surface py-1 shadow-dash-md"
              >
                {DATE_RANGES.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={range === r.id}
                      onClick={() => {
                        setRange(r.id);
                        setRangeOpen(false);
                        setPage(1);
                      }}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-dash-bg",
                        range === r.id
                          ? "font-semibold text-dash-brand"
                          : "text-dash-ink",
                      )}
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {/* Column headers (desktop) */}
        <div className="hidden border-b border-dash-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-dash-muted sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6">
          <span className="w-40">Video</span>
          <span>Title &amp; notes</span>
          <span className="text-right">Analyzed on</span>
          <span className="text-right">Action</span>
        </div>

        {pageItems.length > 0 ? (
          <div className="divide-y divide-dash-border">
            {pageItems.map((item) => (
              <HistoryRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-medium text-dash-ink">No analyses found</p>
            <p className="mt-1 text-sm text-dash-muted">
              Try a different search term or date range.
            </p>
          </div>
        )}
      </Card>

      {/* Footer: count + pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-dash-muted">
            Showing {start + 1} to {start + pageItems.length} of{" "}
            {filtered.length} results
          </p>

          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-dash-border bg-dash-surface text-dash-ink transition-colors hover:bg-dash-bg disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand",
                  p === currentPage
                    ? "bg-dash-brand text-white shadow-dash"
                    : "border border-dash-border bg-dash-surface text-dash-ink hover:bg-dash-bg",
                )}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-dash-border bg-dash-surface text-dash-ink transition-colors hover:bg-dash-bg disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
