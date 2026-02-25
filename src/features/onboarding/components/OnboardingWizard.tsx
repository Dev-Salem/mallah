"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingResponse, BackgroundType, PrimaryGoal, WeeklyHoursCategory, InterestVector, WorkstyleVector, ConfidenceSnapshot, AILanguagePref, AIDetailLevel } from "../types";
import { saveStepAction, finishOnboardingAction } from "../actions/onboarding-actions";
import { StepBackground } from "./StepBackground";
import { StepGoal } from "./StepGoal";
import { StepCommitment } from "./StepCommitment";
import { StepInterestVector } from "./StepInterestVector";
import { StepWorkstyleVector } from "./StepWorkstyleVector";
import { StepReadiness } from "./StepReadiness";
import { StepAIPrefs } from "./StepAIPrefs";
import { RecommendationResult } from "./RecommendationResult";
import { Loader2 } from "lucide-react";

interface Props {
    userId: string;
    initialState?: Partial<OnboardingResponse>;
}

export function OnboardingWizard({ userId, initialState }: Props) {
    const t = useTranslations("Onboarding");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<OnboardingResponse>>(initialState || {
        ai_language_pref: 'AR',
        ai_detail_level: 'Balanced',
        ai_status: 'not_started'
    });
    const [isFinishing, setIsFinishing] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);

    const totalSteps = 7;
    const progress = (step / totalSteps) * 100;

    const updateFormData = (data: Partial<OnboardingResponse>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = async () => {
        // Proactively save state to DB
        await saveStepAction(userId, formData);
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinish = async () => {
        setIsFinishing(true);
        const result = await finishOnboardingAction(userId);
        setIsFinishing(false);
        if (result.success) {
            setRecommendation(result.recommendation);
        } else {
            alert(result.error || "Failed to generate recommendation");
        }
    };

    if (recommendation) {
        return <RecommendationResult recommendation={recommendation} />;
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-serif text-slate-100">{t("title")}</h1>
                        <p className="text-slate-400 font-sans">{t("subtitle")}</p>
                    </div>
                    <span className="text-sm font-mono text-cyan-500">
                        LOC: STEP_0{step} / 0{totalSteps}
                    </span>
                </div>
                <Progress value={progress} className="h-1 bg-slate-800" />
            </div>

            <div className="min-h-[400px] relative overflow-hidden bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-[url('/grain.png')] opacity-20 pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {step === 1 && <StepBackground value={formData.background_type} onChange={(v: BackgroundType) => updateFormData({ background_type: v })} />}
                        {step === 2 && <StepGoal value={formData.primary_goal} onChange={(v: PrimaryGoal) => updateFormData({ primary_goal: v })} />}
                        {step === 3 && <StepCommitment value={formData.weekly_hours_category} onChange={(v: WeeklyHoursCategory) => updateFormData({ weekly_hours_category: v })} />}
                        {step === 4 && <StepInterestVector value={formData.interest_vector} onChange={(v: InterestVector) => updateFormData({ interest_vector: v })} />}
                        {step === 5 && <StepWorkstyleVector value={formData.workstyle_vector} onChange={(v: WorkstyleVector) => updateFormData({ workstyle_vector: v })} />}
                        {step === 6 && <StepReadiness value={formData.confidence_snapshot} onChange={(v: ConfidenceSnapshot) => updateFormData({ confidence_snapshot: v, readiness_level: 50 })} />}
                        {step === 7 && <StepAIPrefs
                            lang={formData.ai_language_pref}
                            detail={formData.ai_detail_level}
                            onLangChange={(v: AILanguagePref) => updateFormData({ ai_language_pref: v })}
                            onDetailChange={(v: AIDetailLevel) => updateFormData({ ai_detail_level: v })}
                        />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 1 || isFinishing}
                    className="text-slate-400 hover:text-slate-100"
                >
                    {t("back")}
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={isFinishing}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[120px]"
                >
                    {isFinishing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("finish")}
                        </>
                    ) : step === totalSteps ? (
                        t("finish")
                    ) : (
                        t("next")
                    )}
                </Button>
            </div>
        </div>
    );
}
