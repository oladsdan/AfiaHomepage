"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { InspirationVideo, InspirationVideoPayload, VideoPlatform, VideoCategory } from "@/lib/types/admin";
import { adminFetch } from "../lib/adminFetch";

const PLATFORMS: VideoPlatform[] = ["TIKTOK", "INSTAGRAM", "YOUTUBE"];
const CATEGORIES: VideoCategory[] = ["HOOKS", "STORYTELLING", "TRANSITIONS", "CTAS", "TRENDS"];

interface InspirationVideoModalProps {
  open: boolean;
  video?: InspirationVideo | null;
  onClose: () => void;
  onSaved: (video: InspirationVideo) => void;
}

const empty: InspirationVideoPayload = {
  platform: "TIKTOK",
  sourceUrl: "",
  thumbnailUrl: "",
  creatorHandle: "",
  label: "",
  category: "HOOKS",
  tags: [],
  displayOrder: 0,
  isPublished: false,
};

export function InspirationVideoModal({ open, video, onClose, onSaved }: InspirationVideoModalProps) {
  const [form, setForm] = useState<InspirationVideoPayload>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const isEdit = !!video;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (video) {
      setForm({
        platform: video.platform,
        sourceUrl: video.sourceUrl,
        thumbnailUrl: video.thumbnailUrl,
        creatorHandle: video.creatorHandle,
        label: video.label,
        category: video.category,
        tags: video.tags ?? [],
        displayOrder: video.displayOrder,
        isPublished: video.isPublished,
      });
      setTagsInput((video.tags ?? []).join(", "));
    } else {
      setForm(empty);
      setTagsInput("");
    }
    setError(null);
    setCooldown(0);
  }, [video, open]);

  const set = <K extends keyof InspirationVideoPayload>(key: K, val: InspirationVideoPayload[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const url = isEdit
        ? `/api/admin/inspiration-videos/${video!.id}`
        : "/api/admin/inspiration-videos";
      const method = isEdit ? "PATCH" : "POST";
      const saved = await adminFetch<InspirationVideo>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSaved(saved);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "retryAfterSeconds" in e) {
        const err = e as { retryAfterSeconds?: number };
        if (err.retryAfterSeconds) setCooldown(err.retryAfterSeconds);
      }
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0FA37F]/30 focus:border-[#0FA37F] bg-white";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit video" : "Add inspiration video"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center justify-between gap-3">
              <span>{error}</span>
              {cooldown > 0 && (
                <span className="text-xs text-amber-600 font-medium flex-shrink-0">
                  Wait {cooldown}s
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Platform *</label>
              <select value={form.platform} onChange={(e) => set("platform", e.target.value as VideoPlatform)} className={inputCls}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value as VideoCategory)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Label *</label>
            <input required value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. Strong hook example" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Creator Handle *</label>
            <input required value={form.creatorHandle} onChange={(e) => set("creatorHandle", e.target.value)} placeholder="@handle" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Source URL *</label>
            <input required type="url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://..." className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Thumbnail URL *</label>
            <input required type="url" value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://..." className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" value={form.displayOrder ?? 0} onChange={(e) => set("displayOrder", Number(e.target.value))} className={inputCls} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished ?? false}
                  onChange={(e) => set("isPublished", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0FA37F]"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="hook, trending, beauty" className={inputCls} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-[#0FA37F] rounded-xl hover:bg-[#0c8267] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {cooldown > 0 ? `Wait ${cooldown}s` : isEdit ? "Save changes" : "Create video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
