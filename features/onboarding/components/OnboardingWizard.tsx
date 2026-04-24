"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardingFormData, OnboardingDraft, WizardStep, BackgroundType, PrimaryGoal, WeeklyHours, AILanguage, AIDetailLevel, ConfidenceItem, AIRecommendationResponse, PathId } from "../types";
import { WIZARD_STEPS } from "../types";
import { submitOnboardingAction, acceptPathAction, saveOnboardingDraftAction } from "../actions/onboarding-actions";
import StepIntro from "./StepIntro";
import StepIdentity from "./StepIdentity";
import StepGoal from "./StepGoal";
import StepCommitment from "./StepCommitment";
import StepInterests from "./StepInterests";
import StepConfidence from "./StepConfidence";
import StepPreferences from "./StepPreferences";
import StepLoading from "./StepLoading";
import StepRecommendation from "./StepRecommendation";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
    initialDraft?: OnboardingDraft | null;
}

export default function OnboardingWizard({ initialDraft }: OnboardingWizardProps) {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<WizardStep>((initialDraft?.currentStep as WizardStep) || "intro");
    const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
        backgroundType: initialDraft?.backgroundType,
        primaryGoal: initialDraft?.primaryGoal,
        weeklyHoursCategory: initialDraft?.weeklyHoursCategory,
        interests: initialDraft?.interests || [],
        confidenceItems: initialDraft?.confidenceItems || [
            { key: "git", level: "never" },
            { key: "api", level: "never" },
            { key: "program", level: "never" },
            { key: "project", level: "never" },
        ],
        aiLanguagePref: initialDraft?.aiLanguagePref,
        aiDetailLevel: initialDraft?.aiDetailLevel,
    });
    const [onboardingId, setOnboardingId] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Save draft after each step change (except intro, loading, and result steps)
    useEffect(() => {
        const skipSteps: WizardStep[] = ["intro", "loading", "recommendation", "manual-selection"];
        if (!skipSteps.includes(currentStep)) {
            saveOnboardingDraftAction({
                ...formData,
                currentStep,
            });
        }
    }, [currentStep, formData]);

    // Step index for progress bar
    const userSteps: WizardStep[] = ["intro", "identity", "goal", "commitment", "interests", "confidence", "preferences"];
    const currentStepIndex = userSteps.indexOf(currentStep);
    const progressPercent = currentStep === "recommendation" || currentStep === "manual-selection"
        ? 100
        : currentStep === "loading"
            ? 95
            : currentStepIndex >= 0
                ? Math.round((currentStepIndex / (userSteps.length - 1)) * 100)
                : 0;

    const goNext = useCallback(() => {
        const idx = WIZARD_STEPS.indexOf(currentStep);
        if (idx < WIZARD_STEPS.length - 1) {
            setCurrentStep(WIZARD_STEPS[idx + 1]);
        }
    }, [currentStep]);

    const goBack = useCallback(() => {
        const idx = WIZARD_STEPS.indexOf(currentStep);
        if (idx > 0) {
            setCurrentStep(WIZARD_STEPS[idx - 1]);
        }
    }, [currentStep]);

    const handleSubmit = useCallback(async (overrides?: Partial<OnboardingFormData>) => {
        setCurrentStep("loading");
        setError(null);

        try {
            const finalData = { ...formData, ...overrides } as OnboardingFormData;
            const result = await submitOnboardingAction(finalData);

            if (!result.success) {
                setError(result.error);
                setCurrentStep("manual-selection");
                return;
            }

            setOnboardingId(result.result.onboardingId);

            if (result.result.recommendation) {
                setRecommendation(result.result.recommendation);
                setCurrentStep("recommendation");
            } else {
                setCurrentStep("manual-selection");
            }
        } catch {
            setError("Something went wrong. Please choose your path manually.");
            setCurrentStep("manual-selection");
        }
    }, [formData]);

    const handleAcceptPath = useCallback(async (pathId: PathId) => {
        if (!onboardingId) {
            setError("Missing onboarding session. Please restart onboarding.");
            return;
        }

        const result = await acceptPathAction(pathId, onboardingId);
        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error);
        }
    }, [onboardingId, router]);

    const isResultStep = currentStep === "recommendation" || currentStep === "manual-selection";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
            {/* HUD Background - Full Viewport */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 hud-grid opacity-20" />
                <div className="absolute inset-0 noise opacity-[0.03]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />
            </div>

            {/* Progress bar */}
            {!isResultStep && currentStep !== "intro" && currentStep !== "loading" && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </div>
            )}

            {/* Wizard content */}
            <div className={cn(
                "relative z-10 w-full mx-auto px-4 py-12 transition-all duration-700 ease-in-out",
                isResultStep ? "max-w-6xl" : "max-w-2xl"
            )}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {currentStep === "intro" && (
                            <StepIntro onStart={() => setCurrentStep("identity")} />
                        )}

                        {currentStep === "identity" && (
                            <StepIdentity
                                value={formData.backgroundType}
                                onSelect={(val: BackgroundType) => {
                                    setFormData((prev) => ({ ...prev, backgroundType: val }));
                                    goNext();
                                }}
                            />
                        )}

                        {currentStep === "goal" && (
                            <StepGoal
                                value={formData.primaryGoal}
                                onSelect={(val: PrimaryGoal) => {
                                    setFormData((prev) => ({ ...prev, primaryGoal: val }));
                                    goNext();
                                }}
                                onBack={goBack}
                            />
                        )}

                        {currentStep === "commitment" && (
                            <StepCommitment
                                value={formData.weeklyHoursCategory}
                                onSelect={(val: WeeklyHours) => {
                                    setFormData((prev) => ({ ...prev, weeklyHoursCategory: val }));
                                    goNext();
                                }}
                                onBack={goBack}
                            />
                        )}

                        {currentStep === "interests" && (
                            <StepInterests
                                selected={formData.interests || []}
                                onSubmit={(vals: string[]) => {
                                    setFormData((prev) => ({ ...prev, interests: vals }));
                                    goNext();
                                }}
                                onBack={goBack}
                            />
                        )}

                        {currentStep === "confidence" && (
                            <StepConfidence
                                items={formData.confidenceItems || []}
                                onSubmit={(items: ConfidenceItem[]) => {
                                    setFormData((prev) => ({ ...prev, confidenceItems: items }));
                                    goNext();
                                }}
                                onBack={goBack}
                            />
                        )}

                        {currentStep === "preferences" && (
                            <StepPreferences
                                language={formData.aiLanguagePref}
                                detail={formData.aiDetailLevel}
                                onSubmit={(lang: AILanguage, detail: AIDetailLevel) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        aiLanguagePref: lang,
                                        aiDetailLevel: detail,
                                    }));
                                    handleSubmit({ aiLanguagePref: lang, aiDetailLevel: detail });
                                }}
                                onBack={goBack}
                            />
                        )}

                        {currentStep === "loading" && <StepLoading />}

                        {isResultStep && (
                            <StepRecommendation
                                recommendation={recommendation}
                                isManualMode={currentStep === "manual-selection"}
                                error={error}
                                onAccept={handleAcceptPath}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
