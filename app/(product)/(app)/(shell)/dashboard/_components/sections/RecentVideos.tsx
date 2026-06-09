"use client";

import Image from "next/image";
import { ChevronRight, MoreVertical } from "lucide-react";
import type { VideoItem } from "@/lib/web/dashboard-types";
import { recentVideos } from "@/lib/web/dashboard-data";
import { DurationBadge } from "../ui/DurationBadge";

function VideoTile({ video }: { video: VideoItem }) {
  return (
    <article className="group">
      <div className="relative aspect-video overflow-hidden rounded-dash bg-dash-border">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <DurationBadge duration={video.duration} />
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-dash-ink">
            {video.title}
          </h3>
          <p className="mt-0.5 text-xs text-dash-muted">
            {video.views} · {video.timeAgo}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Options for ${video.title}`}
          className="shrink-0 rounded-lg p-1 text-dash-muted hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export function RecentVideos() {
  return (
    <section aria-label="Recent videos">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dash-ink">Recent videos</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          See all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recentVideos.map((video) => (
          <VideoTile key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
