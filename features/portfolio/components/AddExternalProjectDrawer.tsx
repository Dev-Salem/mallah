'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { addExternalProjectAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';

interface AddExternalProjectDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalog: { skill_id: string; name: string; category: string }[];
}

export function AddExternalProjectDrawer({ open, onOpenChange, catalog }: AddExternalProjectDrawerProps) {
    const t = useTranslations('PortfolioHub.projects.addDrawer');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [techStackStr, setTechStackStr] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [startedAt, setStartedAt] = useState('');
    const [bullets, setBullets] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addBullet = () => setBullets([...bullets, '']);
    const updateBullet = (idx: number, val: string) => {
        const next = [...bullets];
        next[idx] = val;
        setBullets(next);
    };
    const removeBullet = (idx: number) => {
        if (bullets.length <= 1) {
            setBullets(['']);
            return;
        }
        const next = [...bullets];
        next.splice(idx, 1);
        setBullets(next);
    };

    // We could add a multiple select here. For simplicity in this version, we will limit external projects
    // to just tech_stack (which is an array of strings) and leave skill linking manual or for V2.

    const handleSubmit = async () => {
        if (!title || !description) {
            toast.error('Title and description are required.');
            return;
        }

        setIsSubmitting(true);
        const techStackArray = techStackStr.split(',').map(s => s.trim()).filter(Boolean);

        const result = await addExternalProjectAction({
            title,
            description,
            difficulty_level: difficultyLevel,
            github_url: githubUrl || undefined,
            demo_url: demoUrl || undefined,
            tech_stack: techStackArray,
            status: 'completed', // External added projects default to completed
            started_at: startedAt || undefined,
            bullets: bullets.filter(b => b.trim() !== ''),
        });

        setIsSubmitting(false);

        if (result.success) {
            toast.success(t('successMessage'));
            onOpenChange(false);
            // Reset form
            setTitle('');
            setDescription('');
            setGithubUrl('');
            setDemoUrl('');
            setTechStackStr('');
            setDifficultyLevel('beginner');
            setStartedAt('');
            setBullets(['']);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-0 flex flex-col w-[400px] sm:w-[540px]">
                <SheetHeader className="p-6 border-b shrink-0">
                    <SheetTitle>{t('title')}</SheetTitle>
                    <SheetDescription>{t('description')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t('titleLabel')}</Label>
                        <Input
                            id="title"
                            placeholder={t('titlePlaceholder')}
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">{t('descLabel')}</Label>
                        <Textarea
                            id="desc"
                            placeholder={t('descPlaceholder')}
                            className="resize-none h-24"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('difficultyLabel')}</Label>
                        <div className="flex gap-4">
                            {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                                <label key={level} className="flex items-center gap-2 text-sm capitalize">
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        checked={difficultyLevel === level}
                                        onChange={() => setDifficultyLevel(level)}
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="github">{t('githubLabel')}</Label>
                        <Input
                            id="github"
                            type="url"
                            placeholder="https://github.com/..."
                            value={githubUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithubUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demo">{t('demoLabel')}</Label>
                        <Input
                            id="demo"
                            type="url"
                            placeholder="https://..."
                            value={demoUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDemoUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startedAt">{t('startLabel')}</Label>
                        <Input
                            id="startedAt"
                            placeholder={t('startPlaceholder')}
                            value={startedAt}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartedAt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>{t('bulletsLabel')}</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={addBullet}
                                className="h-7 px-2 text-xs gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                {t('addBullet')}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {bullets.map((bullet, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={bullet}
                                        onChange={(e) => updateBullet(idx, e.target.value)}
                                        placeholder={t('bulletsPlaceholder')}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeBullet(idx)}
                                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stack">{t('techStackLabel')}</Label>
                        <Input
                            id="stack"
                            placeholder="React, Next.js, Tailwind..."
                            value={techStackStr}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTechStackStr(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title || !description}
                    >
                        {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
