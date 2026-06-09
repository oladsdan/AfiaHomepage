"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { adminFetch } from "../lib/adminFetch";

interface DeleteUserButtonProps {
  userId: string;
  userEmail: string;
}

export function DeleteUserButton({ userId, userEmail }: DeleteUserButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      router.push("/admin/users");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete User
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <ConfirmModal
        open={open}
        title="Delete user account"
        description={`This will permanently delete the account for ${userEmail} and all their data. This action cannot be undone.`}
        confirmLabel="Delete permanently"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
