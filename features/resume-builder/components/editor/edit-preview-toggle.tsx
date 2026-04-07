"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Eye } from "lucide-react";

interface EditPreviewToggleProps {
  mode: "edit" | "preview";
  onChange: (mode: "edit" | "preview") => void;
}

export function EditPreviewToggle({ mode, onChange }: EditPreviewToggleProps) {
  return (
    <div className="flex bg-muted p-1 rounded-md">
      <Button
        variant={mode === "edit" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("edit")}
        className="w-24 text-xs h-8"
      >
        <Edit2 className="w-3 h-3 mr-2" />
        Edit
      </Button>
      <Button
        variant={mode === "preview" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("preview")}
        className="w-24 text-xs h-8"
      >
        <Eye className="w-3 h-3 mr-2" />
        Preview
      </Button>
    </div>
  );
}
