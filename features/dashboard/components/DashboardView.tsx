'use client';

import type { DashboardSummary } from '../types';
import { GreetingBar } from './GreetingBar';
import { OnboardingBanner } from './OnboardingBanner';
import { PaceMomentumStrip } from './PaceMomentumStrip';
import { MissionCard } from './MissionCard';
import { ForecastLine } from './ForecastLine';
import { ReadinessTiles } from './ReadinessTiles';
import { OpportunityPrompt } from './OpportunityPrompt';
import { QuickNav } from './QuickNav';

interface DashboardViewProps {
    summary: DashboardSummary;
}

export function DashboardView({ summary }: DashboardViewProps) {
    return (
        <div className="space-y-2">
            {/* 1. Greeting & Context Bar */}
            <GreetingBar
                learner={summary.learner}
                path={summary.path}
                stage={summary.stage}
            />

            {/* 2. Onboarding Banner (new users only) */}
            <OnboardingBanner
                banner={summary.onboarding_banner}
                pathDisplayName={summary.path.path_display_name}
            />

            {/* 3. Pace & Momentum Strip */}
            <PaceMomentumStrip pace={summary.pace} />

            {/* 4. Mission Card (primary section) */}
            <MissionCard
                mission={summary.mission}
                estimatedTime={summary.topics.next_topic_estimated_time_min}
            />

            {/* 5. Forecast Line */}
            <ForecastLine
                velocity={summary.learner.learning_velocity}
                completionPercent={summary.path.completion_percent}
            />

            {/* 6. Readiness Tiles */}
            <ReadinessTiles readiness={summary.readiness} />

            {/* 7. Opportunity Analyzer Prompt (contextual) */}
            <OpportunityPrompt analyzer={summary.opportunity_analyzer} />

            {/* 8. Quick Navigation */}
            <QuickNav />
        </div>
    );
}
