'use client';

import { useTranslations } from 'next-intl';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription
} from '@/components/ui/sheet';
import { Brain, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserDefinedSkillForm } from './UserDefinedSkillForm';

interface AddExternalSkillDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalog: { skill_id: string; name: string; category: string }[];
    existingIds: string[];
}

export function AddExternalSkillDrawer({ open, onOpenChange, catalog, existingIds }: AddExternalSkillDrawerProps) {
    const t = useTranslations('PortfolioHub.skills.addModal');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl flex flex-col gap-0 p-0 border-l-white/5 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="p-8 border-b border-white/5 bg-muted/5 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <SheetTitle className="text-2xl font-bold font-mono uppercase tracking-tight">
                            {t('title')}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-muted-foreground text-sm max-w-sm relative z-10">
                        {t('description')}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 px-8">
                    <UserDefinedSkillForm 
                        catalog={catalog}
                        existingIds={existingIds}
                        onSuccess={() => onOpenChange(false)}
                        onCancel={() => onOpenChange(false)}
                    />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
