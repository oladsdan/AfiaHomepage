"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { InspirationVideo } from "@/lib/types/admin";
import { adminFetch, AdminFetchError } from "../lib/adminFetch";
import { InspirationVideoModal } from "./InspirationVideoModal";
import { ConfirmModal } from "./ConfirmModal";

const platformColors: Record<string, string> = {
  TIKTOK: "bg-black text-white",
  INSTAGRAM: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
  YOUTUBE: "bg-red-500 text-white",
};

const categoryColors: Record<string, string> = {
  HOOKS: "bg-purple-50 text-purple-700",
  STORYTELLING: "bg-blue-50 text-blue-700",
  TRANSITIONS: "bg-orange-50 text-orange-700",
  CTAS: "bg-green-50 text-green-700",
  TRENDS: "bg-pink-50 text-pink-700",
};

export function InspirationVideosTable() {
  const [videos, setVideos] = useState<InspirationVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<InspirationVideo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InspirationVideo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<{ videos: InspirationVideo[] }>(
        "/api/admin/inspiration-videos"
      );
      setVideos(data.videos);
    } catch (e: unknown) {
      if (e instanceof AdminFetchError && e.retryAfterSeconds) {
        setCooldown(e.retryAfterSeconds);
      }
      setError(e instanceof Error ? e.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (video: InspirationVideo) => {
    setVideos((prev) => {
      const idx = prev.findIndex((v) => v.id === video.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = video;
        return next;
      }
      return [video, ...prev];
    });
    setModalOpen(false);
    setEditVideo(null);
  };

  const handleTogglePublish = async (video: InspirationVideo) => {
    try {
      const updated = await adminFetch<InspirationVideo>(
        `/api/admin/inspiration-videos/${video.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !video.isPublished }),
        }
      );
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
    } catch {
      /* toast already shown by adminFetch */
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/inspiration-videos/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      /* toast already shown */
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{videos.length} videos total</p>
        <button
          onClick={() => { setEditVideo(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0FA37F] rounded-xl hover:bg-[#0c8267] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add video
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center justify-between gap-4">
          <span>{error}</span>
          {cooldown > 0 ? (
            <span className="text-xs text-amber-600 font-medium flex-shrink-0">
              Retry in {cooldown}s
            </span>
          ) : (
            <button
              onClick={load}
              className="text-xs font-medium text-[#0FA37F] hover:underline flex-shrink-0"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Video</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Platform</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No inspiration videos yet
                  </td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {v.thumbnailUrl && (
                          <img
                            src={v.thumbnailUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{v.label}</p>
                          <p className="text-xs text-gray-400">@{v.creatorHandle} · order {v.displayOrder}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold ${platformColors[v.platform] ?? "bg-gray-100 text-gray-600"}`}>
                        {v.platform}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[v.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleTogglePublish(v)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          v.isPublished
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {v.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {v.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditVideo(v); setModalOpen(true); }}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#0FA37F] hover:bg-[#0FA37F]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(v)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <InspirationVideoModal
        open={modalOpen}
        video={editVideo}
        onClose={() => { setModalOpen(false); setEditVideo(null); }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete inspiration video"
        description={`Delete "${deleteTarget?.label}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
