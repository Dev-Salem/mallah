'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { addManualSkillAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface AddSkillModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalog: { skill_id: string; name: string; category: string }[];
    existingIds: string[];
}

export function AddSkillModal({ open, onOpenChange, catalog, existingIds }: AddSkillModalProps) {
    const t = useTranslations('PortfolioHub.skills.addModal');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableSkills = catalog.filter(c => !existingIds.includes(c.skill_id));

    const handleSubmit = async () => {
        if (!selectedId) return;
        setIsSubmitting(true);
        const result = await addManualSkillAction({ skill_id: selectedId, level });
        setIsSubmitting(false);

        if (result.success) {
            toast.success(t('successMessage'));
            setSelectedId(null);
            setLevel('beginner');
            setSearchQuery('');
            setSelectedCategory(null);
            onOpenChange(false);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('skillLabel')}</Label>
                        
                        {/* Search & Filter */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search catalog..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-muted/20 border-primary/10 h-9"
                                />
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(null)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border",
                                        selectedCategory === null
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "bg-muted/50 text-muted-foreground border-transparent"
                                    )}
                                >
                                    All
                                </button>
                                {Array.from(new Set(availableSkills.map(s => s.category))).sort().map(category => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border",
                                            selectedCategory === category
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-muted/50 text-muted-foreground border-transparent"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Skill Picker List */}
                        <div className="border border-primary/10 rounded-xl bg-muted/10 overflow-hidden">
                            <div className="max-h-[250px] overflow-y-auto p-3 space-y-4 custom-scrollbar">
                                {Object.entries(
                                    availableSkills
                                        .filter(s => {
                                            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            const matchesCategory = !selectedCategory || s.category === selectedCategory;
                                            return matchesSearch && matchesCategory;
                                        })
                                        .reduce((acc, skill) => {
                                            if (!acc[skill.category]) acc[skill.category] = [];
                                            acc[skill.category].push(skill);
                                            return acc;
                                        }, {} as Record<string, typeof availableSkills>)
                                ).map(([category, categorySkills]) => (
                                    <div key={category} className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
                                            {category}
                                            <div className="flex-1 h-[1px] bg-primary/5" />
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {categorySkills.map((skill) => (
                                                <button
                                                    key={skill.skill_id}
                                                    type="button"
                                                    onClick={() => setSelectedId(skill.skill_id === selectedId ? null : skill.skill_id)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                        selectedId === skill.skill_id
                                                            ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10"
                                                            : "bg-background border-border/50 text-muted-foreground hover:border-primary/30"
                                                    )}
                                                >
                                                    {skill.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>{t('levelLabel')}</Label>
                        <div className="flex flex-col gap-2">
                            {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                                <div key={l} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`level-${l}`}
                                        checked={level === l}
                                        onCheckedChange={() => setLevel(l)}
                                    />
                                    <Label htmlFor={`level-${l}`} className="font-normal capitalize">{l}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button disabled={!selectedId || isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
