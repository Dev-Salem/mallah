'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isCredentialRequirement } from '../../services/scoring';
import { MissingSkillItem } from '../../types';

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

            if (item && typeof item === 'object') {
                const record = item as Partial<MissingSkillItem> & { skill_name?: unknown };
                const skillName = typeof record.skill_name === 'string' ? record.skill_name : '';
                if (!skillName) return null;

                return {
                    skill_name: skillName,
                    roadmap_topic: record.roadmap_topic ?? null,
                    outside_current_path: Boolean(record.outside_current_path),
                } satisfies MissingSkillItem;
            }

            return null;
        })
        .filter((item): item is MissingSkillItem => Boolean(item));
}

interface SkillItemProps {
    name: string;
    badgeText: string;
    badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'amber';
    subtitle?: React.ReactNode;
    className?: string;
}

function SkillItem({ name, badgeText, badgeVariant = 'default', subtitle, className }: SkillItemProps) {
    const isAmber = badgeVariant === 'amber';
    const isSuccess = badgeText === 'Verified';

    return (
        <div className={cn("flex flex-col gap-1.5 p-3 bg-muted/30 rounded-lg border border-transparent hover:border-primary/10 transition-colors", className)}>
            <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-sm text-foreground">{name}</span>
                <Badge
                    variant={isAmber || isSuccess ? 'default' : badgeVariant}
                    className={cn(
                        "text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-wider",
                        isSuccess && "bg-green-500 hover:bg-green-600",
                        isAmber && "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                    )}
                >
                    {badgeText}
                </Badge>
            </div>
            {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
    );
}

export function SkillsTab({ result }: { result: OpportunityAnalysisResult }) {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale || 'en';

    const matched = result.skills_breakdown.matched.filter((skill) => !isCredentialRequirement(skill.skill_name));
    const verifiedMatches = matched.filter((skill) => skill.is_verified);
    const manualMatches = matched.filter((skill) => !skill.is_verified && skill.source === 'manual');
    const cvMatches = matched.filter((skill) => !skill.is_verified && skill.source === 'cv');

    const partial = result.skills_breakdown.partial.filter((skill) => !isCredentialRequirement(skill.skill_name));
    const missingRequired = coerceMissingSkillItems(result.skills_breakdown.missing.required).filter((skill) => !isCredentialRequirement(skill.skill_name));
    const missingPreferred = coerceMissingSkillItems(result.skills_breakdown.missing.preferred).filter((skill) => !isCredentialRequirement(skill.skill_name));

    const matchedRequiredSkills = matched.filter((skill) => skill.requirement_type === 'required');
    const hasAnyMatchedRequiredSkills = matchedRequiredSkills.length > 0;
    const hasPartialMatches = partial.length > 0;
    const hasMissingRequired = missingRequired.length > 0;
    const hasMissingPreferred = missingPreferred.length > 0;

    return (
        <div className={cn('grid gap-6', hasPartialMatches ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
            <Card className="border-green-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        You Have
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {verifiedMatches.length > 0 && (
                        <div className="space-y-2">
                            {verifiedMatches.map((skill, index) => (
                                <SkillItem
                                    key={`verified-${skill.matched_requirement}-${index}`}
                                    name={skill.skill_name}
                                    badgeText="Verified"
                                    badgeVariant="default"
                                    subtitle={skill.current_level ? `Level: ${skill.current_level.charAt(0).toUpperCase() + skill.current_level.slice(1)}` : undefined}
                                />
                            ))}
                        </div>
                    )}

                    {manualMatches.length > 0 && (
                        <div className={cn("space-y-3", verifiedMatches.length > 0 && "border-t border-border pt-4")}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Portfolio Entries</p>
                            <div className="space-y-2">
                                {manualMatches.map((skill, index) => (
                                    <SkillItem
                                        key={`manual-${skill.matched_requirement}-${index}`}
                                        name={skill.skill_name}
                                        badgeText="Self-Declared"
                                        badgeVariant="outline"
                                        className="border-primary/20 bg-primary/5"
                                        subtitle={skill.current_level ? `Level: ${skill.current_level.charAt(0).toUpperCase() + skill.current_level.slice(1)}` : "Added to portfolio"}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {cvMatches.length > 0 && (
                        <div className={cn("space-y-3", (verifiedMatches.length > 0 || manualMatches.length > 0) && "border-t border-border pt-4")}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Detected from CV</p>
                            <div className="space-y-2">
                                {cvMatches.map((skill, index) => (
                                    <SkillItem
                                        key={`cv-${skill.matched_requirement}-${index}`}
                                        name={skill.skill_name}
                                        badgeText="From CV"
                                        badgeVariant="secondary"
                                        subtitle={skill.current_level ? `Level: ${skill.current_level.charAt(0).toUpperCase() + skill.current_level.slice(1)}` : "Found in resume"}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {!hasAnyMatchedRequiredSkills && (
                        <p className="text-sm text-muted-foreground italic">
                            You don&apos;t have any of the required skills for this role yet. Start with the Action Plan.
                        </p>
                    )}
                </CardContent>
            </Card>

            {hasPartialMatches && (
                <Card className="border-amber-500/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Partial Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {partial.map((skill, index) => (
                            <SkillItem
                                key={`${skill.matched_requirement}-${index}`}
                                name={skill.skill_name}
                                badgeText="Improve"
                                badgeVariant="amber"
                                subtitle={skill.match_reason}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card className="border-red-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Missing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {hasMissingRequired ? (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                {missingRequired.map((skill, index) => (
                                    <SkillItem
                                        key={`${skill.skill_name}-${index}`}
                                        name={skill.skill_name}
                                        badgeText="Required"
                                        badgeVariant="destructive"
                                        subtitle={
                                            skill.roadmap_topic ? (
                                                <div className="mt-0.5">
                                                    <Link
                                                        href={`/${locale}/dashboard/topic/${skill.roadmap_topic.topic_id}`}
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        Study this - Stage {skill.roadmap_topic.stage_order_index}: {skill.roadmap_topic.topic_title}
                                                    </Link>
                                                </div>
                                            ) : (
                                                <p className="mt-0.5">Outside current path - add manually</p>
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-sm text-green-700 dark:text-green-400">
                            <div className="flex items-center gap-2 font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                You meet all the required skills for this role.
                            </div>
                        </div>
                    )}

                    {hasMissingPreferred && (
                        <div className="space-y-3 border-t border-border pt-4">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Nice to Have</p>
                            <div className="space-y-2">
                                {missingPreferred.map((skill, index) => (
                                    <SkillItem
                                        key={`${skill.skill_name}-${index}`}
                                        name={skill.skill_name}
                                        badgeText="Nice to Have"
                                        badgeVariant="outline"
                                        subtitle="Recommended for this role"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {!hasMissingRequired && !hasMissingPreferred && (
                        <p className="text-sm text-muted-foreground italic">Nothing is missing here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
