"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { adminFetch } from "../lib/adminFetch";
import { toast } from "../lib/toast";

interface BlockUserModalProps {
  open: boolean;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onBlocked?: () => void;
}

export function BlockUserModal({
  open,
  userId,
  userEmail,
  onClose,
  onBlocked,
}: BlockUserModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBlocked: true,
          reason: reason.trim() || undefined,
        }),
      });
      toast(`Blocked ${userEmail}`, "success");
      setReason("");
      onBlocked?.();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Block failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Ban className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg">Block user</h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Why is this user being blocked?"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Block user
          </button>
        </div>
      </div>
    </div>
  );
}
