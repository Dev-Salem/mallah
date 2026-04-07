"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightSideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function RightSideDrawer({
  open,
  onOpenChange,
  title,
  children,
}: RightSideDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md p-0 flex flex-col h-full border-l shadow-2xl"
        side="right"
      >
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
