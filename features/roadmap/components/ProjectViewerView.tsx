'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Trophy, ExternalLink, Link as LinkIcon, Edit2, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import { submitProjectAction, UserProjectSubmission } from '../actions/project-actions';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProjectViewerView({ project }: { project: Project & { submission?: UserProjectSubmission } }) {
    const t = useTranslations('ProjectViewer');
    const locale = useLocale();
    const router = useRouter();

    const [isPending, startTransition] = React.useTransition();
    const [isEditing, setIsEditing] = React.useState(!project.submission || project.submission.status !== 'completed');
    const [url, setUrl] = React.useState(project.submission?.submission_url || '');
    const [notes, setNotes] = React.useState(project.submission?.submission_notes || '');
    const [error, setError] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError(t('urlRequired'));
            return;
        }

        startTransition(async () => {
            const res = await submitProjectAction(project.project_id, {
                submission_url: url,
                submission_notes: notes
            });

            if (res.success) {
                setIsEditing(false);
                router.refresh();
            } else {
                setError(res.error || t('submitError'));
            }
        });
    };

    return (
        <div className="h-full max-w-5xl mx-auto py-8 px-4">
            <Link
                href={`/${locale}/dashboard/roadmap`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('backToRoadmap')}
            </Link>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                                {t('projectMilestone')}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{project.title}</h1>
                        </div>
                    </div>
                </div>

                {project.user_status === 'completed' && !isEditing && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/50 rounded-full font-medium">
                        <CheckCircle2 className="w-5 h-5" />
                        {t('completed')}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-[400px] grid-cols-2 rounded-xl bg-muted/50 p-1 mb-6">
                            <TabsTrigger value="overview" className="rounded-lg">{t('overview')}</TabsTrigger>
                            <TabsTrigger value="submission" className="rounded-lg">{t('yourSubmission')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>
                                {/* Additional project details can go here */}
                            </div>
                        </TabsContent>

                        <TabsContent value="submission">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-2xl p-6 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{t('submitProject')}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {t('submitInstructions')}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t('submissionUrl')}</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    placeholder={t('submissionUrlPlaceholder')}
                                                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    disabled={isPending}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t('submissionNotes')}</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder={t('submissionNotesPlaceholder')}
                                                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-y"
                                                disabled={isPending}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                        {!isEditing && project.submission && (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                                disabled={isPending}
                                            >
                                                {t('cancel')}
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isPending || !url.trim()}
                                            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                        >
                                            {isPending ? t('saving') : t('submit')}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b">
                                        <div>
                                            <h3 className="font-bold text-lg">{t('yourSubmission')}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {t('submittedOn', { date: new Date(project.submission!.updated_at).toLocaleDateString() })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            {t('editSubmission')}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                                                {t('submissionUrl')}
                                            </h4>
                                            <a
                                                href={project.submission!.submission_url!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline font-medium break-all"
                                            >
                                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                {project.submission!.submission_url}
                                            </a>
                                        </div>

                                        {project.submission!.submission_notes && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                                                    {t('submissionNotes')}
                                                </h4>
                                                <div className="bg-muted/30 p-4 rounded-lg whitespace-pre-wrap text-sm">
                                                    {project.submission!.submission_notes}
                                                </div>
                                            </div>
                                        )}

                                        {project.submission!.feedback && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-amber-500 mb-2 uppercase tracking-wider">
                                                    {t('instructorFeedback')}
                                                </h4>
                                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-sm text-amber-900 dark:text-amber-200">
                                                    {project.submission!.feedback}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* RIGHT SIDEBAR - PROJECT META */}
                <div className="space-y-6">
                    <div className="bg-muted/30 border rounded-2xl p-6">
                        <h3 className="font-bold text-lg mb-4">{t('projectDetails')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start justify-between">
                                <span className="text-muted-foreground">{t('difficultyLabel')}</span>
                                <span className="font-medium capitalize">{t('difficulty', { level: project.difficulty_level })}</span>
                            </li>

                            {project.submission?.grade !== null && project.submission?.grade !== undefined && (
                                <li className="flex items-start justify-between pt-3 border-t">
                                    <span className="text-muted-foreground">{t('grade')}</span>
                                    <span className="font-bold text-primary">{project.submission.grade}/100</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
