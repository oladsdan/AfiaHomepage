"use client";

import { useRef, useState, type DragEvent } from "react";
import { Plus, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadCard() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File | null) => {
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <section
      aria-label="Upload video"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="rounded-dash-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-dash-md sm:p-6"
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-dash border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-white bg-white/10" : "border-white/40",
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">
          <UploadCloud className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-white">Upload video</h2>
        <p className="mt-1 text-sm text-white/80">
          Drag &amp; drop a video here, or click to browse
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Select video
        </button>
        {fileName ? (
          <p className="mt-4 text-xs font-medium text-white">
            Selected: {fileName}
          </p>
        ) : (
          <p className="mt-4 text-[11px] text-white/70">
            MP4, MOV, WEBM up to 2GB
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="sr-only"
          aria-label="Upload video"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </section>
  );
}
