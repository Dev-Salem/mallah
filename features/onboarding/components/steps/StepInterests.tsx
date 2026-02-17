"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { InterestScores } from "@/features/onboarding/types";

interface StepInterestsProps {
    initialScores: InterestScores | null;
    onSave: (scores: InterestScores) => Promise<void>;
    onBack: () => void;
}

interface Question {
    key: string;
    boosts: Partial<InterestScores>;
}

const QUESTIONS: Question[] = [
    {
        key: "q_visual_web",
        boosts: { frontend: 1 },
    },
    {
        key: "q_protect_systems",
        boosts: { cybersecurity: 1 },
    },
    {
        key: "q_data_patterns",
        boosts: { data_ai: 1 },
    },
    {
        key: "q_server_logic",
        boosts: { backend: 1 },
    },
    {
        key: "q_mobile_apps",
        boosts: { mobile: 1 },
    },
];

export function StepInterests({ initialScores, onSave, onBack }: StepInterestsProps) {
    const t = useTranslations("Onboarding");
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const answeredCount = Object.keys(answers).length;
    const isValid = answeredCount === QUESTIONS.length;

    function handleAnswer(questionKey: string, value: boolean) {
        setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    }

    async function handleSubmit() {
        if (!isValid) return;
        setLoading(true);
        try {
            const scores: InterestScores = {
                frontend: 0,
                backend: 0,
                data_ai: 0,
                cybersecurity: 0,
                mobile: 0,
            };

            for (const q of QUESTIONS) {
                if (answers[q.key]) {
                    for (const [key, val] of Object.entries(q.boosts)) {
                        scores[key as keyof InterestScores] += val as number;
                    }
                }
            }

            await onSave(scores);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step4Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step4Subtitle")}
                </p>
            </div>

            <div className="space-y-4">
                {QUESTIONS.map(({ key }) => (
                    <div
                        key={key}
                        className={`
              p-5 border transition-all duration-300
              ${answers[key] !== undefined ? "border-white/20 bg-white/5" : "border-white/10 bg-white/[0.02]"}
            `}
                    >
                        <p className="text-sm text-white mb-4">{t(key)}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAnswer(key, true)}
                                className={`
                  flex-1 py-2 border text-xs font-mono uppercase tracking-widest transition-all cursor-pointer
                  ${answers[key] === true
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                                    }
                `}
                            >
                                {t("yes")}
                            </button>
                            <button
                                onClick={() => handleAnswer(key, false)}
                                className={`
                  flex-1 py-2 border text-xs font-mono uppercase tracking-widest transition-all cursor-pointer
                  ${answers[key] === false
                                        ? "border-white/20 bg-white/5 text-white/60"
                                        : "border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                                    }
                `}
                            >
                                {t("no")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-14 px-8 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.2em] font-mono text-[11px] group"
                >
                    <ArrowLeft className="me-3 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    {t("back")}
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || loading}
                    className="flex-1 h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
                >
                    {t("next")}
                    <ArrowRight className="ms-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
