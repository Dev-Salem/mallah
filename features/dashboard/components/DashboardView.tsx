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
        <div className="space-y-8 pb-12">
            {/* Top row - Greeting */}
            <GreetingBar
                learner={summary.learner}
                path={summary.path}
                stage={summary.stage}
                paceStatus={summary.pace.pace_status}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Control Area (66%) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Primary Focus: Today's Mission */}
                    <div className="space-y-4">
                        <OnboardingBanner banner={summary.onboarding_banner} />
                        <MissionCard
                            mission={summary.mission}
                            estimatedTime={summary.topics.next_topic_estimated_time_min}
                        />
                    </div>

                    {/* Secondary Focus: Performance Analysis */}
                    <ProgressZone
                        path={summary.path}
                        stage={summary.stage}
                        topics={summary.topics}
                        velocity={summary.learner.learning_velocity}
                    />

                    {/* Recent Operational History */}
                    {!isFirstSession && (
                        <RecentActivity items={recentActivity} />
                    )}
                </div>

                {/* Tactical Sidebar (33%) */}
                <div className="lg:col-span-4 space-y-8 sticky top-6">
                    {/* Readiness Dashboard */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
                            <span className="text-[10px] font-mono font-black uppercase text-muted-foreground tracking-widest">
                                Status & Readiness
                            </span>
                        </div>
                        <ReadinessTiles readiness={summary.readiness} />
                    </div>

                    {/* Tactical Coaching */}
                    <AIMicroCoach tip={summary.ai_tip} />

                    {/* Quick Access */}
                    <div className="space-y-4">
                         <div className="flex items-center gap-2 px-1 text-muted-foreground/60 uppercase text-[9px] font-mono font-bold tracking-widest">
                            // Tactical Routing //
                        </div>
                        <QuickNav readiness={summary.readiness} />
                    </div>

                    {/* Pace Momentum */}
                    {!isFirstSession && (
                        <PaceMomentumStrip pace={summary.pace} />
                    )}
                </div>
            </div>
        </div>
    );
}
