'use client';

import { useTranslations } from 'next-intl';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import { ExternalProjectForm } from './ExternalProjectForm';

interface AddExternalProjectDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalog: { skill_id: string; name: string; category: string }[];
}

export function AddExternalProjectDrawer({ open, onOpenChange, catalog }: AddExternalProjectDrawerProps) {
    const t = useTranslations('PortfolioHub.projects.addDrawer');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-0 flex flex-col w-full sm:max-w-[540px]">
                <SheetHeader className="p-6 border-b shrink-0">
                    <SheetTitle>{t('title')}</SheetTitle>
                    <SheetDescription>{t('description')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide no-scrollbar">
                    <ExternalProjectForm 
                        catalog={catalog} 
                        onSuccess={() => onOpenChange(false)} 
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
