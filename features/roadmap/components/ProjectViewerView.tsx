'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Trophy, ExternalLink, Link as LinkIcon, Edit2, CheckCircle2, Github, BookOpen, AlertCircle, ChevronRight, X } from 'lucide-react';
import { Project, Skill, UserProjectSubmission } from '../types';
import { submitProjectAction } from '../actions/project-actions';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProjectViewerViewProps {
    project: Project & { submission?: UserProjectSubmission, skills?: Skill[] };
    breadcrumb: { pathName: string; stageTitle: string } | null;
}

export function ProjectViewerView({ project, breadcrumb }: ProjectViewerViewProps) {
    const t = useTranslations('ProjectViewer');
    const locale = useLocale();
    const router = useRouter();

    const [isPending, startTransition] = React.useTransition();
    const [isEditing, setIsEditing] = React.useState(!project.submission || project.submission.status !== 'completed');

    // Form fields
    const [githubUrl, setGithubUrl] = React.useState(project.submission?.github_url || '');
    const [demoUrl, setDemoUrl] = React.useState(project.submission?.demo_url || '');
    const [notes, setNotes] = React.useState(project.submission?.personal_note || '');
    const [tagsText, setTagsText] = React.useState(project.submission?.tech_stack_tags?.join(', ') || '');
    const [error, setError] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const tagsArray = tagsText.split(',').map(t => t.trim()).filter(Boolean);

        startTransition(async () => {
            const res = await submitProjectAction(project.project_id, {
                github_url: githubUrl.trim() || undefined,
                demo_url: demoUrl.trim() || undefined,
                personal_note: notes.trim() || undefined,
                tech_stack_tags: tagsArray.length > 0 ? tagsArray : undefined,
                // thumbnail_url could be added later if image upload is supported
            });

            if (res.success) {
                setIsEditing(false);
                router.refresh();
            } else {
                setError(res.error || t('submitError'));
            }
        });
    };

    const isCompleted = project.user_status === 'completed';

    return (
        <div className="h-full w-full max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 py-8 px-4 sm:px-6">
            {/* LEFT CONTENT AREA */}
            <div className="flex-1 space-y-8 min-w-0">
                {/* Header */}
                <div>
                    <Link
                        href={`/${locale}/dashboard/roadmap`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToRoadmap')}
                    </Link>

                    {/* Breadcrumb */}
                    {breadcrumb && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
                            <span className="font-medium">{breadcrumb.pathName}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="font-medium">{breadcrumb.stageTitle}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-foreground font-semibold">{project.title}</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    <Badge variant="default" className="font-semibold">{t('projectMilestone')}</Badge>
                                    <span>•</span>
                                    <span className={cn(
                                        project.difficulty_level === 'beginner' && "text-green-600 dark:text-green-400",
                                        project.difficulty_level === 'intermediate' && "text-amber-600 dark:text-amber-400",
                                        project.difficulty_level === 'advanced' && "text-red-600 dark:text-red-400"
                                    )}>
                                        {t('difficulty', { level: project.difficulty_level })}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">{project.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium mb-2">
                                {!isCompleted && (
                                    <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20 text-sm font-bold">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{t('gatesNextStage')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm p-6 sm:p-8 shrink-0">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {t('projectDescription')}
                    </h2>

                    <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                        <div className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                            {project.description}
                        </div>
                    </div>

                    {project.skills && project.skills.length > 0 && (
                        <div className="border-t pt-6 bg-muted/5 -mx-6 sm:-mx-8 px-6 sm:px-8 -mb-6 sm:-mb-8 pb-6 sm:pb-8">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                {t('skillsDemonstrated')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {project.skills.map((skill) => (
                                    <Badge key={skill.skill_id} variant="secondary" className="px-3 py-1 text-sm bg-background border">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR - PROJECT ACTION PANEL */}
            <div className="w-full xl:w-[450px] flex-shrink-0">
                <div className="sticky top-6 rounded-2xl border bg-card flex flex-col p-6 shadow-sm min-h-[500px]">
                    <h3 className="font-bold text-xl border-b pb-4 mb-6">
                        {isEditing ? t('submitProject') : t('yourSubmission')}
                    </h3>

                    {!isEditing && project.submission ? (
                        <div className="space-y-6 flex-1">
                            {/* Read-only state */}
                            <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-start gap-3 mb-6">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold mb-1">{t('completed')}</div>
                                    <div className="text-sm opacity-90">
                                        {t('submittedOn', { date: new Date(project.submission.updated_at!).toLocaleDateString() })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {project.submission.github_url && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                            {t('githubRepository')}
                                        </h4>
                                        <a href={project.submission.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium break-all">
                                            <Github className="w-4 h-4 shrink-0" /> {project.submission.github_url}
                                        </a>
                                    </div>
                                )}

                                {project.submission.demo_url && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                            {t('liveDemo')}
                                        </h4>
                                        <a href={project.submission.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium break-all">
                                            <ExternalLink className="w-4 h-4 shrink-0" /> {project.submission.demo_url}
                                        </a>
                                    </div>
                                )}

                                {project.submission.personal_note && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                            {t('personalNote')}
                                        </h4>
                                        <div className="bg-muted p-4 rounded-xl text-sm whitespace-pre-wrap">
                                            {project.submission.personal_note}
                                        </div>
                                    </div>
                                )}

                                {project.submission.tech_stack_tags && project.submission.tech_stack_tags.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                                            {t('techStack')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.submission.tech_stack_tags.map(t => (
                                                <span key={t} className="px-2 py-1 text-xs font-semibold bg-background border rounded-md text-foreground">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.submission.feedback && (
                                    <div className="pt-4 mt-6 border-t border-dashed">
                                        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500 mb-2 uppercase tracking-wider">
                                            {t('instructorFeedback')}
                                        </h4>
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-sm text-amber-900 dark:text-amber-200 whitespace-pre-wrap">
                                            {project.submission.feedback}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 mt-6 border-t">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border rounded-xl hover:bg-accent hover:text-foreground transition-colors text-muted-foreground"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t('editSubmission')}
                                </button>
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link
                                        href={`/${locale}/dashboard/roadmap`}
                                        className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {t('nextStage')} <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                            <div className="space-y-5">
                                <p className="text-sm text-muted-foreground mb-6">
                                    {t('projectExplanation')}
                                </p>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">{t('githubRepository')} <span className="text-muted-foreground font-normal">({t('optional')})</span></label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={githubUrl}
                                            onChange={(e) => setGithubUrl(e.target.value)}
                                            placeholder="https://github.com/yourusername/project"
                                            className="w-full pl-9 pr-4 py-2 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">{t('liveDemo')} <span className="text-muted-foreground font-normal">({t('optional')})</span></label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={demoUrl}
                                            onChange={(e) => setDemoUrl(e.target.value)}
                                            placeholder="https://your-demo-url.com"
                                            className="w-full pl-9 pr-4 py-2 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">{t('techStack')} <span className="text-muted-foreground font-normal">({t('optional')})</span></label>
                                    <input
                                        type="text"
                                        value={tagsText}
                                        onChange={(e) => setTagsText(e.target.value)}
                                        placeholder="React, Next.js, tailwind"
                                        className="w-full px-4 py-2 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                        disabled={isPending}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1.5">{t('commaSeparatedTags')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">{t('personalNote')} <span className="text-muted-foreground font-normal">({t('optional')})</span></label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={t('submissionNotesPlaceholder')}
                                        className="w-full px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y text-sm"
                                        disabled={isPending}
                                        maxLength={300}
                                    />
                                    <p className="text-xs text-muted-foreground text-right mt-1">{notes.length}/300</p>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 mt-6 border-t flex items-center justify-end gap-3">
                                {isCompleted && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors flex items-center gap-2 w-full justify-center"
                                        disabled={isPending}
                                    >
                                        <X className="w-4 h-4" /> {t('cancel')}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    {isPending ? t('saving') : (isCompleted ? t('updateProject') : t('markComplete'))}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
