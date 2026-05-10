'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight, BriefcaseBusiness, FolderCode, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import { addPortfolioSyncProjectAction, getPortfolioSyncAction } from '../../actions/analyzer.action';
import { MissingSkillItem, OpportunityAnalysisResult, PortfolioSyncData, PortfolioSyncSuggestion } from '../../types';

function coerceMissingSkillItems(items: unknown): MissingSkillItem[] {
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => {
            if (typeof item === 'string') {
                return {
                    skill_name: item,
                    roadmap_topic: null,
                    outside_current_path: false,
                } satisfies MissingSkillItem;
            }

            if (!item || typeof item !== 'object') return null;
            const record = item as Partial<MissingSkillItem> & { skill_name?: unknown };
            if (typeof record.skill_name !== 'string' || !record.skill_name.trim()) return null;

            return {
                skill_name: record.skill_name,
                roadmap_topic: record.roadmap_topic ?? null,
                outside_current_path: Boolean(record.outside_current_path),
            } satisfies MissingSkillItem;
        })
        .filter((item): item is MissingSkillItem => Boolean(item));
}

function LoadingCard() {
    return (
        <Card className="border-primary/10">
            <CardContent className="py-10 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading portfolio sync details...
            </CardContent>
        </Card>
    );
}

function EmptyStateCard({
    title,
    description,
    ctaLabel,
    ctaHref,
}: {
    title: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
}) {
    return (
        <Card className="border-dashed border-primary/15 bg-muted/20">
            <CardContent className="py-10 text-center space-y-3">
                <p className="font-semibold text-foreground">{title}</p>
                {description && <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>}
                {ctaLabel && ctaHref && (
                    <Button asChild variant="outline" className="border-primary/20">
                        <Link href={ctaHref}>{ctaLabel}</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export function PortfolioTab({ result }: { result: OpportunityAnalysisResult }) {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale || 'en';
    const portfolioHubHref = `/${locale}/dashboard/portfolio`;

    const missingRequiredSkills = useMemo(
        () => coerceMissingSkillItems(result.skills_breakdown?.missing?.required).map((skill) => skill.skill_name),
        [result.skills_breakdown?.missing?.required]
    );

    const [syncData, setSyncData] = useState<PortfolioSyncData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [addedIds, setAddedIds] = useState<Record<string, true>>({});

    useEffect(() => {
        let cancelled = false;

        const loadPortfolioSync = async () => {
            setIsLoading(true);
            setError(null);

            const response = await getPortfolioSyncAction({
                job_title: result.job_title,
                required_skills: result.extracted_skills?.required ?? [],
                missing_required_skills: missingRequiredSkills,
            });

            if (cancelled) return;

            if (response.success && response.data) {
                setSyncData(response.data);
            } else {
                setSyncData(null);
                setError(response.error || 'Failed to load portfolio sync data.');
            }

            setIsLoading(false);
        };

        loadPortfolioSync();

        return () => {
            cancelled = true;
        };
    }, [missingRequiredSkills, result.extracted_skills?.required, result.job_title]);

    const handleRetry = async () => {
        setIsLoading(true);
        setError(null);

        const response = await getPortfolioSyncAction({
            job_title: result.job_title,
            required_skills: result.extracted_skills?.required ?? [],
            missing_required_skills: missingRequiredSkills,
        });

        if (response.success && response.data) {
            setSyncData(response.data);
        } else {
            setSyncData(null);
            setError(response.error || 'Failed to load portfolio sync data.');
        }

        setIsLoading(false);
    };

    const handleAddToPlan = async (suggestion: PortfolioSyncSuggestion) => {
        setAddingId(suggestion.suggestion_id);

        const response = await addPortfolioSyncProjectAction({
            suggestion_type: suggestion.suggestion_type,
            project_id: suggestion.project_id,
            title: suggestion.title,
            description: suggestion.description,
            effort_level: suggestion.effort_level,
            covered_skills: suggestion.covered_skills,
        });

        setAddingId(null);

        if (!response.success) {
            toast.error(response.error || 'Failed to add project to portfolio plan.');
            return;
        }

        setAddedIds((current) => ({ ...current, [suggestion.suggestion_id]: true }));
        toast.success(response.already_exists ? 'This project is already in Portfolio Hub.' : 'Project added to Portfolio Hub.');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <LoadingCard />
                <LoadingCard />
            </div>
        );
    }

    if (error && !syncData) {
        return (
            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="py-10 text-center space-y-4">
                    <div className="flex justify-center">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="font-semibold text-foreground">ما قدرنا نحمّل تفاصيل المشاريع — حاول مرة ثانية</p>
                    <Button onClick={handleRetry} variant="outline" className="border-destructive/20">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const existingProjects = syncData?.existing_relevant_projects ?? [];
    const buildSuggestions = syncData?.build_suggestions ?? [];
    const noRequiredGaps = missingRequiredSkills.length === 0;

    return (
        <div className="space-y-8">
            <Card className="border-primary/10 bg-primary/5">
                <CardContent className="py-5">
                    <div className="flex items-start gap-3">
                        <FolderCode className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Portfolio Sync</p>
                            <p className="text-sm text-muted-foreground">
                                This tab is only about portfolio proof for this exact job: what already helps you, and what to build next so your portfolio matches the role more clearly.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <section className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <BriefcaseBusiness className="w-4 h-4 text-success" />
                        <h3 className="font-bold text-lg text-foreground">What You Already Have</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        These projects already prove you have what this job needs — make sure they&apos;re polished and visible before you apply.
                    </p>
                </div>

                {syncData && syncData.existing_total_count === 0 ? (
                    <EmptyStateCard
                        title="ما عندك مشاريع لحد الآن — ابدأ ببناء شي وحطه في بورتفوليوك"
                        ctaLabel="View Portfolio Hub"
                        ctaHref={portfolioHubHref}
                    />
                ) : existingProjects.length === 0 ? (
                    <EmptyStateCard title="مشاريعك الحالية ما تغطي متطلبات هالوظيفة — شوف القسم الثاني وابدأ ببناء الصح" />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {existingProjects.map((project) => (
                            <Card key={project.id} className="border-success/15 bg-card">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
                                        <Badge className="bg-success/10 text-success hover:bg-success/15 border-success/15">
                                            {project.source_label}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.covered_skills.map((skill) => (
                                            <Badge key={`${project.id}-${skill}`} className="bg-success text-white hover:bg-success/90">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardHeader>
                                {project.project_url && project.source_type !== 'cv' && (
                                    <CardContent>
                                        <Link
                                            href={`${portfolioHubHref}?project=${encodeURIComponent(project.id)}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                                        >
                                            View Project
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-warning" />
                        <h3 className="font-bold text-lg text-foreground">What To Build Next</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Build these to prove you have what this job is missing.
                    </p>
                </div>

                {noRequiredGaps ? (
                    <EmptyStateCard title="ما في مشاريع ناقصة الحين — ركّز على التقديم وتحديث سيرتك" />
                ) : buildSuggestions.length === 0 ? (
                    <EmptyStateCard
                        title="ما قدرنا نحدّد مشاريع مناسبة الحين"
                        description="جرّب إعادة التحليل أو ارجع بعد ما تحدّث بورتفوليوك."
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {buildSuggestions.map((project) => {
                            const isBusy = addingId === project.suggestion_id;
                            const isAdded = Boolean(addedIds[project.suggestion_id]);

                            return (
                                <Card key={project.suggestion_id} className="border-warning/20 bg-card">
                                    <CardHeader className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
                                            <Badge variant="outline" className="border-warning/30 text-warning">
                                                {project.effort_level}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.covered_skills.map((skill) => (
                                                <Badge key={`${project.suggestion_id}-${skill}`} variant="destructive" className="bg-destructive/90">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                        <CardDescription className="text-sm text-foreground/85">
                                            {project.reason}
                                        </CardDescription>
                                        <p className="text-sm text-muted-foreground">{project.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            onClick={() => handleAddToPlan(project)}
                                            disabled={isBusy || isAdded}
                                            className="w-full"
                                            variant={isAdded ? 'outline' : 'default'}
                                        >
                                            {isBusy ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : isAdded ? 'Added to Portfolio Hub' : 'Add to Portfolio Hub'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
