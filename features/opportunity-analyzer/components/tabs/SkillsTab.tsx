'use client';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

export function SkillsTab({ result }: { result: OpportunityAnalysisResult }) {
    const { matched, partial, missing } = result.skills_breakdown;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-green-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> 
                        You Have
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {matched.map((s, i) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{s.skill_name}</span>
                                {s.is_verified ? (
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Verified</Badge>
                                ) : (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> CV
                                    </Badge>
                                )}
                            </div>
                            {s.current_level && <span className="text-xs text-muted-foreground capitalize">Level: {s.current_level}</span>}
                        </div>
                    ))}
                    {matched.length === 0 && <p className="text-sm text-muted-foreground italic">No matching skills found.</p>}
                </CardContent>
            </Card>

            <Card className="border-amber-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" /> 
                        Partial Match
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {partial.map((s, i) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                            <span className="font-semibold">{s.skill_name}</span>
                            <Badge variant="secondary" className="w-fit text-amber-500 bg-amber-500/10">Needs Improvement</Badge>
                            {s.match_reason && <span className="text-xs text-muted-foreground">{s.match_reason}</span>}
                        </div>
                    ))}
                    {partial.length === 0 && <p className="text-sm text-muted-foreground italic">No partial matches.</p>}
                </CardContent>
            </Card>

            <Card className="border-red-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" /> 
                        Missing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {missing.required.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Required</p>
                            <div className="flex flex-wrap gap-2">
                                {missing.required.map((s, i) => (
                                    <Badge key={i} variant="destructive" className="whitespace-normal h-auto py-1 text-left">{s}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {missing.preferred.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred</p>
                            <div className="flex flex-wrap gap-2">
                                {missing.preferred.map((s, i) => (
                                    <Badge key={i} variant="outline" className="text-muted-foreground whitespace-normal h-auto py-1 text-left">{s}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {missing.required.length === 0 && missing.preferred.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No skills missing. Great job!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
