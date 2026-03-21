import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AtsSidebar({ score, hints = [], isJobBased }: { score: number | null, hints: any[], isJobBased: boolean }) {
    const displayScore = score || 0;
    const isGood = displayScore >= 75;

    return (
        <aside className="w-[300px] border-r bg-background flex flex-col overflow-y-auto shrink-0 z-10 shadow-sm">
            <div className="p-6 border-b text-center space-y-4">
                <h3 className="font-semibold text-lg">ATS Score</h3>
                <div className="relative inline-flex items-center justify-center">
                    <div className="text-4xl font-bold flex flex-col items-center">
                        <span className={isGood ? "text-green-600" : "text-amber-500"}>{displayScore}</span>
                        <span className="text-xs text-muted-foreground font-normal">/ 100</span>
                    </div>
                </div>
                <Progress value={displayScore} className="h-2" />
                <p className="text-sm text-muted-foreground">
                    {displayScore > 0 ? (
                        isGood ? "Great job! This resume is competitive." : "Improve your score to pass automated filters."
                    ) : (
                        "Save the resume to generate an ATS score."
                    )}
                </p>
            </div>
            
            <div className="p-4 flex-1">
                <h4 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">Actionable Hints</h4>
                {hints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-muted-foreground h-40">
                        <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                        <span className="text-sm">No critical issues found or analysis pending. Save to re-analyze.</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {hints.map((hint, idx) => (
                            <div key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-md flex items-start space-x-3">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="text-sm font-semibold">{hint.issue}</p>
                                    <p className="text-xs text-amber-800/80 mt-1">{hint.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
