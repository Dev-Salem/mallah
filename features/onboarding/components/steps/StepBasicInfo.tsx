"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface StepBasicInfoProps {
    initialFirstName: string;
    initialLastName: string;
    onSave: (firstName: string, lastName: string) => Promise<void>;
}

export function StepBasicInfo({
    initialFirstName,
    initialLastName,
    onSave,
}: StepBasicInfoProps) {
    const t = useTranslations("Onboarding");
    const [firstName, setFirstName] = useState(initialFirstName || "");
    const [lastName, setLastName] = useState(initialLastName || "");
    const [loading, setLoading] = useState(false);

    const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    async function handleSubmit() {
        if (!isValid) return;
        setLoading(true);
        try {
            await onSave(firstName, lastName);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step1Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step1Subtitle")}
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">
                        {t("firstName")}
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                        placeholder={t("firstNamePlaceholder")}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">
                        {t("lastName")}
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                        placeholder={t("lastNamePlaceholder")}
                    />
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className="w-full h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
            >
                {t("saveAndContinue")}
                <ArrowRight className="ms-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    );
}
