"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import {
  dismiss,
  subscribeToasts,
  type ToastItem,
  type ToastType,
} from "@/lib/web/toast";

const typeStyles: Record<ToastType, string> = {
  error: "bg-white border-red-100 text-red-700",
  warning: "bg-white border-amber-100 text-amber-700",
  success: "bg-white border-green-100 text-green-700",
  info: "bg-white border-blue-100 text-blue-700",
};

function ToastIcon({ type }: { type: ToastType }) {
  const cls = "h-4 w-4 mt-0.5 flex-shrink-0";
  switch (type) {
    case "error":
      return <AlertCircle className={`${cls} text-red-500`} aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className={`${cls} text-amber-500`} aria-hidden="true" />;
    case "success":
      return <CheckCircle className={`${cls} text-green-500`} aria-hidden="true" />;
    case "info":
      return <Info className={`${cls} text-blue-500`} aria-hidden="true" />;
  }
}

function ToastCard({ item }: { item: ToastItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="status"
      className={`pointer-events-auto flex min-w-72 max-w-sm items-start gap-3 rounded-xl border px-4 py-3.5 shadow-dash-md ${typeStyles[item.type]}`}
    >
      <ToastIcon type={item.type} />
      <p className="flex-1 text-sm font-medium">{item.message}</p>
      <button
        type="button"
        onClick={() => dismiss(item.id)}
        aria-label="Dismiss notification"
        className="text-gray-400 transition-colors hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
