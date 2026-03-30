'use client';
import { useEffect, useState } from 'react';
import { getSavedAnalysesAction, deleteAnalysisAction } from '../../actions/analyzer.action';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function SavedAnalysesTab({ onViewAnalysis }: { onViewAnalysis?: (analysis: OpportunityAnalysisResult) => void }) {
    const [saved, setSaved] = useState<OpportunityAnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const data = await getSavedAnalysesAction();
                setSaved(data);
            } catch {
                toast.error("Failed to load saved analyses");
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, []);

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        try {
            await deleteAnalysisAction(id);
            setSaved(saved.filter(s => s.analysis_id !== id));
            toast.success("Analysis deleted");
        } catch {
            toast.error("Failed to delete analysis");
        }
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }

    if (saved.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <p>No saved analyses found.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {saved.map((analysis) => (
                <Card key={analysis.analysis_id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-lg">{analysis.job_title || 'Unknown Role'}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span>{analysis.company_name || 'Unknown Company'}</span>
                                <span>•</span>
                                <span>Score: {analysis.match_score}%</span>
                                <span>•</span>
                                <span>{analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : ''}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <Button variant="outline" size="sm" onClick={() => handleDelete(analysis.analysis_id)} className="w-full sm:w-auto text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                            <Button size="sm" className="w-full sm:w-auto" onClick={() => {
                                if (onViewAnalysis) {
                                    onViewAnalysis(analysis);
                                } else {
                                    toast.info("Container not configured for viewing this item yet.");
                                }
                            }}>
                                View <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
