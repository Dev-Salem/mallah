"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, PlayCircle, Clock } from "lucide-react";

import { RoadmapData, Stage, Topic } from "../types";
import Link from "next/link";

interface RoadmapViewProps {
    data: RoadmapData;
}

export function RoadmapView({ data }: RoadmapViewProps) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set([data.stages[0]?.id]));

    const toggleStage = (id: string) => {
        const next = new Set(expandedStages);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedStages(next);
    };

    const { path, stages, stats } = data;

    return (
        <div className="space-y-8">
            {/* Roadmap Header */}
            <div className="glass border-white/5 p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className={`text-3xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-4`}>
                        {isArabic ? path.name_ar : path.name}
                    </h1>

                    <div className="flex flex-wrap gap-8 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                    {t("progressOverall", { percent: stats.overallPercent })}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 border border-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${stats.overallPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{stats.completedTopics}/{stats.totalTopics}</div>
                                <div className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-widest" : ""}`}>Topics</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stages List */}
            <div className="space-y-4">
                {stages.map((stage: any) => (
                    <div key={stage.id} className="glass border-white/5 overflow-hidden">
                        {/* Stage Header */}
                        <button
                            onClick={() => toggleStage(stage.id)}
                            className="w-full flex items-center gap-6 p-6 hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                                        {stage.title}
                                    </h2>
                                    <span className="px-2 py-0.5 border border-primary/20 bg-primary/5 text-[9px] font-mono text-primary uppercase tracking-widest leading-none">
                                        {stage.difficulty_level}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 max-w-[120px] h-1 bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60"
                                            style={{ width: `${stage.stats.percent}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                                        {stage.stats.percent}%
                                    </span>
                                </div>
                            </div>
                            {expandedStages.has(stage.id) ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>

                        {/* Topics List */}
                        {expandedStages.has(stage.id) && (
                            <div className="border-t border-white/5 bg-white/5 divide-y divide-white/5">
                                {stage.topics.map((topic: any) => (
                                    <div
                                        key={topic.id}
                                        className="flex items-center gap-6 p-5 px-8 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex-shrink-0">
                                            {topic.status === 'Completed' ? (
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            ) : topic.status === 'InProgress' ? (
                                                <PlayCircle className="h-5 w-5 text-primary/60" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-white/10" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                                                {topic.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 opacity-60">
                                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {topic.estimated_time_min} MIN
                                                </div>
                                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                                    {topic.difficulty_level}
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/${locale}/dashboard/roadmap/${topic.id}`}
                                            className="px-4 py-2 border border-white/10 hover:border-primary/40 hover:bg-primary/5 text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                        >
                                            {topic.status === 'Completed' ? 'Review' : topic.status === 'InProgress' ? 'Continue' : 'Start'}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
