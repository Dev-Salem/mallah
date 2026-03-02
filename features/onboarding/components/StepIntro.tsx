"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

interface StepIntroProps {
    onStart: () => void;
}

export default function StepIntro({ onStart }: StepIntroProps) {
    const t = useTranslations("Onboarding");

    return (
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center glow-border">
                <Compass className="w-10 h-10 text-primary" />
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t("intro.title")}
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                    {t("intro.subtitle")}
                </p>
            </div>

            <div className="glass rounded-xl p-6 max-w-sm w-full">
                <p className="text-sm text-muted-foreground">
                    {t("intro.promise")}
                </p>
            </div>

            <Button
                size="lg"
                onClick={onStart}
                className="text-lg px-8 py-6 glow-border"
            >
                {t("intro.startButton")}
            </Button>
        </div>
    );
}
