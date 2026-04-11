'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

import { Loader2, Briefcase } from 'lucide-react';
import { CVUploadZone } from './CVUploadZone';
import { ExtractedCV } from '../types';

interface InputScreenProps {
    onAnalyze: (jdText: string, cvData: ExtractedCV | null) => void;
    isAnalyzing: boolean;
    error: string | null;
    onViewSaved: () => void;
}

export function InputScreen({ onAnalyze, isAnalyzing, error, onViewSaved }: InputScreenProps) {
    const t = useTranslations('Dashboard.Opportunities');
    const [jdText, setJdText] = useState('');
    const [cvData, setCvData] = useState<ExtractedCV | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jdText.trim()) onAnalyze(jdText, cvData);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-lg bg-card text-card-foreground">
            <CardContent className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">{t('pageTitle') || 'Analyze a Job Opportunity'}</h2>
                    <p className="text-muted-foreground">{t('pageDescription') || 'Paste a job description and optionally upload your CV to see your match score and action plan.'}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Job Description
                        </label>
                        <Textarea 
                            rows={8} 
                            placeholder={t('pasteJobPlaceholder') || "Paste the full job description here..."}
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className="resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Upload your CV (Optional)</label>
                        <CVUploadZone 
                            onUploadComplete={(data) => {
                                setCvData(data);
                            }} 
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-500 rounded text-sm">{error}</div>
                    )}

                    <div className="space-y-3">
                        <Button type="submit" disabled={isAnalyzing || !jdText.trim()} className="w-full py-6 text-base font-bold">
                            {isAnalyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('analyzing') || "Analyzing..."}</> : (t('analyzeButton') || "Analyze →")}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onViewSaved} 
                            disabled={isAnalyzing} 
                            className="w-full"
                        >
                            View Saved Analyses
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
