import React from "react";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
            {/* Visual Infrastructure */}
            <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
            <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
            <div className="fixed inset-0 scanline z-[101] pointer-events-none" />

            <main className="relative z-10 w-full max-w-3xl mx-auto p-6 lg:p-12">
                {children}
            </main>
        </div>
    );
}
