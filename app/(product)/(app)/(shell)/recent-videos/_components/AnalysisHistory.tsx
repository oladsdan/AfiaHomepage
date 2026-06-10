"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  deleteAnalysis,
  getVideoHistory,
  resolveMediaUrl,
} from "@/lib/web/ai/videos-api";
import type { AnalysisHistoryEntry } from "@/lib/web/ai/types";
import { toast } from "@/lib/web/toast";
import { Card } from "../../dashboard/_components/ui/Card";

const PAGE_SIZE = 5;

export const HISTORY_QUERY_KEY = ["/api/videos/history"] as const;

const DATE_RANGES = [
  { id: "all", label: "All time", days: Infinity },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
] as const;

type RangeId = (typeof DATE_RANGES)[number]["id"];

type ItemStatus = "completed" | "processing" | "failed";

/** Normalized history row (server entries are tolerated loosely). */
interface HistoryItem {
  id: string;
  title: string;
  note: string;
  thumbnailUrl: string | null;
  status: ItemStatus;
  /** Epoch ms for sorting/filtering; null when the server sent no date. */
  timestamp: number | null;
  dateLabel: string;
  timeLabel: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function normalizeStatus(entry: AnalysisHistoryEntry): ItemStatus {
  const rawStatus = entry.analysisStatus || entry.status;
  const raw = typeof rawStatus === "string" ? rawStatus.toLowerCase() : "";
  if (
    raw.indexOf("pend") >= 0 ||
    raw.indexOf("process") >= 0 ||
    raw.indexOf("progress") >= 0 ||
    raw.indexOf("queue") >= 0
  ) {
    return "processing";
  }
  if (raw.indexOf("fail") >= 0 || raw.indexOf("error") >= 0) return "failed";
  if (
    raw.indexOf("complet") >= 0 ||
    raw.indexOf("done") >= 0 ||
    raw.indexOf("success") >= 0
  ) {
    return "completed";
  }
  // Unknown status: treat scored entries as completed, the rest as in-flight.
  return typeof entry.overallScore === "number" ? "completed" : "processing";
}

function normalizeEntry(entry: AnalysisHistoryEntry): HistoryItem {
  const status = normalizeStatus(entry);

  const title =
    entry.videoTitle || entry.fileName || entry.title || "Untitled video";

  const noteParts: string[] = [];
  if (typeof entry.overallScore === "number") {
    noteParts.push(`Score ${entry.overallScore}/100`);
  }
  if (entry.scoreLabel) noteParts.push(entry.scoreLabel);
  if (typeof entry.revisionNumber === "number" && entry.revisionNumber > 0) {
    noteParts.push(`Revision #${entry.revisionNumber}`);
  }
  let note = noteParts.join(" · ");
  if (!note) {
    note =
      status === "processing"
        ? "Analysis in progress…"
        : status === "failed"
          ? "Analysis failed"
          : "Video analysis";
  }

  const rawDate = entry.createdAt || entry.analyzedAt;
  let timestamp: number | null = null;
  let dateLabel = "—";
  let timeLabel = "";
  if (typeof rawDate === "string" && rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      timestamp = parsed.getTime();
      dateLabel = `${MONTHS[parsed.getMonth()]} ${parsed.getDate()}, ${parsed.getFullYear()}`;
      const hours24 = parsed.getHours();
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
      const minutes = parsed.getMinutes();
      timeLabel = `${hours12}:${minutes < 10 ? "0" : ""}${minutes} ${hours24 >= 12 ? "PM" : "AM"}`;
    }
  }

  return {
    id: entry.id,
    title,
    note,
    thumbnailUrl: resolveMediaUrl(entry.thumbnailUrl),
    status,
    timestamp,
    dateLabel,
    timeLabel,
  };
}

function StatusBadge({ status }: { status: ItemStatus }) {
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

function HistoryRow({
  item,
  confirmingDelete,
  deleting,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  item: HistoryItem;
  confirmingDelete: boolean;
  deleting: boolean;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6 sm:px-5">
      {/* Video thumbnail */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-dash bg-dash-border sm:w-40">
        {item.thumbnailUrl ? (
          <>
            {/* Remote thumbnail host isn't configured for next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white">
                <Play
                  className="h-4 w-4 translate-x-0.5 fill-current"
                  aria-hidden="true"
                />
              </span>
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-dash-bg text-dash-muted">
            <Video className="h-7 w-7" aria-hidden="true" />
          </span>
        )}
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
        <p className="font-medium text-dash-ink">{item.dateLabel}</p>
        {item.timeLabel && (
          <p className="mt-0.5 text-xs text-dash-muted">{item.timeLabel}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:justify-end">
        {confirmingDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dash-muted">
              Delete?
            </span>
            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={deleting}
              aria-label={`Confirm delete analysis for ${item.title}`}
              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Yes
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              disabled={deleting}
              aria-label="Cancel delete"
              className="rounded-lg border border-dash-border bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <Link
              href={`/video-analyzer/analysis/${item.id}`}
              aria-label={`Open report for ${item.title}`}
              className="rounded-lg p-2 text-dash-brand transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={onRequestDelete}
              aria-label={`Delete analysis for ${item.title}`}
              className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <Card className="overflow-hidden" aria-hidden="true">
      <div className="divide-y divide-dash-border">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-4 px-4 py-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:px-5"
          >
            <div className="aspect-video w-full rounded-dash bg-dash-bg sm:w-40" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-dash-bg" />
              <div className="h-3 w-1/3 rounded bg-dash-bg" />
              <div className="h-5 w-24 rounded-full bg-dash-bg" />
            </div>
            <div className="h-4 w-24 rounded bg-dash-bg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AnalysisHistory() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeId>("all");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: getVideoHistory,
  });

  const remove = useAiMutation<void, string>({
    mutationFn: deleteAnalysis,
    onSuccess: () => {
      toast("Analysis deleted", "success");
      setConfirmId(null);
      void queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });

  const items = useMemo(() => {
    const entries = historyQuery.data ?? [];
    return entries
      .map(normalizeEntry)
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  }, [historyQuery.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = DATE_RANGES.find((r) => r.id === range);
    const cutoff =
      selected && Number.isFinite(selected.days)
        ? Date.now() - selected.days * 24 * 60 * 60 * 1000
        : null;

    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().indexOf(q) >= 0 ||
        item.note.toLowerCase().indexOf(q) >= 0;
      const matchesRange =
        cutoff === null || (item.timestamp !== null && item.timestamp >= cutoff);
      return matchesQuery && matchesRange;
    });
  }, [items, query, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const rangeLabel = DATE_RANGES.find((r) => r.id === range)?.label ?? "All time";

  // ---- Loading / error / empty states --------------------------------------
  if (historyQuery.isPending) {
    return <HistorySkeleton />;
  }

  if (historyQuery.isError) {
    const message =
      historyQuery.error instanceof Error && historyQuery.error.message
        ? historyQuery.error.message
        : "Couldn't load your analysis history.";
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <CircleAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-dash-ink">
            Couldn&apos;t load history
          </p>
          <p className="mt-1 text-sm text-dash-muted">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => void historyQuery.refetch()}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dash-brand/10 text-dash-brand">
          <Video className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-dash-ink">No analyses yet</p>
          <p className="mt-1 text-sm text-dash-muted">
            Upload your first video to get AI-powered insights.
          </p>
        </div>
        <Link
          href="/video-analyzer"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Analyze a video
        </Link>
      </Card>
    );
  }

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
              <HistoryRow
                key={item.id}
                item={item}
                confirmingDelete={confirmId === item.id}
                deleting={remove.isPending && confirmId === item.id}
                onRequestDelete={() => setConfirmId(item.id)}
                onConfirmDelete={() => remove.mutate(item.id)}
                onCancelDelete={() => setConfirmId(null)}
              />
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
