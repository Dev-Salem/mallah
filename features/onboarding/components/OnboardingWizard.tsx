"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { StepIndicator } from "./StepIndicator";
import { StepBasicInfo } from "./steps/StepBasicInfo";
import { StepBackground } from "./steps/StepBackground";
import { StepCommitment } from "./steps/StepCommitment";
import { StepInterests } from "./steps/StepInterests";
import { StepGoal } from "./steps/StepGoal";
import { StepPreferences } from "./steps/StepPreferences";
import { StepRecommendation } from "./steps/StepRecommendation";
import {
    saveStepOne,
    saveStepTwo,
    saveStepThree,
    saveStepFour,
    saveStepFive,
    saveStepSix,
    completeOnboarding,
    computeRecommendedPath,
} from "../actions/onboarding-actions";
import type { OnboardingProfile, Path, InterestScores } from "../types";

interface OnboardingWizardProps {
    profile: OnboardingProfile;
    paths: Path[];
    initialStep: number;
}

const TOTAL_STEPS = 7;

export function OnboardingWizard({
    profile,
    paths,
    initialStep,
}: OnboardingWizardProps) {
    const router = useRouter();
    const locale = useLocale();
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [interestScores, setInterestScores] = useState<InterestScores | null>(
        profile.interest_scores || null
    );
    const [recommendedPath, setRecommendedPath] = useState<Path | null>(null);

    function goBack() {
        setCurrentStep((s) => Math.max(1, s - 1));
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

            {currentStep === 1 && (
                <StepBasicInfo
                    initialFirstName={profile.first_name || ""}
                    initialLastName={profile.last_name || ""}
                    onSave={async (firstName, lastName) => {
                        await saveStepOne(firstName, lastName);
                        setCurrentStep(2);
                    }}
                />
            )}

            {currentStep === 2 && (
                <StepBackground
                    initialValue={profile.background_type}
                    onSave={async (backgroundType) => {
                        await saveStepTwo(backgroundType);
                        setCurrentStep(3);
                    }}
                    onBack={goBack}
                />
            )}

            {currentStep === 3 && (
                <StepCommitment
                    initialHours={profile.weekly_learning_hours}
                    initialStyle={profile.learning_style_primary}
                    onSave={async (hours, style) => {
                        await saveStepThree(hours, style);
                        setCurrentStep(4);
                    }}
                    onBack={goBack}
                />
            )}

            {currentStep === 4 && (
                <StepInterests
                    initialScores={interestScores}
                    onSave={async (scores) => {
                        await saveStepFour(scores);
                        setInterestScores(scores);
                        setCurrentStep(5);
                    }}
                    onBack={goBack}
                />
            )}

            {currentStep === 5 && (
                <StepGoal
                    initialValue={profile.primary_goal}
                    onSave={async (goal) => {
                        await saveStepFive(goal);
                        setCurrentStep(6);
                    }}
                    onBack={goBack}
                />
            )}

            {currentStep === 6 && (
                <StepPreferences
                    initialLanguage={profile.ai_language_pref}
                    initialDetail={profile.ai_detail_level}
                    onSave={async (lang, detail) => {
                        await saveStepSix(lang, detail);
                        // Compute recommendation before showing step 7
                        const scores = interestScores || {
                            frontend: 0,
                            backend: 0,
                            data_ai: 0,
                            cybersecurity: 0,
                            mobile: 0,
                        };
                        const recommended = await computeRecommendedPath(scores, paths);
                        setRecommendedPath(recommended);
                        setCurrentStep(7);
                    }}
                    onBack={goBack}
                />
            )}

            {currentStep === 7 && (
                <StepRecommendation
                    recommendedPath={recommendedPath}
                    allPaths={paths}
                    onAccept={async (pathId) => {
                        await completeOnboarding(pathId);
                        router.push(`/${locale}/dashboard`);
                    }}
                    onBack={goBack}
                />
            )}
        </div>
    );
}
