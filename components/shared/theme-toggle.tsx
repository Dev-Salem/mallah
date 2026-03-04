"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-8 h-8 rounded-none border border-primary/10 bg-primary/5 animate-pulse" />
        );
    }

    const cycleTheme = () => {
        if (theme === "dark") setTheme("light");
        else if (theme === "light") setTheme("system");
        else setTheme("dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="relative w-8 h-8 rounded-none border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group overflow-hidden"
        >
            <div className="absolute inset-x-0 h-px top-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="absolute inset-x-0 h-px bottom-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />

            <div className="relative z-10 flex items-center justify-center">
                {theme === "dark" && (
                    <Moon className="w-4 h-4 text-primary transition-all duration-300 animate-in zoom-in-50" />
                )}
                {theme === "light" && (
                    <Sun className="w-4 h-4 text-primary transition-all duration-300 animate-in zoom-in-50" />
                )}
                {(theme === "system" || !theme) && (
                    <Monitor className="w-4 h-4 text-primary transition-all duration-300 animate-in zoom-in-50" />
                )}
            </div>

            {/* Visual Feedback for HUD style */}
            <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-primary/40" />
            <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-primary/40" />
        </Button>
    );
}
