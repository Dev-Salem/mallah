'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface SidebarContextData {
    pathDisplayName: string;
    pathCompletionPercent: number;
    currentStageNumber: number;
    totalStages: number;
    firstName: string;
    resumeStatus: 'not_created' | 'in_progress' | 'ready';
    unlockedSkillsCount: number;
}

const SidebarContext = createContext<SidebarContextData | null>(null);

export function SidebarProvider({
    data,
    children,
}: {
    data: SidebarContextData;
    children: ReactNode;
}) {
    return (
        <SidebarContext.Provider value={data}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarData(): SidebarContextData | null {
    return useContext(SidebarContext);
}
