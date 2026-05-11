'use client';

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Globe, CheckCircle2, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { RoadmapProject } from "../types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { completeRoadmapProjectAction } from "../actions/portfolio-actions";
import { toast } from "sonner";

interface RoadmapCompletionModalProps {
    project: RoadmapProject;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function RoadmapCompletionModal({ project, open, onOpenChange, onSuccess }: RoadmapCompletionModalProps) {
    const t = useTranslations('PortfolioHub.projects');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        personalNote: project.personalNote || '',
        techStack: project.techStack.join(', ') || '',
        thumbnailUrl: project.thumbnailUrl || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await completeRoadmapProjectAction(project.id, {
                githubUrl: formData.githubUrl,
                demoUrl: formData.demoUrl,
                personalNote: formData.personalNote,
                techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
                thumbnailUrl: formData.thumbnailUrl
            });

            if (result.success) {
                toast.success(t('completionSuccess'));
                onSuccess();
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glass-projects border-white/10 shadow-2xl p-0 overflow-hidden">
                <div className="bg-success/10 p-6 flex flex-col items-center text-center gap-2 border-b border-white/5">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center border border-success/30 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">{t('submissionModal.title')}</DialogTitle>
                    <DialogDescription className="text-sm text-success/70 leading-relaxed max-w-[80%] mx-auto">
                        {t('submissionModal.description')}
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="githubUrl" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Github className="w-3 h-3" /> {t('submissionModal.githubLabel')}
                            </Label>
                            <Input 
                                id="githubUrl"
                                placeholder="https://github.com/..."
                                value={formData.githubUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                className="bg-white/5 border-white/10 focus:border-primary/50 h-9 text-sm"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="demoUrl" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Globe className="w-3 h-3" /> {t('submissionModal.demoLabel')}
                            </Label>
                            <Input 
                                id="demoUrl"
                                placeholder="https://..."
                                value={formData.demoUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                                className="bg-white/5 border-white/10 focus:border-primary/50 h-9 text-sm"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="techStack" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> {t('submissionModal.techStackLabel')}
                            </Label>
                            <Input 
                                id="techStack"
                                placeholder="React, Next.js, TypeScript..."
                                value={formData.techStack}
                                onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
                                className="bg-white/5 border-white/10 focus:border-primary/50 h-9 text-sm"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="thumbnailUrl" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> {t('submissionModal.thumbnailLabel')}
                            </Label>
                            <Input 
                                id="thumbnailUrl"
                                placeholder="https://..."
                                value={formData.thumbnailUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                                className="bg-white/5 border-white/10 focus:border-primary/50 h-9 text-sm"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="personalNote" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                {t('submissionModal.noteLabel')}
                            </Label>
                            <Textarea 
                                id="personalNote"
                                placeholder={t('submissionModal.notePlaceholder')}
                                value={formData.personalNote}
                                onChange={(e) => setFormData(prev => ({ ...prev, personalNote: e.target.value }))}
                                className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[80px] resize-none text-sm"
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="font-mono text-[10px] uppercase tracking-widest h-9"
                        >
                            {t('actions.cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-success hover:bg-success/90 text-white font-mono text-[10px] uppercase tracking-widest gap-2 px-6 h-9"
                        >
                            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            {t('actions.confirm_completion')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
