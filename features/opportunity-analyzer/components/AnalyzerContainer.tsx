'use client';
import { useState } from 'react';
import { OpportunityAnalysisResult } from '../types';
import { InputScreen } from './InputScreen';
import { ResultsScreen } from './ResultsScreen';
import { analyzeJobAction, parseCvAction } from '../actions/analyzer.action';
import { SavedAnalysesTab } from './tabs/SavedAnalysesTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function AnalyzerContainer() {
    const [result, setResult] = useState<OpportunityAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewingSaved, setViewingSaved] = useState(false);

    const handleAnalyze = async (jdText: string, cvFile: File | null) => {
        setIsAnalyzing(true);
        setError(null);
        
        try {
            let cvData = null;
            if (cvFile) {
                const cvText = await cvFile.text(); // Assuming text-based CVs for now
                const cvRes = await parseCvAction(cvText);
                if (cvRes.success && cvRes.data) {
                    cvData = cvRes.data;
                }
            }

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
        setViewingSaved(false);
    };

    const handleViewAnalysis = (analysis: OpportunityAnalysisResult) => {
        setResult(analysis);
        setViewingSaved(false);
    };

    if (viewingSaved) {
        return (
            <div className="max-w-5xl mx-auto w-full space-y-6">
                <Button 
                    variant="ghost" 
                    onClick={() => setViewingSaved(false)}
                    className="flex items-center gap-2 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Analyzer
                </Button>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Saved Analyses</h2>
                    <SavedAnalysesTab onViewAnalysis={handleViewAnalysis} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full">
            {!result ? (
                <InputScreen 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                    error={error} 
                    onViewSaved={() => setViewingSaved(true)}
                />
            ) : (
                <ResultsScreen result={result} onNewAnalysis={handleNewAnalysis} onViewAnalysis={handleViewAnalysis} />
            )}
        </div>
    );
}
