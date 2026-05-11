'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, Lock, Share2, Check, PenLine, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { updateBioAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import type { PortfolioProfile } from '../types';

interface PortfolioHeaderProps {
    profile: PortfolioProfile;
    isPublicView?: boolean;
}

export function PortfolioHeader({ profile, isPublicView = false }: PortfolioHeaderProps) {
    const t = useTranslations('PortfolioHub.profile');
    const tHub = useTranslations('PortfolioHub');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(profile.bio || '');
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/portfolio/${profile.portfolio_slug}`
        : '';

    const handleCopyLink = () => {
        if (!publicUrl) return;
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveBio = async () => {
        setIsSaving(true);
        const result = await updateBioAction({ bio: bioText });
        setIsSaving(false);
        if (result.success) {
            setIsEditingBio(false);
            toast.success(t('bioSaved'));
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="bg-card border border-primary/10 rounded-xl p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">

                {/* Left Side: Personal Info */}
                <div className="space-y-4 max-w-2xl">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase text-foreground">
                            {profile.first_name} {profile.last_name}
                        </h1>
                        {profile.path_name && (
                            <p className="text-primary/90 font-mono text-base uppercase tracking-tight">
                                {t('path', { pathName: profile.path_name })}
                            </p>
                        )}
                    </div>

                    {!isPublicView && isEditingBio ? (
                        <div className="space-y-2">
                            <Textarea
                                value={bioText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBioText(e.target.value)}
                                placeholder={t('bioPlaceholder')}
                                className="resize-none h-24 font-mono text-sm"
                                maxLength={160}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)}>
                                    {t('cancel')}
                                </Button>
                                <Button size="sm" onClick={handleSaveBio} disabled={isSaving}>
                                    {isSaving ? '...' : t('saveBio')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="group relative">
                            <p className="text-foreground/80 text-base leading-relaxed max-w-xl">
                                {profile.bio || (!isPublicView ? t('bioPlaceholder') : '')}
                            </p>
                            {!isPublicView && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditingBio(true)}
                                >
                                    <PenLine className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            )}
                        </div>
                    )}

                    {profile.primary_goal && (
                        <div className="flex items-center gap-2 text-sm font-mono">
                            <span className="text-muted-foreground/90">{t('goalLabel')}</span>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {t(`goals.${profile.primary_goal as 'job' | 'freelance' | 'startup' | 'exploring'}`, { fallback: profile.primary_goal })}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Right Side: Stats & Actions */}
                <div className="flex flex-col md:items-end gap-4 shrink-0">
                    {!isPublicView && profile.portfolio_slug && (
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                                            {tHub('shareProfile')}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tHub('publicProfileTooltip')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button size="icon" variant="outline" className="w-9 h-9" asChild>
                                <a href={`/portfolio/${profile.portfolio_slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-row md:flex-col gap-4 mt-2">
                        <div className="text-center md:text-right">
                            <p className="text-3xl font-light text-foreground font-mono">{profile.projects_completed_count}</p>
                            <p className="text-xs text-muted-foreground/90 uppercase tracking-widest mt-1">
                                {t('projectsCompleted', { count: profile.projects_completed_count }).replace(/\d+ /, '')}
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-3xl font-light text-foreground font-mono">{profile.skills_count}</p>
                            <p className="text-xs text-muted-foreground/90 uppercase tracking-widest mt-1">
                                {t('skillsMastered', { count: profile.skills_count }).replace(/\d+ /, '')}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
