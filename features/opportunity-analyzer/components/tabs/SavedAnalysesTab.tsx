'use client';
import { useEffect, useState } from 'react';
import { getSavedAnalysesAction, deleteAnalysisAction } from '../../actions/analyzer.action';
import { createApplicationAction, getTrackedAnalysesIdsAction } from '@/features/application-tracker/actions/tracker.actions';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ArrowRight, ClipboardList, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SavedAnalysesTab({ onViewAnalysis }: { onViewAnalysis?: (analysis: OpportunityAnalysisResult) => void }) {
    const router = useRouter();
    const [saved, setSaved] = useState<OpportunityAnalysisResult[]>([]);
    const [trackedIds, setTrackedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [promotingId, setPromotingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyses, tracked] = await Promise.all([
                    getSavedAnalysesAction(),
                    getTrackedAnalysesIdsAction()
                ]);
                setSaved(analyses);
                setTrackedIds(tracked);
            } catch {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleAddToTracker = async (analysis: OpportunityAnalysisResult) => {
        if (!analysis.analysis_id) return;
        setPromotingId(analysis.analysis_id);
        
        try {
            const res = await createApplicationAction({
                company_name: analysis.company_name || "Unknown Company",
                role_title: analysis.job_title || "Unknown Role",
                location: analysis.location,
                stage: "applied",
                date: new Date().toISOString().split('T')[0],
                analysis_id: analysis.analysis_id,
                notes: `Imported from Opportunity Analyzer (Score: ${analysis.match_score}%)`
            });

            if (res.success) {
                setTrackedIds([...trackedIds, analysis.analysis_id]);
                toast.success("Added to Application Tracker");
            } else {
                toast.error(res.error || "Failed to add to tracker");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setPromotingId(null);
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
            {saved.map((analysis) => {
                const isTracked = analysis.analysis_id && trackedIds.includes(analysis.analysis_id);
                
                return (
                    <Card key={analysis.analysis_id} className="hover:border-primary/50 transition-colors group">
                        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-lg">{analysis.job_title || 'Unknown Role'}</h4>
                                    {isTracked && (
                                        <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                                            <Check className="w-3 h-3" /> In Tracker
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                                    <span>{analysis.company_name || 'Unknown Company'}</span>
                                    <span>•</span>
                                    <span>Score: {analysis.match_score}%</span>
                                    <span>•</span>
                                    <span>{analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : ''}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                {!isTracked ? (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleAddToTracker(analysis)}
                                        disabled={promotingId === analysis.analysis_id}
                                        className="w-full sm:w-auto hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                    >
                                        {promotingId === analysis.analysis_id ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <ClipboardList className="w-4 h-4 mr-2" />
                                        )}
                                        Add to Tracker
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => router.push('/dashboard/tracker')}
                                        className="w-full sm:w-auto text-muted-foreground hover:text-primary"
                                    >
                                        View in Tracker
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => handleDelete(analysis.analysis_id)} className="w-full sm:w-auto text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" className="w-full sm:w-auto" onClick={() => onViewAnalysis?.(analysis)}>
                                    View Report <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
