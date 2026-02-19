"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
    FileText, Plus, Edit3, Sparkles, BarChart2, Save, Loader2, Check, ChevronDown, ChevronUp
} from "lucide-react";
import { createResume, updateResumeSection } from "../actions/resume-actions";
import { improveResumeText, calculateATSScore } from "../actions/resume-ai-actions";
import type { Resume, ResumeSection, ResumeWithSections } from "../types";
import { useRouter } from "next/navigation";

interface ResumeBuilderClientProps {
    resumes: Resume[];
    activeResume: ResumeWithSections | null;
}

export function ResumeBuilderClient({ resumes, activeResume }: ResumeBuilderClientProps) {
    const t = useTranslations("ResumeBuilder");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const router = useRouter();

    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newLang, setNewLang] = useState<"EN" | "AR">("EN");
    const [showCreate, setShowCreate] = useState(false);

    async function handleCreate() {
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            await createResume(newTitle.trim(), newLang);
            setShowCreate(false);
            setNewTitle("");
            router.refresh();
        } finally {
            setCreating(false);
        }
    }

    // If no resumes exist, show create prompt
    if (resumes.length === 0 && !showCreate) {
        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <Header t={t} isArabic={isArabic} />
                <div className="glass border-white/5 p-12 flex flex-col items-center text-center space-y-6">
                    <div className="p-4 bg-primary/10 border border-primary/20">
                        <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className={`text-xl font-bold text-white uppercase ${!isArabic ? "tracking-wider" : ""}`}>
                        {t("noResumesTitle")}
                    </h2>
                    <p className={`text-xs font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("noResumesDesc")}
                    </p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.2em] font-mono text-[10px] flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        {t("createResume")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Header t={t} isArabic={isArabic} />

            {/* Resume List + Create */}
            <div className="flex items-center gap-4 flex-wrap">
                {resumes.map((r) => (
                    <a
                        key={r.id}
                        href={`/${locale}/dashboard/resume?id=${r.id}`}
                        className={`h-10 px-4 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all ${activeResume?.id === r.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                            }`}
                    >
                        {r.title}
                    </a>
                ))}
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="h-10 px-4 border border-dashed border-white/20 text-[10px] font-mono text-muted-foreground hover:text-white hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="h-3 w-3" />
                    {t("createResume")}
                </button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className="glass border-white/5 p-6 space-y-4">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={t("resumeTitlePlaceholder")}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-primary/40 focus:outline-none transition-colors"
                    />
                    <div className="flex gap-2">
                        {(["EN", "AR"] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setNewLang(lang)}
                                className={`h-10 px-6 border text-[10px] font-mono uppercase transition-all cursor-pointer ${newLang === lang ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-muted-foreground"
                                    }`}
                            >
                                {lang === "EN" ? t("english") : t("arabic")}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={creating || !newTitle.trim()}
                        className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.2em] font-mono text-[10px] flex items-center gap-2 disabled:opacity-30 transition-all cursor-pointer"
                    >
                        {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        {t("create")}
                    </button>
                </div>
            )}

            {/* Active Resume Editor */}
            {activeResume && (
                <div className="space-y-6">
                    {/* ATS Score */}
                    <ATSScorePanel resume={activeResume} t={t} isArabic={isArabic} />

                    {/* Sections */}
                    {activeResume.sections?.map((section: ResumeSection) => (
                        <SectionEditor
                            key={section.id}
                            section={section}
                            resumeLanguage={activeResume.language}
                            t={t}
                            isArabic={isArabic}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function Header({ t, isArabic }: { t: any; isArabic: boolean }) {
    return (
        <div>
            <h1 className={`text-3xl lg:text-4xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}>
                {t("title")}
            </h1>
            <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-[0.2em]" : ""}`}>
                {t("subtitle")}
            </p>
        </div>
    );
}

function ATSScorePanel({ resume, t, isArabic }: { resume: ResumeWithSections; t: any; isArabic: boolean }) {
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(resume.ats_score);
    const [feedback, setFeedback] = useState<string[]>([]);
    const router = useRouter();

    async function handleScore() {
        setLoading(true);
        try {
            const result = await calculateATSScore(resume.id);
            if ("score" in result && result.score !== undefined) {
                setScore(result.score);
                setFeedback(result.feedback || []);
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass border-white/5 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 border border-primary/20">
                    <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <span className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("atsScore")}
                    </span>
                    <div className="text-2xl font-black text-white">
                        {score !== null && score !== undefined ? `${score}/100` : "—"}
                    </div>
                    {feedback.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {feedback.map((f, i) => (
                                <li key={i} className="text-[10px] text-muted-foreground font-mono">• {f}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <button
                onClick={handleScore}
                disabled={loading}
                className="h-10 px-6 border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 cursor-pointer"
            >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {t("calculateScore")}
            </button>
        </div>
    );
}

function SectionEditor({
    section,
    resumeLanguage,
    t,
    isArabic,
}: {
    section: ResumeSection;
    resumeLanguage: string;
    t: any;
    isArabic: boolean;
}) {
    const [expanded, setExpanded] = useState(true);
    const [content, setContent] = useState(section.section_content);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [improving, setImproving] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            await updateResumeSection(section.id, content);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSaving(false);
        }
    }

    async function handleImprove() {
        if (!content.trim()) return;
        setImproving(true);
        try {
            const result = await improveResumeText(section.section_type, content, resumeLanguage);
            if ("improved" in result && result.improved) {
                setContent(result.improved);
            }
        } finally {
            setImproving(false);
        }
    }

    const sectionLabels: Record<string, string> = {
        SUMMARY: t("sectionSummary"),
        SKILLS: t("sectionSkills"),
        PROJECTS: t("sectionProjects"),
        EXPERIENCE: t("sectionExperience"),
        EDUCATION: t("sectionEducation"),
        CERTIFICATES: t("sectionCertificates"),
        ACTIVITIES: t("sectionActivities"),
        CUSTOM: t("sectionCustom"),
    };

    return (
        <div className="glass border-white/5">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <Edit3 className="h-4 w-4 text-primary" />
                    <span className={`text-sm font-bold text-white uppercase ${!isArabic ? "tracking-wider" : ""}`}>
                        {sectionLabels[section.section_type] || section.section_type}
                    </span>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {expanded && (
                <div className="px-6 pb-6 space-y-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white text-sm font-mono leading-relaxed focus:border-primary/40 focus:outline-none resize-y transition-colors"
                        dir={resumeLanguage === "AR" ? "rtl" : "ltr"}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`h-10 px-6 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${saved ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                }`}
                        >
                            {saved ? <Check className="h-3 w-3" /> : saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {saved ? t("saved") : t("save")}
                        </button>
                        <button
                            onClick={handleImprove}
                            disabled={improving || !content.trim()}
                            className="h-10 px-6 border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 cursor-pointer"
                        >
                            {improving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                            {t("aiImprove")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
