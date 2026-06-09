"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import Link from "next/link";
import { Check, PlaySquare, UploadCloud } from "lucide-react";
import { analyzerPerks } from "@/lib/web/dashboard-data";
import { cn } from "@/lib/utils";

const sectionClasses =
  "relative overflow-hidden rounded-dash-lg bg-gradient-to-br from-dash-hero-from via-dash-hero-via to-dash-hero-to p-6 sm:p-8";

function Backgrounds() {
  return (
    <>
      <img
        src="/dash/spiral-background.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-12 w-[26rem] max-w-[70%] select-none opacity-20"
      />
      <img
        src="/dash/doodles.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-5 w-24 select-none opacity-50"
      />
    </>
  );
}

function Info() {
  return (
    <div>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
        <PlaySquare className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-2xl font-bold text-white">Video analyzer</h2>
      <p className="mt-1 text-sm text-white/80">
        Upload a video and get all-around feedback
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {analyzerPerks.map((perk) => (
          <li
            key={perk.id}
            className="flex items-center gap-2 text-sm text-white/90"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Check className="h-3 w-3 text-white" aria-hidden="true" />
            </span>
            {perk.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
      <Info />
      {children}
    </div>
  );
}

export function AnalyzerHero({
  href,
  onFile,
}: {
  href?: string;
  onFile?: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Open Video analyzer"
        className={cn(
          sectionClasses,
          "block transition-shadow hover:shadow-dash-md focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
        )}
      >
        <Backgrounds />
        <Layout>
          <div className="flex flex-col items-center justify-center rounded-dash border-2 border-dashed border-white/35 bg-white/5 px-6 py-10 text-center">
            <UploadCloud className="h-9 w-9 text-white" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-white">Upload video</p>
            <p className="mt-1 text-xs text-white/75">
              Drag &amp; drop a file here, or click to browse
            </p>
            <p className="mt-3 text-[11px] text-white/60">
              MP4, MOV, WEBM up to 2GB
            </p>
          </div>
        </Layout>
      </Link>
    );
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile?.(file);
  };

  return (
    <section aria-label="Video analyzer" className={sectionClasses}>
      <Backgrounds />
      <Layout>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-dash border-2 border-dashed px-6 py-10 text-center transition-colors",
            dragging ? "border-white bg-white/15" : "border-white/35 bg-white/5",
          )}
        >
          <UploadCloud className="h-9 w-9 text-white" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-white">Upload video</p>
          <p className="mt-1 text-xs text-white/75">Drag &amp; drop a file here</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 rounded text-xs font-medium text-white underline underline-offset-2 hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            or click to browse
          </button>
          <p className="mt-3 text-[11px] text-white/60">MP4, MOV, WEBM up to 2GB</p>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="sr-only"
            aria-label="Upload video"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile?.(file);
            }}
          />
        </div>
      </Layout>
    </section>
  );
}
