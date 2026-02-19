"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Cpu, Box, ExternalLink, Calendar, Plus } from "lucide-react";

import { HubData, UserSkill, UserProject } from "../types";
import { addManualSkill, addExternalProject } from "../actions/hub-actions";

interface HubTabsProps {
    data: HubData;
    userId: string;
}

export function HubTabs({ data, userId }: HubTabsProps) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [activeTab, setActiveTab] = useState<"skills" | "projects">("skills");
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const { skills, projects } = data;

    async function handleAddSkill(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const level = formData.get("level") as any;

        try {
            await addManualSkill(userId, name, level);
            setShowSkillForm(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await addExternalProject(formData);
            setShowProjectForm(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className={`text-4xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}>
                        {t("skillsHub")}
                    </h1>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Inventory of your technical coordinates
                    </p>
                </div>

                <div className="flex bg-white/5 border border-white/10 p-1">
                    <button
                        onClick={() => setActiveTab("skills")}
                        className={`px-6 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer ${activeTab === "skills" ? 'bg-primary text-primary-foreground' : 'text-white/40 hover:text-white'}`}
                    >
                        Skills
                    </button>
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`px-6 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer ${activeTab === "projects" ? 'bg-primary text-primary-foreground' : 'text-white/40 hover:text-white'}`}
                    >
                        Projects
                    </button>
                </div>
            </div>

            {/* Skills View */}
            {activeTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.length > 0 ? (
                        skills.map((us: UserSkill) => (
                            <div key={us.skill_id} className="glass border-white/5 p-6 hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-primary/10 border border-primary/20">
                                        <Cpu className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest">
                                        {us.source}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold mb-1">{us.skills?.name}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: us.level === 'Advanced' ? '100%' : us.level === 'Intermediate' ? '66%' : '33%' }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-white/40 uppercase">
                                        {us.level}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lg:col-span-3 py-20 text-center glass border-white/5">
                            <Cpu className="h-8 w-8 text-white/10 mx-auto mb-4" />
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
                                No technical coordinates acquired yet.
                            </p>
                        </div>
                    )}

                    {/* Add Skill Form/Button */}
                    {showSkillForm ? (
                        <form onSubmit={handleAddSkill} className="glass border-primary/30 p-6 space-y-4">
                            <input
                                required
                                name="name"
                                placeholder={t("skillName")}
                                className="w-full bg-white/5 border border-white/10 p-3 text-[11px] font-mono text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            />
                            <select
                                name="level"
                                className="w-full bg-white/5 border border-white/10 p-3 text-[11px] font-mono text-white focus:border-primary outline-none transition-colors"
                            >
                                <option value="Beginner" className="bg-[#0a0a0a]">Beginner</option>
                                <option value="Intermediate" className="bg-[#0a0a0a]">Intermediate</option>
                                <option value="Advanced" className="bg-[#0a0a0a]">Advanced</option>
                            </select>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowSkillForm(false)} className="flex-1 py-2 text-[9px] font-mono uppercase text-white/40 hover:text-white transition-colors">{t("cancel")}</button>
                                <button type="submit" disabled={loading} className="flex-1 py-2 bg-primary text-primary-foreground text-[9px] font-mono uppercase tracking-widest hover:bg-primary/90 transition-all font-bold">{t("addSkill")}</button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowSkillForm(true)}
                            className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer h-full min-h-[140px]"
                        >
                            <Plus className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors mb-2" />
                            <span className="text-[9px] font-mono text-white/20 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
                                {t("addSkill")}
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* Projects View */}
            {activeTab === "projects" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.length > 0 ? (
                        projects.map((up: UserProject) => (
                            <div key={up.project_id} className="glass border-white/5 p-8 group hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-primary/10 border border-primary/20">
                                        <Box className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-0.5 border border-primary/20 bg-primary/5 text-[9px] font-mono text-primary uppercase tracking-widest`}>
                                            {up.status}
                                        </span>
                                        <span className="text-[9px] font-mono text-white/20 uppercase flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {(up.completed_at || up.started_at) ? new Date(up.completed_at || up.started_at!).toLocaleDateString() : '—'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
                                    {up.projects?.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                    {up.projects?.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white/5 text-[8px] font-mono text-white/40 uppercase tracking-widest">
                                            Infrastructure
                                        </span>
                                    </div>
                                    {up.github_url && (
                                        <a href={up.github_url} target="_blank" className="text-primary hover:text-white transition-colors">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lg:col-span-2 py-20 text-center glass border-white/5">
                            <Box className="h-8 w-8 text-white/10 mx-auto mb-4" />
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
                                No vessels constructed yet.
                            </p>
                        </div>
                    )}

                    {/* Add Project Form/Button */}
                    {showProjectForm ? (
                        <form onSubmit={handleAddProject} className="glass border-primary/30 p-8 space-y-4 lg:col-span-1">
                            <input
                                required
                                name="title"
                                placeholder={t("projectTitle")}
                                className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-mono text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            />
                            <textarea
                                required
                                name="description"
                                placeholder={t("projectDesc")}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-mono text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            />
                            <input
                                name="githubUrl"
                                placeholder={t("githubUrl")}
                                className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-mono text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                            />
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowProjectForm(false)} className="flex-1 py-3 text-[10px] font-mono uppercase text-white/40 hover:text-white transition-colors">{t("cancel")}</button>
                                <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest hover:bg-primary/90 transition-all font-bold">{t("addProject")}</button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowProjectForm(true)}
                            className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer min-h-[220px]"
                        >
                            <Plus className="h-6 w-6 text-white/20 group-hover:text-primary transition-colors mb-3" />
                            <span className="text-[10px] font-mono text-white/20 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
                                {t("addProject")}
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
