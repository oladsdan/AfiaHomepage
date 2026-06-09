"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { subscribeToasts, dismiss, type ToastItem, type ToastType } from "../lib/toast";

const icons: Record<ToastType, React.ReactNode> = {
  error: <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  success: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
};

const styles: Record<ToastType, string> = {
  error: "bg-white border-red-100 text-red-700",
  warning: "bg-white border-amber-100 text-amber-700",
  success: "bg-white border-green-100 text-green-700",
  info: "bg-white border-blue-100 text-blue-700",
};

function ToastCard({ item }: { item: ToastItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg min-w-72 max-w-sm ${styles[item.type]}`}
    >
      {icons[item.type]}
      <p className="text-sm flex-1 leading-snug">{item.message}</p>
      <button
        onClick={() => dismiss(item.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts(setItems);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastCard item={item} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
