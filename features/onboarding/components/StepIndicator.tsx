"use client";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2 mb-10">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={step} className="flex items-center gap-2">
                        <div
                            className={`
                h-2 transition-all duration-500
                ${isActive ? "w-10 bg-primary" : isCompleted ? "w-6 bg-primary/60" : "w-4 bg-white/10"}
              `}
                        />
                    </div>
                );
            })}
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em] ms-3">
                {currentStep}/{totalSteps}
            </span>
        </div>
    );
}
