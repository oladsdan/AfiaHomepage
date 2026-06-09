import type { Metadata } from "next";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "./components/Toaster";
import { AdminProviders } from "./providers";

export const metadata: Metadata = {
  title: "Admin — Afia",
  description: "Afia admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <div className="flex h-screen bg-[#f7f8fa] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </AdminProviders>
  );
}
