'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { addExternalProjectAction, updateExternalProjectAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ExternalProject } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient } from '@/lib/supabase/client';

interface ExternalProjectFormProps {
    initialData?: ExternalProject;
    catalog: { skill_id: string; name: string; category: string }[];
    onSuccess: () => void;
    onCancel?: () => void;
}

export function ExternalProjectForm({ initialData, catalog, onSuccess, onCancel }: ExternalProjectFormProps) {
    const t = useTranslations('PortfolioHub.projects.addDrawer');
    const isEdit = !!initialData;

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '');
    const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');
    const [techStackStr, setTechStackStr] = useState(initialData?.techStack.join(', ') || '');
    const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
        initialData?.difficulty || 'beginner'
    );
    const [startedAt, setStartedAt] = useState(initialData?.startedAt ? new Date(initialData.startedAt).toISOString().split('T')[0] : ''); 
    const [bullets, setBullets] = useState<string[]>(initialData?.bullets?.length ? initialData.bullets : ['']);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(initialData?.skills.map(s => s.id) || []);
    const [status, setStatus] = useState<'available' | 'in_progress' | 'completed'>(initialData?.status || 'completed');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file.');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(filePath);

            setThumbnailUrl(publicUrl);
            toast.success('Thumbnail uploaded successfully!');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Error uploading image: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

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

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required.');
            return;
        }

        setIsSubmitting(true);
        const techStackArray = techStackStr.split(',').map(s => s.trim()).filter(Boolean);

        const commonData = {
            title,
            description,
            difficulty_level: difficultyLevel,
            github_url: status === 'completed' ? (githubUrl || undefined) : undefined,
            demo_url: status === 'completed' ? (demoUrl || undefined) : undefined,
            thumbnail_url: thumbnailUrl || undefined,
            tech_stack: techStackArray,
            status,
            started_at: startedAt || undefined,
            bullets: status === 'completed' ? bullets.filter(b => b.trim() !== '') : [],
            skill_ids: selectedSkills,
        };

        let result;
        if (isEdit && initialData) {
            result = await updateExternalProjectAction({
                ...commonData,
                projectId: initialData.id
            });
        } else {
            result = await addExternalProjectAction(commonData);
        }

        setIsSubmitting(false);

        if (result.success) {
            toast.success(isEdit ? 'Project updated successfully!' : t('successMessage'));
            onSuccess();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">{t('titleLabel')}</Label>
                <Input
                    id="title"
                    placeholder={t('titlePlaceholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="desc">{t('descLabel')}</Label>
                <Textarea
                    id="desc"
                    placeholder={t('descPlaceholder')}
                    className="resize-none h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">{t('statusLabel')}</Label>
                    <RadioGroup 
                        value={status} 
                        onValueChange={(val) => setStatus(val as any)}
                        className="flex flex-col gap-1"
                    >
                        {[
                            { value: 'available', label: t('statusAvailable') },
                            { value: 'in_progress', label: t('statusOptions.in_progress') },
                            { value: 'completed', label: t('statusOptions.completed') }
                        ].map((item) => (
                            <Label
                                key={item.value}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border",
                                    status === item.value 
                                        ? "bg-primary/[0.08] border-primary/20 text-primary" 
                                        : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                <RadioGroupItem value={item.value} className="sr-only" />
                                <span className={cn(
                                    "text-xs font-medium transition-all",
                                    status === item.value ? "font-bold" : ""
                                )}>
                                    {item.label}
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">{t('difficultyLabel')}</Label>
                    <RadioGroup 
                        value={difficultyLevel} 
                        onValueChange={(val) => setDifficultyLevel(val as any)}
                        className="flex flex-col gap-1"
                    >
                        {[
                            { value: 'beginner', label: t('difficultyOptions.beginner') },
                            { value: 'intermediate', label: t('difficultyOptions.intermediate') },
                            { value: 'advanced', label: t('difficultyOptions.advanced') }
                        ].map((item) => (
                            <Label
                                key={item.value}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border",
                                    difficultyLevel === item.value 
                                        ? "bg-primary/[0.08] border-primary/20 text-primary" 
                                        : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                <RadioGroupItem value={item.value} className="sr-only" />
                                <span className={cn(
                                    "text-xs font-medium transition-all",
                                    difficultyLevel === item.value ? "font-bold" : ""
                                )}>
                                    {item.label}
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <ImageIcon className="w-3 h-3" />
                    {t('uploadThumbnail')}
                </Label>
                <div 
                    className={cn(
                        "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                        thumbnailUrl ? "aspect-video" : "h-32",
                        isUploading ? "border-primary animate-pulse" : "border-border/50 hover:border-primary/50 hover:bg-primary/[0.02]"
                    )}
                    onClick={() => !isUploading && document.getElementById('thumbnail-upload')?.click()}
                >
                    {thumbnailUrl ? (
                        <>
                            <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-[10px] font-black uppercase tracking-wider rounded-full"
                                >
                                    Change Image
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-[10px] font-black uppercase tracking-wider rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setThumbnailUrl('');
                                    }}
                                >
                                    {t('removeImage')}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground p-4">
                            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <Upload className="w-5 h-5 text-primary/60" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground">{t('dropToUpload')}</p>
                                <p className="text-[9px] font-medium opacity-60 mt-1">Supports PNG, JPG, WEBP</p>
                            </div>
                        </div>
                    )}
                    <input 
                        id="thumbnail-upload"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center flex-col gap-3">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('uploading')}</span>
                        </div>
                    )}
                </div>
            </div>

            {status === 'completed' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="github">{t('githubLabel')}</Label>
                        <Input
                            id="github"
                            type="url"
                            placeholder="https://github.com/..."
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demo">{t('demoLabel')}</Label>
                        <Input
                            id="demo"
                            type="url"
                            placeholder="https://..."
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="startedAt">{t('startLabel')}</Label>
                <Input
                    id="startedAt"
                    type="date"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                />
            </div>

            {status === 'completed' && (
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
            )}

            <div className="space-y-2">
                <Label htmlFor="stack">{t('techStackLabel')}</Label>
                <Input
                    id="stack"
                    placeholder="React, Next.js, Tailwind..."
                    value={techStackStr}
                    onChange={(e) => setTechStackStr(e.target.value)}
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
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
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

            <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-background/80 backdrop-blur-sm pb-2">
                {onCancel && (
                    <Button variant="outline" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                >
                    {isSubmitting ? t('submitting') : (isEdit ? 'Save Changes' : t('submit'))}
                </Button>
            </div>
        </div>
    );
}
