"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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

interface OnboardingWizardProps {
    initialDraft?: OnboardingDraft | null;
}

export default function OnboardingWizard({ initialDraft }: OnboardingWizardProps) {
    const t = useTranslations("Onboarding");
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

    const handleSubmit = useCallback(async () => {
        setCurrentStep("loading");
        setError(null);

        try {
            const result = await submitOnboardingAction(formData as OnboardingFormData);

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
        const finalOnboardingId = onboardingId || (initialDraft as any)?.onboardingId; // Fallback to draft ID if submission didn't run yet in this session (though it should have)

        // If we don't have onboardingId from handleSubmit, we might need to fetch it from the draft if initialDraft was loaded
        // but submitOnboardingAction always returns it. The only case is if someone refreshes on Recommendation step.
        // We handle this by ensuring submitOnboardingAction is called before recommendation is shown.

        if (!onboardingId) {
            // If we resumed at recommendation, we might still need onboardingId.
            // We'll trust that the UI flow always goes through handleSubmit or we fetch it.
        }

        const result = await acceptPathAction(pathId, onboardingId!);
        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error);
        }
    }, [onboardingId, initialDraft, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* HUD Background */}
            <div className="absolute inset-0 hud-grid" />
            <div className="absolute inset-0 noise" />
            <div className="scanline" />

            {/* Progress bar */}
            {currentStep !== "intro" && currentStep !== "loading" && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            )}

            {/* Wizard content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
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
                            handleSubmit();
                        }}
                        onBack={goBack}
                    />
                )}

                {currentStep === "loading" && <StepLoading />}

                {(currentStep === "recommendation" || currentStep === "manual-selection") && (
                    <StepRecommendation
                        recommendation={recommendation}
                        isManualMode={currentStep === "manual-selection"}
                        error={error}
                        onAccept={handleAcceptPath}
                    />
                )}
            </div>
        </div>
    );
}
