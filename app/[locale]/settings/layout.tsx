import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Visual infrastructure */}
            <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.015] pointer-events-none z-0" />
            <div className="fixed inset-0 hud-grid opacity-[0.015] pointer-events-none z-0" />

            {/* Back link */}
            <div className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-6 lg:px-8 py-3">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.15em] group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main className="relative z-10 px-6 lg:px-8 py-10 lg:py-16">
                {children}
            </main>

            {/* Scanline effect */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
            />
        </div>
    );
}
