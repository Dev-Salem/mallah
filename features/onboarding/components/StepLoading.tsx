"use client";

import { useTranslations } from "next-intl";
import { Loader2, Brain } from "lucide-react";

export default function StepLoading() {
    const t = useTranslations("Onboarding");

    return (
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center glow-border">
                    <Brain className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <Loader2 className="absolute -bottom-2 -right-2 w-8 h-8 text-primary animate-spin" />
            </div>

            <div className="space-y-3">
                <h2 className="text-2xl font-bold">{t("loading.title")}</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    {t("loading.subtitle")}
                </p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 200}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
