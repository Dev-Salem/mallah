import React from "react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
            {/* Visual Infrastructure */}
            <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
            <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
            <div className="fixed inset-0 scanline z-[101] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
