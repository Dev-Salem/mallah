'use client';

import type { DashboardSummary } from '../types';
import { GreetingBar } from './GreetingBar';
import { OnboardingBanner } from './OnboardingBanner';
import { MissionCard } from './MissionCard';
import { AIMicroCoach } from './AIMicroCoach';
import { ReadinessTiles } from './ReadinessTiles';
import { PaceMomentumStrip } from './PaceMomentumStrip';
import { ProgressZone } from './ProgressZone';
import { QuickNav } from './QuickNav';
import { RecentActivity } from './RecentActivity';
import type { RecentActivityItem } from '../types';

interface DashboardViewProps {
    summary: DashboardSummary;
    recentActivity: RecentActivityItem[];
}

export function DashboardView({ summary, recentActivity }: DashboardViewProps) {
    const isFirstSession = summary.onboarding_banner.show;

    return (
        <div className="space-y-6">
            {/* 1. Greeting & Context Bar — full width */}
            <GreetingBar
                learner={summary.learner}
                path={summary.path}
                stage={summary.stage}
                paceStatus={summary.pace.pace_status}
            />

            {/* 2–6. Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left column (60%) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* 2. Onboarding Banner (new users only) */}
                    <OnboardingBanner banner={summary.onboarding_banner} />

                    {/* 3. Mission Card (primary) */}
                    <MissionCard
                        mission={summary.mission}
                        estimatedTime={summary.topics.next_topic_estimated_time_min}
                    />

                    {/* 4. AI Micro-Coach */}
                    <AIMicroCoach tip={summary.ai_tip} />
                </div>

                {/* Right column (40%) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 5. Readiness Tiles */}
                    <ReadinessTiles readiness={summary.readiness} />

                    {/* 6. Pace & Momentum Strip */}
                    {!isFirstSession && (
                        <PaceMomentumStrip pace={summary.pace} />
                    )}
                </div>
            </div>

            {/* 7. Progress Zone — full width */}
            <ProgressZone
                path={summary.path}
                stage={summary.stage}
                topics={summary.topics}
                velocity={summary.learner.learning_velocity}
            />

            {/* 8. Quick Navigation — full width */}
            <QuickNav readiness={summary.readiness} />

            {/* 9. Recent Activity — full width, optional */}
            {!isFirstSession && (
                <RecentActivity items={recentActivity} />
            )}
        </div>
    );
}
