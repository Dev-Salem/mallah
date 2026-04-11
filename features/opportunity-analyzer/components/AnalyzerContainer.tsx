'use client';
import { useState, useEffect } from 'react';
import { OpportunityAnalysisResult, ExtractedCV } from '../types';
import { InputScreen } from './InputScreen';
import { ResultsScreen } from './ResultsScreen';
import { analyzeJobAction } from '../actions/analyzer.action';
import { SavedAnalysesTab } from './tabs/SavedAnalysesTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AnalyzerContainerProps {
    initialJD?: string;
    initialAnalysis?: OpportunityAnalysisResult | null;
}

export function AnalyzerContainer({ initialJD, initialAnalysis }: AnalyzerContainerProps) {
    const [result, setResult] = useState<OpportunityAnalysisResult | null>(initialAnalysis || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync result when initialAnalysis changes
    useEffect(() => {
        if (initialAnalysis) {
            setResult(initialAnalysis);
        }
    }, [initialAnalysis]);

    const handleAnalyze = async (jdText: string, cvData: ExtractedCV | null) => {
        setIsAnalyzing(true);
        setError(null);
        
        try {
            const analysisRes = await analyzeJobAction(jdText, cvData);
            if (analysisRes.success && analysisRes.analysis) {
                setResult(analysisRes.analysis);
            } else {
                setError(analysisRes.error || 'Analysis failed.');
            }
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNewAnalysis = () => {
        setResult(null);
    };

    return (
        <div className="max-w-5xl mx-auto w-full">
            {!result ? (
                <InputScreen 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                    error={error} 
                    initialJD={initialJD}
                />
            ) : (
                <ResultsScreen result={result} onNewAnalysis={handleNewAnalysis} />
            )}
        </div>
    );
}
