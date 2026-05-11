'use client';

import { useTranslations } from 'next-intl';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription
} from '@/components/ui/sheet';
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
                <SheetContent className="sm:max-w-xl flex min-h-0 flex-col gap-0 overflow-hidden p-0 border-l-white/5 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="p-8 border-b border-border/60 bg-muted/20 shrink-0">
                    <div className="mb-2">
                        <SheetTitle className="text-2xl font-bold font-mono uppercase tracking-tight">
                            {t('title')}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-muted-foreground text-sm max-w-sm">
                        {t('description')}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="min-h-0 flex-1">
                    <div className="px-8 pb-8">
                        <UserDefinedSkillForm 
                            catalog={catalog}
                            existingIds={existingIds}
                            onSuccess={() => onOpenChange(false)}
                            onCancel={() => onOpenChange(false)}
                        />
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
