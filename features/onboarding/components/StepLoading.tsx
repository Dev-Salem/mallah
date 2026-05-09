"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Cpu, Search, Database } from "lucide-react";
import { useEffect, useState } from "react";

const LOADING_STEPS = [
    "Analyzing profile signals...",
    "Calculating interest vectors...",
    "Querying career matrix...",
    "Refining match logic...",
    "Finalizing recommendation..."
];

export default function StepLoading() {
    const t = useTranslations("Onboarding");
    const [stepIdx, setStepIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center text-center space-y-12 py-12">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full" />
                <div className="absolute inset-4 border border-dashed border-primary/40 rounded-full" />
                <div className="absolute inset-8 bg-primary/10 rounded-full blur-xl" />

                <div className="relative z-10 w-24 h-24 rounded-3xl bg-background border border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none" />
                    <Cpu className="w-12 h-12 text-primary" />
                </div>

                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-background border border-primary/30 rounded-lg shadow-lg">
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                </div>
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2 bg-background border border-primary/30 rounded-lg shadow-lg">
                        <Database className="w-4 h-4 text-primary" />
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-w-sm">
                <h2 className="text-3xl font-extrabold tracking-tight">{t("loading.title")}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    {t("loading.subtitle")}
                </p>
                
                <div className="pt-4 h-12">
                    <div className="flex items-center justify-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
                        <Search className="w-3 h-3 animate-pulse" />
                        {LOADING_STEPS[stepIdx]}
                    </div>
                </div>
            </div>

            <div className="w-64 h-1 glass rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" style={{ width: "100%" }} />
            </div>
        </div>
    );
}