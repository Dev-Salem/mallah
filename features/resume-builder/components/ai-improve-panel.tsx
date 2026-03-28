"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";

interface AIImprovePanelProps {
  originalText: string;
  suggestedText: string;
  onAccept: (text: string) => void;
  onReject: () => void;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function AIImprovePanel({
  originalText,
  suggestedText,
  onAccept,
  onReject,
  onRetry,
  isRetrying = false,
}: AIImprovePanelProps) {
  // Simple word-level visual diff highlight logic could go here, 
  // but for simplicity we'll show them side-by-side or stacked cleanly.

  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 p-4 my-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-3 border-b border-primary/20 pb-2">
        <h4 className="text-sm font-semibold text-primary">AI Suggestion</h4>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={onRetry}
            disabled={isRetrying}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isRetrying ? "animate-spin" : ""}`} />
            Try Again
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Original */}
        <div className="bg-background/50 rounded p-3 border border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Original
          </span>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
            {originalText || <span className="italic opacity-50">Empty</span>}
          </p>
        </div>

        {/* Suggestion */}
        <div className="bg-background rounded p-3 border border-primary/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
            Suggested
          </span>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {suggestedText}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={onReject}>
          <X className="w-4 h-4 mr-1.5" /> Keep Original
        </Button>
        <Button size="sm" onClick={() => onAccept(suggestedText)}>
          <Check className="w-4 h-4 mr-1.5" /> Use Suggestion
        </Button>
      </div>
    </div>
  );
}
