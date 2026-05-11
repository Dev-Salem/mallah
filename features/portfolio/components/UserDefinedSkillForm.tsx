'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Check, Loader2, User, ShieldCheck, Lock, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { addManualSkillSchema, SKILL_CATEGORIES, type AddManualSkillInput } from '../types';
import { addManualSkillAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';

interface UserDefinedSkillFormProps {
    catalog: { skill_id: string; name: string; category: string }[];
    existingIds: string[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function UserDefinedSkillForm({ catalog, existingIds, onSuccess, onCancel }: UserDefinedSkillFormProps) {
    const t = useTranslations('PortfolioHub.skills.addModal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<AddManualSkillInput>({
        resolver: zodResolver(addManualSkillSchema),
        defaultValues: {
            level: 'beginner',
            is_public: true
        }
    });

    const selectedSkillId = watch('skill_id');
    const customName = watch('custom_name');
    const selectedCategory = watch('custom_category');

    // Filter catalog for search
    const filteredCatalog = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return catalog
            .filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !existingIds.includes(item.skill_id)
            )
            .slice(0, 5);
    }, [catalog, searchQuery, existingIds]);

    const handleSelectFromCatalog = (skill: typeof catalog[0]) => {
        setValue('skill_id', skill.skill_id);
        setValue('custom_name', undefined);
        setValue('custom_category', undefined);
        setSearchQuery(skill.name);
        setIsCustomMode(false);
    };

    const handleEnterCustomMode = () => {
        setIsCustomMode(true);
        setValue('skill_id', undefined);
        setValue('custom_name', searchQuery);
        setValue('custom_category', 'other');
    };

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const onSubmit = async (data: AddManualSkillInput) => {
        setIsSubmitting(true);
        try {
            const result = await addManualSkillAction(data);
            if (result.success) {
                toast.success(t('successMessage') || 'Skill added successfully!');
                onSuccess();
                reset();
                setSearchQuery('');
                setIsCustomMode(false);
            } else {
                toast.error(result.error || 'Failed to add skill');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-2">
            {/* Skill Selection Section */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em] mb-3 block">
                        {t('skillLabel')}
                    </Label>
                    
                    {!selectedSkillId && !isCustomMode ? (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
                            <Input
                                placeholder={t('skillPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 bg-background border-border/60 font-mono text-sm focus-visible:ring-primary/20 rounded-xl"
                                disabled={isSubmitting}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 animate-in zoom-in-95 duration-200">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10">
                                {isCustomMode ? <User className="w-5 h-5 text-orange-500" /> : <ShieldCheck className="w-5 h-5 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">
                                    {isCustomMode ? customName : catalog.find(s => s.skill_id === selectedSkillId)?.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                    {isCustomMode ? 'External Custom Skill' : 'Catalog Skill'}
                                </p>
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                    setSearchQuery('');
                                    setValue('skill_id', undefined);
                                    setValue('custom_name', undefined);
                                    setIsCustomMode(false);
                                }}
                                className="h-8 w-8 rounded-full hover:bg-primary/10 group"
                            >
                                <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>
                        </div>
                    )}

                    {/* Search Results Dropdown */}
                    {searchQuery && !selectedSkillId && !isCustomMode && (
                        <div className="rounded-xl border border-border/60 bg-popover text-popover-foreground overflow-hidden divide-y divide-border/60 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredCatalog.length > 0 && (
                                <div className="p-2">
                                    <p className="px-3 py-2 text-[9px] uppercase font-mono text-muted-foreground tracking-widest">Matches from Catalog</p>
                                    {filteredCatalog.map((skill) => (
                                        <button
                                            key={skill.skill_id}
                                            type="button"
                                            onClick={() => handleSelectFromCatalog(skill)}
                                            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-muted/60 transition-all text-left group rounded-lg"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{skill.name}</span>
                                                <span className="text-[9px] text-muted-foreground uppercase font-mono tracking-tighter">{formatCategory(skill.category)}</span>
                                            </div>
                                            <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleEnterCustomMode}
                                className="w-full p-4 flex items-center gap-4 hover:bg-orange-500/[0.03] transition-all text-left group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                                    <Plus className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground group-hover:text-orange-500 transition-colors">
                                        Add "{searchQuery}" as external
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">Create a custom expertise entry</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Custom Category Selection (Only for New Skills) */}
                {isCustomMode && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em]">
                                {t('categoryLabel')}
                            </Label>
                            {selectedCategory && (
                                <Badge variant="outline" className="text-[9px] font-mono border-orange-500/20 text-orange-500 bg-orange-500/5">
                                    {formatCategory(selectedCategory)}
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {SKILL_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setValue('custom_category', cat)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase transition-all",
                                        selectedCategory === cat
                                            ? "bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-lg shadow-orange-500/5"
                                            : "bg-muted/10 border-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                                    )}
                                >
                                    {formatCategory(cat)}
                                </button>
                            ))}
                        </div>
                        
                        {errors.custom_category && (
                            <p className="text-[10px] text-red-400 font-mono tracking-tight">{errors.custom_category.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Level & Visibility Section */}
            <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl bg-muted/5 border border-white/5">
                {/* Level Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em]">
                            {t('levelLabel')}
                        </Label>
                        <Badge variant="outline" className="text-[9px] font-mono border-primary/20 text-primary uppercase">
                            {watch('level')}
                        </Badge>
                    </div>
                    <div className="flex bg-muted/20 p-1.5 rounded-xl border border-border/60 gap-1.5">
                        {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                            <button
                                key={lvl}
                                type="button"
                                onClick={() => setValue('level', lvl)}
                                className={cn(
                                    "flex-1 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all rounded-lg border border-transparent",
                                    watch('level') === lvl 
                                        ? "bg-background text-primary border-primary/20 shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                                )}
                            >
                                {t(`levels.${lvl}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-mono uppercase text-foreground tracking-[0.2em]">
                                {t('visibilityLabel')}
                            </Label>
                            {watch('is_public') ? <Eye className="w-3 h-3 text-primary" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[240px] font-mono uppercase tracking-tight opacity-60">
                            {t('visibilityDesc')}
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_public')}
                        onCheckedChange={(checked) => setValue('is_public', checked)}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1 h-12 font-mono uppercase text-xs tracking-[0.2em] border border-white/5 hover:bg-muted/20 rounded-xl"
                    disabled={isSubmitting}
                >
                    {t('cancel') || 'Cancel'}
                </Button>
                <Button
                    type="submit"
                    className="flex-[2] h-12 bg-primary hover:bg-primary/90 text-white font-mono uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 rounded-xl transition-all active:scale-95"
                    disabled={isSubmitting || (!selectedSkillId && !isCustomMode)}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {t('submit')}
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
