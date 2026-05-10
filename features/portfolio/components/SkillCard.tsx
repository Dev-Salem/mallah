'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, User, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toggleSkillVisibilityAction, deleteManualSkillAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PortfolioSkill } from '../types';

interface SkillCardProps {
    skill: PortfolioSkill;
    isPublicView?: boolean;
}

export function SkillCard({ skill, isPublicView = false }: SkillCardProps) {
    const t = useTranslations('PortfolioHub.skills');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getSourceConfig = (source: PortfolioSkill['source']) => {
        switch (source) {
            case 'roadmap':
                return { icon: BookOpen, color: 'text-primary' };
            case 'project':
                return { icon: Star, color: 'text-amber-500' };
            case 'manual':
                return { icon: User, color: 'text-emerald-500' };
            default:
                return { icon: BookOpen, color: 'text-primary' };
        }
    };

    const { icon: SourceIcon, color: iconColor } = getSourceConfig(skill.source);

    const handleTogglePublic = async (checked: boolean) => {
        const result = await toggleSkillVisibilityAction(skill.skill_id, checked);
        if (result.success) {
            toast.success(checked ? t('visibilityPublic') : t('visibilityPrivate'));
        } else {
            toast.error(result.error);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteManualSkillAction(skill.skill_id);
            if (result.success) {
                toast.success(t('removed'));
                setShowDeleteConfirm(false);
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`p-4 rounded-xl border transition-all ${isPublicView ? 'bg-card' : 'bg-card hover:border-primary/30'} flex flex-col h-full`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <SourceIcon className={`w-4 h-4 ${iconColor}`} />
                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                        {t(`sourceBadge.${skill.source}`)}
                    </span>
                </div>

                {!isPublicView && (
                    <div className="flex items-center gap-2 shrink-0">
                        {skill.source === 'manual' && (
                            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        )}
                        <div className="flex items-center gap-1.5" title={t('visibilityToggle')}>
                            {skill.is_public ? <Eye className="w-3 h-3 text-muted-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground/50" />}
                            <Switch
                                checked={skill.is_public}
                                onCheckedChange={handleTogglePublic}
                                className="scale-75"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-bold text-foreground mb-4">{skill.name}</h3>

                <div className="flex flex-wrap gap-2 mt-auto">
                    <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] font-mono">
                        {t(`levelBadge.${skill.level as 'beginner' | 'intermediate' | 'advanced'}`)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                        {skill.category}
                    </Badge>
                </div>
            </div>

            {/* Linked Projects Section */}
            {skill.linked_projects && skill.linked_projects.length > 0 && (
                <div className="mt-4 pt-3 border-t border-primary/10">
                    <p className="text-[10px] text-muted-foreground font-mono mb-2 uppercase">{t('earnedIn')}</p>
                    <div className="flex flex-wrap gap-1">
                        {skill.linked_projects.map((proj: string, idx: number) => (
                            <span key={idx} className="text-xs text-foreground bg-primary/5 px-2 py-0.5 rounded-sm">
                                {proj}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="glass-projects border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle') || 'Remove Skill'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteConfirmDesc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10">{t('cancel') || 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete} 
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            {t('delete') || 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
