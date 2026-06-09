export type ToastType = "error" | "warning" | "success" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast(message: string, type: ToastType = "error", duration = 5000) {
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const item: ToastItem = { id, message, type, duration };
  toasts = [...toasts, item];
  emit();
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

export function subscribeToasts(fn: Listener): () => void {
  listeners.add(fn);
  fn([...toasts]);
  return () => { listeners.delete(fn); };
}
