'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OpportunityAnalysisResult } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScoreLabel, isApplyReady } from '../../services/scoring';

type StandingLabel =
    | 'Not Ready Yet'
    | 'Early Stage'
    | 'Getting Close'
    | 'Strong Candidate'
    | 'Excellent Match';

function getResponsibilities(result: OpportunityAnalysisResult): string[] {
    return (result.responsibilities ?? result.extracted_skills.metadata?.responsibilities ?? [])
        .filter(Boolean)
        .slice(0, 4);
}

function getEmploymentType(result: OpportunityAnalysisResult): string | null {
    return result.employment_type ?? result.extracted_skills.metadata?.employment_type ?? null;
}

function getApplyUrl(result: OpportunityAnalysisResult): string | null {
    return result.apply_url ?? result.extracted_skills.metadata?.apply_url ?? null;
}

function getProjectsMatched(result: OpportunityAnalysisResult): number {
    return result.extracted_skills.metadata?.projects_matched ?? 0;
}

function getStandingExplanation(label: StandingLabel): string {
    switch (label) {
        case 'Not Ready Yet':
            return "This role needs skills you haven't built yet. Follow the action plan to start closing the gap.";
        case 'Early Stage':
            return "You have some foundations but this role needs more. Keep building - it's within reach.";
        case 'Getting Close':
            return "You're making real progress. A few more skills and projects will get you there.";
        case 'Strong Candidate':
            return "You're a strong match. Polish your portfolio and apply.";
        case 'Excellent Match':
            return "You're an excellent fit for this role. Apply now.";
        default:
            return "Keep building toward this role with focused skills and portfolio proof.";
    }
}

function getStandingBanner(result: OpportunityAnalysisResult): {
    tone: 'success' | 'info' | 'warning';
    text: string;
    ctaLabel?: string;
    ctaHref?: string;
} | null {
    if (result.match_score >= 75) {
        return {
            tone: 'success',
            text: "You're ready to apply. Open Resume Builder to tailor your CV.",
            ctaLabel: 'Open Resume Builder',
            ctaHref: '/dashboard/resume-builder',
        };
    }

    if (result.match_score < 35 && (result.seniority_level === 'Mid' || result.seniority_level === 'Senior')) {
        return {
            tone: 'warning',
            text: 'This is above your current level. Build your foundation first.',
        };
    }

    if (result.cv_skills_contributed > 0) {
        return {
            tone: 'info',
            text: `${result.cv_skills_contributed} of your matched skills came from your CV.`,
        };
    }

    return null;
}

function SnapshotRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid gap-2 border-b border-border/50 py-3 last:border-b-0 md:grid-cols-[140px_1fr] md:items-start">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-sm font-medium text-foreground">{value}</div>
        </div>
    );
}

export function OverviewTab({ result }: { result: OpportunityAnalysisResult }) {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale || 'en';

    const responsibilities = getResponsibilities(result);
    const employmentType = getEmploymentType(result);
    const applyUrl = getApplyUrl(result);
    const standingLabel = getScoreLabel(result.match_score) as StandingLabel;
    const standingExplanation = getStandingExplanation(standingLabel);
    const banner = getStandingBanner(result);
    const requiredMatched = result.skills_breakdown.matched.filter((skill) => skill.requirement_type === 'required').length;
    const preferredMatched = result.skills_breakdown.matched.filter((skill) => skill.requirement_type === 'preferred').length;
    const projectsMatched = getProjectsMatched(result);
    const resumeBuilderHref = `/${locale}/dashboard/resume-builder`;

    return (
        <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Job Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                    <SnapshotRow label="Job Title" value={result.job_title || 'Not specified'} />
                    <SnapshotRow label="Company" value={result.company_name || 'Not specified'} />
                    <SnapshotRow label="Location" value={result.location || 'Not specified'} />
                    <SnapshotRow label="Seniority" value={result.seniority_level || 'Not specified'} />
                    <SnapshotRow label="Employment Type" value={employmentType || 'Not specified'} />

                    {responsibilities.length > 0 && (
                        <SnapshotRow
                            label="Responsibilities"
                            value={
                                <ul className="space-y-2">
                                    {responsibilities.map((item, index) => (
                                        <li key={`${item}-${index}`} className="leading-6 text-foreground/90">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            }
                        />
                    )}

                    {applyUrl && (
                        <SnapshotRow
                            label="Apply URL"
                            value={
                                <a
                                    href={applyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center text-primary hover:text-primary/80 hover:underline"
                                >
                                    View Job Posting →
                                </a>
                            }
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Your Standing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <p className="text-xl font-semibold text-foreground">
                            {result.match_score}% - {standingLabel}
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground">
                            {standingExplanation}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-border/70 bg-muted/30 text-foreground">
                            Required Skills: {requiredMatched} / {result.extracted_skills.required.length}
                        </Badge>
                        <Badge variant="outline" className="border-border/70 bg-muted/30 text-foreground">
                            Preferred Skills: {preferredMatched} / {result.extracted_skills.preferred.length}
                        </Badge>
                        <Badge variant="outline" className="border-border/70 bg-muted/30 text-foreground">
                            Projects Matched: {projectsMatched}
                        </Badge>
                    </div>

                    {banner && (
                        <div
                            className={[
                                'rounded-lg border px-4 py-4 text-sm',
                                banner.tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100',
                                banner.tone === 'info' && 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-100',
                                banner.tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100',
                            ].filter(Boolean).join(' ')}
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="leading-6">{banner.text}</p>
                                {banner.ctaLabel && banner.ctaHref && (
                                    <Button asChild size="sm" variant="outline" className="border-current/20 bg-transparent">
                                        <Link href={banner.ctaHref === '/dashboard/resume-builder' ? resumeBuilderHref : banner.ctaHref}>
                                            {banner.ctaLabel}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
