import { Button } from "@/components/ui/button";
import { Link } from '@/lib/i18n/routing';
import { ArrowLeft, Construction, Radio } from "lucide-react";
import { useTranslations } from "next-intl";

interface SystemModuleProps {
  title: string;
  description: string;
}

export function SystemModule({ title, description }: SystemModuleProps) {
  const t = useTranslations('Common');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative overflow-hidden p-8 border border-white/5 bg-white/5 backdrop-blur-sm">
        {/* Background Grids */}
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 p-4 border-l border-t border-primary/30 w-16 h-16" />
        <div className="absolute bottom-0 right-0 p-4 border-r border-b border-primary/30 w-16 h-16" />

        <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
            <div className="relative z-10 p-4 border border-primary/30 bg-black/50 rounded-full">
                <Construction className="w-12 h-12 text-primary" />
            </div>
        </div>

        <div className="space-y-2 mb-8 max-w-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
                    System Maintenance
                </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">
                {title}
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-wide leading-relaxed">
                {description}
            </p>
        </div>

        <div className="flex gap-4">
             <Link href="/dashboard">
                <Button variant="outline" className="h-10 px-6 border-white/10 hover:bg-white/5 text-xs font-mono uppercase tracking-widest gap-2 group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Return into Orbit
                </Button>
            </Link>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
            <span className="text-[9px] text-white/10 font-mono uppercase tracking-[0.5em]">
                Module_Status: Offline
            </span>
        </div>
    </div>
  );
}
