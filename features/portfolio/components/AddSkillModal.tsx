'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { addManualSkillAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

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
                        <Label>{t('skillLabel')}</Label>
                        {/* Native select as a simple placeholder until we have a searchable select component */}
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedId || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedId(e.target.value)}
                        >
                            <option value="" disabled>{t('placeholder')}</option>
                            {availableSkills.map(s => (
                                <option key={s.skill_id} value={s.skill_id}>
                                    {s.name} ({s.category})
                                </option>
                            ))}
                        </select>
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
                        {isSubmitting ? '...' : t('submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
