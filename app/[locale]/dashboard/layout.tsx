import { Sidebar } from "@/components/dashboard/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col lg:flex-row">
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 scanline z-[101] pointer-events-none" />

      {/* Sidebar - Fix position on large, hidden on small */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 lg:ms-72 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto pt-20 lg:pt-12">
            {children}
        </div>
      </main>
    </div>
  );
}
