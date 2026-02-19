"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Zap, PlayCircle } from "lucide-react";
import Link from "next/link";
import { updateTopicProgress } from "../services/roadmap-service";
import { useRouter } from "next/navigation";

interface TopicContentProps {
    topic: any;
    progress: any;
    userId: string;
}

export function TopicContent({ topic, progress, userId }: TopicContentProps) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const router = useRouter();
    const [updating, setUpdating] = useState(false);

    const isCompleted = progress?.status === "Completed";

    async function handleComplete() {
        setUpdating(true);
        try {
            await updateTopicProgress(topic.id, userId, "Completed");
            router.refresh();
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Navigation */}
            <Link
                href={`/${locale}/dashboard/roadmap`}
                className={`inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors uppercase ${!isArabic ? "tracking-widest" : ""} group`}
            >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                {t("backToRoadmap")}
            </Link>

            {/* Header */}
            <div className="glass border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-0.5 border border-primary/20 bg-primary/5 text-[9px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {topic.stages.title}
                        </span>
                        <span className={`text-[9px] font-mono text-white/40 uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("topicIndex", { index: topic.order_index })}
                        </span>
                    </div>

                    <h1 className={`text-4xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-4`}>
                        {topic.title}
                    </h1>

                    <div className="flex gap-6 items-center">
                        <div className={`flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            <Clock className="h-3 w-3" />
                            {t("topicMinutes", { minutes: topic.estimated_time_min })}
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            <Zap className="h-3 w-3" />
                            {topic.difficulty_level}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="glass border-white/5 p-8 min-h-[400px]">
                <div className="prose prose-invert max-w-none">
                    <div className="flex items-center gap-4 p-4 border border-white/10 bg-white/5 mb-8">
                        <div className="p-3 bg-primary/10 border border-primary/20">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className={`text-xs font-mono text-muted-foreground uppercase mb-1 ${!isArabic ? "tracking-widest" : ""}`}>{t("missionDirective")}</p>
                            <p className="text-sm text-white">
                                {topic.description || t("topicDefaultDescription")}
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Resources */}
                    <div className="space-y-12">
                        {topic.topic_resources?.map((resource: any) => (
                            <div key={resource.id} className="space-y-4">
                                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm">
                                        {resource.resource_type}
                                    </span>
                                    {resource.title}
                                </h3>

                                {resource.resource_type === 'INTERNAL_TEXT' && resource.content && (
                                    <div className="text-white/80 leading-relaxed font-light whitespace-pre-wrap">
                                        {resource.content}
                                    </div>
                                )}

                                {resource.resource_type === 'VIDEO' && resource.url && (
                                    <div className="aspect-video w-full bg-white/5 border border-white/10 flex items-center justify-center group hover:border-primary/40 transition-all cursor-pointer">
                                        <div className="text-center">
                                            <PlayCircle className="h-12 w-12 text-primary/40 group-hover:text-primary mb-2 mx-auto" />
                                            <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                                {t("watchTrainingTransmission")}
                                            </p>
                                            <a href={resource.url} target="_blank" className="text-xs text-primary mt-2 block hover:underline">
                                                {resource.url}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {resource.resource_type === 'ARTICLE' && resource.url && (
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        className="block p-6 border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className={`text-[10px] font-mono text-primary/60 uppercase ${!isArabic ? "tracking-widest" : ""} mb-1`}>{t("externalResource")}</p>
                                                <p className="text-sm text-white font-medium">{resource.title}</p>
                                            </div>
                                            <Zap className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                    </a>
                                )}
                            </div>
                        ))}

                        {(!topic.topic_resources || topic.topic_resources.length === 0) && (
                            <div className="space-y-6 text-white/80 leading-relaxed font-light">
                                <p>
                                    {t("topicNoResources")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 flex justify-end">
                    <button
                        onClick={handleComplete}
                        disabled={updating || isCompleted}
                        className={`
                            h-14 px-10 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] transition-all flex items-center gap-3 cursor-pointer
                            ${isCompleted
                                ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]"}
                        `}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                {t("topicCompleted")}
                            </>
                        ) : (
                            <>
                                {t("markCompleted")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
