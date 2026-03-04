'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkillCard } from './SkillCard';
import type { PortfolioSkill } from '../types';
import { AddSkillModal } from './AddSkillModal';

interface SkillsSectionProps {
    skills: PortfolioSkill[];
    catalog: { skill_id: string; name: string; category: string }[];
    isPublicView?: boolean;
}

export function SkillsSection({ skills, catalog, isPublicView = false }: SkillsSectionProps) {
    const t = useTranslations('PortfolioHub.skills');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t('searchSkills')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 border-primary/20"
                    />
                </div>

                {!isPublicView && (
                    <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto gap-2">
                        <Plus className="w-4 h-4" />
                        {t('addSkill')}
                    </Button>
                )}
            </div>

            {skills.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed rounded-xl border-primary/20 bg-primary/5">
                    <p className="text-muted-foreground">{t('noSkillsMessage')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSkills.map(skill => (
                        <SkillCard key={skill.skill_id} skill={skill} isPublicView={isPublicView} />
                    ))}
                </div>
            )}

            {filteredSkills.length === 0 && skills.length > 0 && (
                <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                    {t('noSearchMatch')}
                </div>
            )}

            {!isPublicView && (
                <AddSkillModal
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    catalog={catalog}
                    existingIds={skills.map(s => s.skill_id)}
                />
            )}
        </div>
    );
}
