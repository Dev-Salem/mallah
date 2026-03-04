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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
