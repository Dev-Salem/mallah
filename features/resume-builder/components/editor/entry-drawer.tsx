"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export default function EntryDrawer({ open, onOpenChange, title, children }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto P-6">
        <SheetHeader className="mb-6">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        
        {children}
        
      </SheetContent>
    </Sheet>
  );
}
