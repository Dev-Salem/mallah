'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

import { Loader2, Zap, CheckCircle2, Check, ShieldCheck } from 'lucide-react';
import { CVUploadZone } from './CVUploadZone';
import { ExtractedCV } from '../types';
import { cn } from '@/lib/utils';
import { getSavedCVAction } from '../actions/analyzer.action';

interface InputScreenProps {
    onAnalyze: (jdText: string, cvData: ExtractedCV | null) => void;
    isAnalyzing: boolean;
    error: string | null;
    initialJD?: string;
}

export function InputScreen({ onAnalyze, isAnalyzing, error, initialJD }: InputScreenProps) {
    const t = useTranslations('Dashboard.Opportunities.customAnalysis');
    const [jdText, setJdText] = useState(initialJD || '');
    const [cvData, setCvData] = useState<ExtractedCV | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const res = await getSavedCVAction();
                if (res.success && res.data) {
                    setCvData(res.data);
                    setUploadedFileName(res.fileName || 'Verified_Resume.pdf');
                }
            } catch (err) {
                console.error("Failed to load existing CV", err);
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchCV();
    }, []);

    useEffect(() => {
        if (initialJD) {
            setJdText(initialJD);
        }
    }, [initialJD]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jdText.trim()) onAnalyze(jdText, cvData);
    };

    const isReady = jdText.trim().length > 0;

    return (
        <Card className="w-full max-w-3xl mx-auto border border-primary/10 bg-card relative overflow-hidden shadow-2xl">
            {/* HUD Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle,var(--primary)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <CardContent className="p-10 space-y-8 relative z-10">
                <div className="space-y-4">
                    <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-primary flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-primary/20" /> {t('missionBrief')}
                    </h2>
                    <p className="text-foreground/90 text-sm max-w-xl font-mono leading-relaxed">
                        {t('description')}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-mono tracking-widest text-foreground/80 uppercase">
                                {t('inputLabel')}
                            </label>
                            <span className="text-[10px] font-mono text-primary font-bold">
                                ln: {jdText.split('\n').length} | ch: {jdText.length}
                            </span>
                        </div>
                        <Textarea 
                            rows={10} 
                            placeholder={t('textareaPlaceholder')}
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className="resize-none bg-muted/30 border-primary/20 focus:border-primary/50 font-mono text-sm leading-relaxed placeholder:text-foreground/50 h-[240px]"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <label className="text-[10px] font-mono tracking-widest text-foreground/70 uppercase">
                                {t('resumeLabel')}
                            </label>
                            {cvData && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-in fade-in zoom-in duration-500 group">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" /> 
                                    <span className="font-bold tracking-tighter">DATA LINK ACTIVE</span>
                                </div>
                            )}
                        </div>
                        <CVUploadZone 
                            fileName={uploadedFileName}
                            onUploadStarted={(name) => setUploadedFileName(name)}
                            onUploadComplete={(data) => {
                                setCvData(data);
                            }} 
                            onRemove={() => {
                                setCvData(null);
                                setUploadedFileName(null);
                            }}
                        />

                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono animate-pulse">
                            Analysis Error: {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button 
                            type="submit" 
                            disabled={isAnalyzing || !isReady} 
                            className={cn(
                                "w-full py-7 text-sm font-mono tracking-[0.2em] uppercase transition-all duration-500 relative overflow-hidden",
                                isReady && !isAnalyzing ? "bg-primary text-white hover:shadow-[0_0_30px_rgba(255,100,0,0.3)] shadow-lg" : "bg-primary/10 text-primary/40 border border-primary/10"
                            )}
                        >
                            {isAnalyzing ? (
                                <><Loader2 className="w-4 h-4 mr-3 animate-spin" /> {t('button.loading')}</>
                            ) : !isReady ? (
                                t('button.empty')
                            ) : (
                                <><Zap className="w-4 h-4 mr-3" /> {t('button.ready')}</>
                            )}
                        </Button>
                        

                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
