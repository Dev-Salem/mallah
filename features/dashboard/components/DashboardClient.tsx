"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import {
    Terminal as TerminalIcon,
    Map,
    Cpu,
    FileText,
    Radar,
    ArrowRight,
    Zap,
    TrendingUp,
    Lightbulb,
    Lock,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface DashboardClientProps {
    data: any; // We'll refine types later
}

export function DashboardClient({ data }: DashboardClientProps) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isArabic = locale === "ar";

    if (data.error) {
        return <div className="p-8 text-destructive font-mono uppercase">Error: {data.error}</div>;
    }

    const { profile, stats, nextTopic } = data;
    const firstName = profile.first_name || "Navigator";
    const pathName = isArabic ? profile.paths?.name_ar : profile.paths?.name;

    const quickActions = [
        {
            key: "roadmap",
            href: "/dashboard/roadmap",
            icon: Map,
            label: t("viewRoadmap"),
            locked: false,
        },
        {
            key: "skills",
            href: "/dashboard/skills",
            icon: Cpu,
            label: t("openSkillsHub"),
            locked: false,
        },
        {
            key: "resume",
            href: "/dashboard/resume",
            icon: FileText,
            label: t("openResumeBuilder"),
            locked: true,
        },
        {
            key: "opportunities",
            href: "/dashboard/opportunities",
            icon: Radar,
            label: t("analyzeOpportunity"),
            locked: true,
        },
    ];

    return (
        <>
            {/* Header / Greeting */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                <div>
                    <div className="inline-flex items-center gap-3 px-3 py-1 border border-primary/20 bg-primary/5 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className={`text-[9px] uppercase ${!isArabic ? "tracking-[0.4em]" : ""} text-primary font-mono font-bold`}>
                            {t("sessionActive")}
                        </span>
                    </div>
                    <h1 className={`text-4xl lg:text-5xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}>
                        {t("greeting")} <span className="text-primary">{firstName}</span>
                    </h1>
                    {pathName && (
                        <p className={`text-muted-foreground font-mono text-xs uppercase ${!isArabic ? "tracking-[0.2em]" : ""} flex items-center gap-2`}>
                            <TerminalIcon className="h-3 w-3 text-primary/40" />
                            {t("currentPath")}: {pathName}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Global Progress Card */}
                <Link href={`/${locale}/dashboard/roadmap`} className="lg:col-span-2 glass border-white/5 p-8 relative overflow-hidden group hover:border-primary/20 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Logo size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 border border-primary/20">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                                {t("progressTitle")}
                            </h2>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                    {t("progressOverall", { percent: stats.percent })}
                                </span>
                                <span className={`text-[10px] font-mono text-primary/60 uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                    {t("lessonsProgress", {
                                        completed: stats.completedLessons,
                                        total: stats.totalLessons,
                                    })}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-white/5 border border-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${stats.percent}%` }}
                                />
                            </div>
                        </div>

                        {/* Summary Status */}
                        {pathName && (
                            <div className={`mt-6 p-4 border border-white/5 bg-white/5 font-mono text-xs text-muted-foreground`}>
                                <span className={`text-[9px] text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} block mb-1`}>
                                    {t("currentStage")}
                                </span>
                                <span className="text-white">
                                    {nextTopic?.stages?.title || "Fundamentals"}
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Resume Learning Card */}
                <div className="glass border-primary/20 p-8 flex flex-col justify-between group hover:bg-primary/5 transition-colors">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 border border-primary/20">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                                {t("resumeLearning")}
                            </h2>
                        </div>
                        <div className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-2`}>
                            {t("nextTopic")}
                        </div>
                        <p className="text-white text-sm font-medium mb-6 line-clamp-2">
                            {nextTopic?.title || t("pathCompleted")}
                        </p>
                    </div>
                    {nextTopic ? (
                        <Link
                            href={`/${locale}/dashboard/roadmap/${nextTopic.id}`}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn cursor-pointer"
                        >
                            {t("resumeLearning")}
                            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <div className="w-full h-12 border border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                            {t("pathCompleted")}
                        </div>
                    )}
                </div>

                {/* Quick Stats Row */}
                <Link href={`/${locale}/dashboard/skills`} className="glass border-white/5 p-6 text-center hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3 group-hover:text-primary transition-colors`}>
                        {t("skillsUnlocked")}
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{stats.skillsCount}</div>
                    <div className="w-full h-px bg-primary/10" />
                </Link>

                <Link href={`/${locale}/dashboard/skills`} className="glass border-white/5 p-6 text-center hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3 group-hover:text-primary transition-colors`}>
                        {t("projectsCompleted")}
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{stats.projectsCount}</div>
                    <div className="w-full h-px bg-primary/10" />
                </Link>

                <div className="glass border-white/5 p-6 text-center">
                    <div className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3`}>
                        {t("resumeReadiness")}
                    </div>
                    <div className="text-sm font-bold text-white/60 font-mono uppercase">
                        {stats.resumeStatus === 'NotCreated' ? t("resumeNotCreated") : stats.resumeStatus}
                    </div>
                    <div className="w-full h-px bg-primary/10 mt-3" />
                </div>

                {/* AI Tip Panel */}
                <div className="lg:col-span-2 glass border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 border border-primary/20">
                            <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <span className={`text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} font-bold`}>
                            {t("aiTipTitle")}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(data.aiTipKey || "aiTipDefault")}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="glass border-white/5 p-6">
                    <span className={`block text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-4`}>
                        {t("quickActions")}
                    </span>
                    <div className="space-y-2">
                        {quickActions.map((action) => (
                            <Link
                                key={action.key}
                                href={action.locked ? "#" : `/${locale}${action.href}`}
                                className={`flex items-center gap-3 px-3 py-2.5 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group/qa relative ${action.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <action.icon className="h-4 w-4 text-muted-foreground group-hover/qa:text-primary transition-colors" />
                                <span className={`text-[10px] font-mono text-muted-foreground group-hover/qa:text-white uppercase ${!isArabic ? "tracking-widest" : ""} flex-1 transition-colors`}>
                                    {action.label}
                                </span>
                                {action.locked && <Lock className="h-3 w-3 text-white/10" />}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
