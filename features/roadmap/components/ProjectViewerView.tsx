'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    ArrowLeft, Trophy, ExternalLink, Link as LinkIcon, Edit2, CheckCircle2, 
    Github, BookOpen, AlertCircle, ChevronRight, X, Target, Lightbulb, 
    ListChecks, Star, Timer, Hammer, Sparkles, Briefcase, FileText,
    Percent, Award, Clock
} from 'lucide-react';
import { Project, Skill, UserProjectSubmission, ProjectReview } from '../types';
import { submitProjectAction, skipProjectAction } from '../actions/project-actions';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProjectViewerViewProps {
    project: Project & { 
        submission?: UserProjectSubmission, 
        skills?: Skill[],
        resources?: any[] 
    };
    breadcrumb: { pathName: string; stageTitle: string } | null;
}

function SectionCard({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col", className)}>
            <div className="px-6 py-4 border-b flex items-center gap-3 bg-muted/30">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <div className="p-6 sm:p-8 flex-1">
                {children}
            </div>
        </div>
    );
}

function EffortBadge({ label, icon: Icon, value, colorClass }: { label: string, icon: any, value: string, colorClass: string }) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center gap-1 px-4 py-2 bg-secondary/20 rounded-xl border border-border/50 min-w-[100px]">
            <div className={cn("p-1.5 rounded-lg mb-1", colorClass)}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="text-sm font-black">{value}</span>
        </div>
    );
}

export function ProjectViewerView({ project, breadcrumb }: ProjectViewerViewProps) {
    const t = useTranslations('ProjectViewer');
    const locale = useLocale();
    const router = useRouter();

    const [isPending, startTransition] = React.useTransition();
    const [isEditing, setIsEditing] = React.useState(!project.submission || (project.submission.status !== 'completed' && project.submission.status !== 'waiting'));

    // Form fields
    const [githubUrl, setGithubUrl] = React.useState(project.submission?.github_url || '');
    const [demoUrl, setDemoUrl] = React.useState(project.submission?.demo_url || '');
    const [notes, setNotes] = React.useState(project.submission?.personal_note || '');
    const [tagsText, setTagsText] = React.useState(project.submission?.tech_tags?.join(', ') || '');
    const [error, setError] = React.useState('');
    const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

    const safeFormatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '---';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '---';
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const tagsArray = tagsText.split(',').map(t => t.trim()).filter(Boolean);

        startTransition(async () => {
            const res = await submitProjectAction(project.project_id, {
                github_url: githubUrl.trim() || undefined,
                demo_url: demoUrl.trim() || undefined,
                personal_note: notes.trim() || undefined,
                tech_tags: tagsArray.length > 0 ? tagsArray : undefined,
                public_portfolio: true, // Default to true for now
            });

            if (res.success) {
                setIsEditing(false);
                router.refresh();
            } else {
                setError(res.error || t('submitError'));
            }
        });
    };

    const handleSkip = () => {
        setError('');
        startTransition(async () => {
            const res = await skipProjectAction(project.project_id);
            if (res.success) {
                setIsEditing(false);
                router.refresh();
            } else {
                setError(res.error || t('skipError'));
            }
        });
    };

    const isCompleted = project.user_status === 'completed';
    const isWaiting = project.user_status === 'waiting';

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
                                        project.difficulty_level === 'beginner' && "text-success",
                                        project.difficulty_level === 'intermediate' && "text-warning",
                                        project.difficulty_level === 'advanced' && "text-destructive"
                                    )}>
                                        {t('difficulty', { level: project.difficulty_level })}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">{project.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium mb-6">
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg text-sm font-bold">
                                    <Timer className="w-4 h-4 text-primary" />
                                    <span>{project.effort_planning || '2h'}</span>
                                </div>
                                {!isCompleted && (
                                    <div className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1.5 rounded-lg border border-warning/20 text-sm font-bold">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{t('gatesNextStage')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <EffortBadge 
                                    label={t('planning')} 
                                    icon={Target} 
                                    value={project.effort_planning || ''} 
                                    colorClass="bg-blue-500/10 text-blue-500" 
                                />
                                <EffortBadge 
                                    label={t('building')} 
                                    icon={Hammer} 
                                    value={project.effort_building || ''} 
                                    colorClass="bg-orange-500/10 text-orange-500" 
                                />
                                <EffortBadge 
                                    label={t('polish')} 
                                    icon={Sparkles} 
                                    value={project.effort_polish || ''} 
                                    colorClass="bg-purple-500/10 text-purple-500" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview & Core Content */}
                <div className="grid grid-cols-1 gap-8">
                    {(project.overview || project.description) && (
                        <SectionCard title={t('overview')} icon={BookOpen}>
                            <p className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {project.overview || project.description}
                            </p>
                        </SectionCard>
                    )}

                    {project.learning_objectives && project.learning_objectives.length > 0 && (
                        <SectionCard title={t('learningObjectives')} icon={Lightbulb}>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.learning_objectives.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
                                        <div className="mt-1 p-1 bg-primary/20 rounded-full">
                                            <CheckCircle2 className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>
                    )}

                    {project.core_requirements && project.core_requirements.length > 0 && (
                        <SectionCard title={t('coreRequirements')} icon={ListChecks}>
                            <div className="space-y-3">
                                {project.core_requirements.map((req, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
                                            <span className="text-[10px] font-bold text-primary/50">{i + 1}</span>
                                        </div>
                                        <p className="text-base font-medium">{req}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {project.evaluation_criteria && project.evaluation_criteria.length > 0 && (
                        <SectionCard title={t('evaluationCriteria')} icon={Target}>
                            <div className="space-y-4">
                                {project.evaluation_criteria.map((criteria, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                        <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <p className="text-sm font-semibold">{criteria}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {!project.evaluation_criteria?.length && project.quality_signals && project.quality_signals.length > 0 && (
                        <SectionCard title={t('evaluationCriteria')} icon={Target}>
                            <div className="space-y-4">
                                {project.quality_signals.map((signal, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                        <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <p className="text-sm font-semibold">{signal}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {project.stretch_goals && project.stretch_goals.length > 0 && (
                        <SectionCard title={t('stretchGoals')} icon={Sparkles} className="border-dashed border-primary/30 bg-primary/5">
                            <div className="space-y-3">
                                {project.stretch_goals.map((goal, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Badge variant="outline" className="mt-1 bg-background text-primary border-primary/20">+{i + 1}</Badge>
                                        <p className="text-sm font-medium text-muted-foreground italic">{goal}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {project.employer_signal && (
                        <SectionCard title={t('employerSignal')} icon={Briefcase} className="bg-primary/5 border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-base font-medium leading-relaxed text-foreground/80 italic">
                                    "{project.employer_signal}"
                                </p>
                            </div>
                        </SectionCard>
                    )}

                    {project.skills && project.skills.length > 0 && (
                        <SectionCard title={t('skillsDemonstrated')} icon={Trophy}>
                            <div className="flex flex-wrap items-center gap-2">
                                {project.skills.map((skill) => (
                                    <Badge key={skill.skill_id} variant="secondary" className="px-3 py-1.5 text-sm border border-primary/20 font-bold">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {project.resources && project.resources.length > 0 && (
                        <SectionCard title={t('helpfulResources')} icon={BookOpen}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {project.resources.map((resource, i) => (
                                    <Link 
                                        key={i}
                                        href={resource.url || '#'}
                                        target="_blank"
                                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg">
                                                <LinkIcon className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-bold truncate max-w-[150px]">{resource.title}</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>

            {/* RIGHT ACTION PANEL */}
            <div className="w-full xl:w-[400px] shrink-0">
                <div className="sticky top-8 space-y-6">
                    <div className={cn(
                        "p-8 rounded-3xl border backdrop-blur-sm shadow-xl",
                        isCompleted ? "bg-emerald-500/5 border-emerald-500/20" : 
                        isWaiting ? "bg-amber-500/5 border-amber-500/20" : 
                        "bg-card border-border"
                    )}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black tracking-tight">{t('actionPanel')}</h2>
                            {isCompleted && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-black uppercase tracking-wider">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {t('completed')}
                                </div>
                            )}
                            {isWaiting && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs font-black uppercase tracking-wider">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {t('skipped')}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-wider text-muted-foreground ml-1">
                                            {t('githubRepository')}
                                        </label>
                                        <div className="relative group">
                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="url"
                                                value={githubUrl}
                                                onChange={(e) => setGithubUrl(e.target.value)}
                                                placeholder="https://github.com/..."
                                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-wider text-muted-foreground ml-1">
                                            {t('liveDemo')} <span className="text-[10px] opacity-50">({t('optional')})</span>
                                        </label>
                                        <div className="relative group">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="url"
                                                value={demoUrl}
                                                onChange={(e) => setDemoUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-wider text-muted-foreground ml-1">
                                            {t('techStack')}
                                        </label>
                                        <div className="relative group">
                                            <Hammer className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <textarea
                                                value={tagsText}
                                                onChange={(e) => setTagsText(e.target.value)}
                                                placeholder={t('commaSeparatedTags')}
                                                rows={2}
                                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full px-4 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {isPending ? (
                                            <Sparkles className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trophy className="w-5 h-5" />
                                        )}
                                        {isCompleted ? t('updateProject') : t('markComplete')}
                                    </button>
                                    
                                    {!isCompleted && !isWaiting && (
                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            disabled={isPending}
                                            className="w-full px-4 py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border/50"
                                        >
                                            {t('skipAndSubmitLater')}
                                        </button>
                                    )}

                                    {(isCompleted || isWaiting) && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="w-full px-4 py-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {t('cancel')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 space-y-6">
                                    {project.submission?.github_url && (
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg border border-border/50">
                                                    <Github className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('githubRepository')}</p>
                                                    <p className="text-sm font-bold truncate max-w-[150px]">{project.submission.github_url.split('/').pop()}</p>
                                                </div>
                                            </div>
                                            <Link 
                                                href={project.submission.github_url} 
                                                target="_blank"
                                                className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}

                                    {project.submission?.demo_url && (
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg border border-border/50">
                                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('liveDemo')}</p>
                                                    <p className="text-sm font-bold truncate max-w-[150px]">{new URL(project.submission.demo_url).hostname}</p>
                                                </div>
                                            </div>
                                            <Link 
                                                href={project.submission.demo_url} 
                                                target="_blank"
                                                className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-lg border border-border/50">
                                            <Timer className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                {isWaiting ? t('skippedOn', { date: '' }).split(' ')[0] : t('submittedOn', { date: '' }).split(' ')[0]}
                                            </p>
                                            <p className="text-sm font-bold">
                                                {safeFormatDate(project.submission?.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {project.submission?.latest_review && (
                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black uppercase tracking-wider text-primary">{t('verdict')}</span>
                                            <Badge className={cn(
                                                "font-black",
                                                project.submission.latest_review.overall_verdict === 'strong' && "bg-emerald-500",
                                                project.submission.latest_review.overall_verdict === 'needs_work' && "bg-rose-500",
                                                project.submission.latest_review.overall_verdict === 'solid' && "bg-amber-500",
                                            )}>
                                                {t(project.submission.latest_review.overall_verdict)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black uppercase tracking-wider text-primary">{t('score')}</span>
                                            <span className="text-2xl font-black">{project.submission.latest_review.score}/100</span>
                                        </div>
                                        <button 
                                            onClick={() => setIsReportModalOpen(true)}
                                            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            {t('viewFullReport')}
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-4 border border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t('editSubmission')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Review Report Modal */}
            {isReportModalOpen && project.submission?.latest_review && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in">
                    <div className="bg-card border border-border/50 w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">{t('evaluationSummary')}</h2>
                            </div>
                            <button 
                                onClick={() => setIsReportModalOpen(false)}
                                className="p-2.5 hover:bg-muted rounded-full transition-all border border-border/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-secondary/10 border border-border/50 text-center space-y-3">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block">{t('verdict')}</span>
                                    <Badge 
                                        className={cn(
                                            "font-black text-xl px-6 py-1.5 rounded-xl",
                                            project.submission.latest_review.overall_verdict === 'strong' && "bg-emerald-500 text-white",
                                            project.submission.latest_review.overall_verdict === 'needs_work' && "bg-rose-500 text-white",
                                            project.submission.latest_review.overall_verdict === 'solid' && "bg-amber-500 text-white",
                                        )}
                                    >
                                        {t(project.submission.latest_review.overall_verdict)}
                                    </Badge>
                                </div>
                                <div className="p-6 rounded-3xl bg-secondary/10 border border-border/50 text-center space-y-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-2">{t('score')}</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-black text-primary">{project.submission.latest_review.score}</span>
                                        <span className="text-lg font-bold text-muted-foreground">/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {project.submission.latest_review.strengths && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <h3 className="font-black uppercase tracking-widest text-sm">{t('strengths')}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {project.submission.latest_review.strengths.split('\n').filter(Boolean).map((s, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-sm font-medium">
                                                    {s.replace(/^[•-]\s*/, '')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.submission.latest_review.improvements && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-rose-500">
                                            <AlertCircle className="w-5 h-5" />
                                            <h3 className="font-black uppercase tracking-widest text-sm">{t('improvements')}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {project.submission.latest_review.improvements.split('\n').filter(Boolean).map((imp, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-sm font-medium">
                                                    {imp.replace(/^[•-]\s*/, '')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end">
                            <button 
                                onClick={() => setIsReportModalOpen(false)}
                                className="px-8 py-3 bg-secondary text-secondary-foreground font-black rounded-xl hover:bg-secondary/80 transition-all"
                            >
                                {t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
