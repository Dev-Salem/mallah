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
import { Plus, Trash2, X } from 'lucide-react';
import { addExternalProjectAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
            skill_ids: selectedSkills,
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
            setSelectedSkills([]);
            setSearchQuery('');
            setSelectedCategory(null);
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

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                {t('skillsLabel')}
                            </Label>
                            <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                                {selectedSkills.length} Selected
                            </span>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Input
                                placeholder="Search skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-muted/20 border-primary/10"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                                    selectedCategory === null
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                All
                            </button>
                            {Array.from(new Set(catalog.map(s => s.category))).sort().map(category => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                                        selectedCategory === category
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Categorized Skills */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(
                                catalog
                                    .filter(s => {
                                        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesCategory = !selectedCategory || s.category === selectedCategory;
                                        return matchesSearch && matchesCategory;
                                    })
                                    .reduce((acc, skill) => {
                                        if (!acc[skill.category]) acc[skill.category] = [];
                                        acc[skill.category].push(skill);
                                        return acc;
                                    }, {} as Record<string, typeof catalog>)
                            ).map(([category, categorySkills]) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-1">
                                        {category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => {
                                            const isSelected = selectedSkills.includes(skill.skill_id);
                                            return (
                                                <button
                                                    key={skill.skill_id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedSkills(selectedSkills.filter(id => id !== skill.skill_id));
                                                        } else {
                                                            setSelectedSkills([...selectedSkills, skill.skill_id]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                        isSelected
                                                            ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10"
                                                            : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30"
                                                    )}
                                                >
                                                    {skill.name}
                                                    {isSelected && <X className="w-3 h-3" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
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
