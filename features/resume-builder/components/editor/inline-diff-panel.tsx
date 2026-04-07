"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InlineDiffPanelProps {
  originalText: string;
  suggestedText: string;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function InlineDiffPanel({
  originalText,
  suggestedText,
  onAccept,
  onReject,
  isLoading,
}: InlineDiffPanelProps) {
  if (isLoading) {
    return (
      <Card className="p-4 mt-2 bg-muted/50 border-primary/20 animate-pulse">
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          AI is rewriting your text...
        </div>
      </Card>
    );
  }

  if (!suggestedText) return null;

  return (
    <Card className="p-4 mt-2 bg-primary/5 border-primary/20 rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-3 cursor-default">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          AI Suggestion
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onReject}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={onAccept}
            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-1" />
            Accept
          </Button>
        </div>
      </div>
      <div className="text-sm leading-relaxed text-foreground/90 bg-background/50 p-3 rounded border">
        {suggestedText}
      </div>
      <div className="mt-3 text-xs text-muted-foreground line-through opacity-70 px-1 line-clamp-2">
        {originalText}
      </div>
    </Card>
  );
}
