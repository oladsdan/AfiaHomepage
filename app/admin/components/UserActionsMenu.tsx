"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, Ban, Coins } from "lucide-react";
import type { AdminUser } from "@/lib/types/admin";
import { ConfirmModal } from "./ConfirmModal";
import { BlockUserModal } from "./BlockUserModal";
import { AdjustCreditsModal } from "./AdjustCreditsModal";
import { adminFetch } from "../lib/adminFetch";
import { toast } from "../lib/toast";

interface UserActionsMenuProps {
  user: AdminUser;
  onDeleted?: (id: string) => void;
}

type Mode = "delete" | "block" | "credits" | null;

export function UserActionsMenu({ user, onDeleted }: UserActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openModal = (m: Mode) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode(m);
    setOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      toast(`Deleted ${user.email}`, "success");
      onDeleted?.(user.id);
      setMode(null);
    } catch {
      // adminFetch already shows an error toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="relative inline-block"
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Open actions menu"
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-1">
          <button
            onClick={openModal("credits")}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
          >
            <Coins className="w-4 h-4 text-[#0FA37F]" />
            Add credit
          </button>
          <button
            onClick={openModal("block")}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
          >
            <Ban className="w-4 h-4 text-orange-500" />
            Block user
          </button>
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={openModal("delete")}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            <Trash2 className="w-4 h-4" />
            Delete user
          </button>
        </div>
      )}

      <ConfirmModal
        open={mode === "delete"}
        title="Delete user account"
        description={`This will permanently delete the account for ${user.email} and all their data. This action cannot be undone.`}
        confirmLabel="Delete permanently"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setMode(null)}
      />

      <BlockUserModal
        open={mode === "block"}
        userId={user.id}
        userEmail={user.email}
        onClose={() => setMode(null)}
      />

      <AdjustCreditsModal
        open={mode === "credits"}
        userId={user.id}
        userEmail={user.email}
        onClose={() => setMode(null)}
      />
    </div>
  );
}
