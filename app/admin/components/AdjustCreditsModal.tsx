"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import { adminFetch } from "../lib/adminFetch";
import { toast } from "../lib/toast";

interface AdjustCreditsModalProps {
  open: boolean;
  userId: string;
  userEmail: string;
  onClose: () => void;
}

export function AdjustCreditsModal({
  open,
  userId,
  userEmail,
  onClose,
}: AdjustCreditsModalProps) {
  const [amount, setAmount] = useState<string>("1");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setAmount("1");
    setReason("");
    setError(null);
  };

  const handleCancel = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed === 0) {
      setError("Amount must be a non-zero integer (e.g. 5 or -3)");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await adminFetch(
        `/api/admin/users/${userId}/credits`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parsed,
            reason: reason.trim() || undefined,
          }),
        },
      );

      const signed = `${parsed > 0 ? "+" : ""}${parsed}`;
      toast(`Credits adjusted: ${signed}`, "success");
      reset();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Adjust failed");
    } finally {
      setLoading(false);
    }
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
          <div className="w-10 h-10 rounded-full bg-[#0FA37F]/10 flex items-center justify-center flex-shrink-0">
            <Coins className="w-5 h-5 text-[#0FA37F]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg">Adjust credits</h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Amount
            </label>
            <input
              type="number"
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0FA37F]/30 focus:border-[#0FA37F]"
            />
            <p className="mt-1 text-xs text-gray-400">
              Use a negative number to remove credits.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Why is this adjustment being made?"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0FA37F]/30 focus:border-[#0FA37F] resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
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
            className="px-4 py-2 text-sm font-medium text-white bg-[#0FA37F] rounded-xl hover:bg-[#0c8267] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
