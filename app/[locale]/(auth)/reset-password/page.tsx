"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { resetPassword } from "@/features/auth/actions/auth-actions";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import type { AuthFormState } from "@/features/auth/types";

const initialState: AuthFormState = { error: null, success: null };

function ResetPasswordForm() {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [state, formAction, isPending] = useActionState(
        resetPassword,
        initialState
    );

    return (
        <form action={formAction} className="space-y-6">
            {state.error && (
                <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono uppercase tracking-wider">
                    <span className="text-destructive/60 me-2">ERR:</span>
                    {state.error}
                </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                >
                    <Lock className="h-3 w-3" />
                    {t("newPasswordLabel")}
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <p
                    className={`text-[9px] font-mono text-white/20 uppercase ${!isArabic ? "tracking-widest" : ""}`}
                >
                    {t("passwordHint")}
                </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label
                    htmlFor="confirmPassword"
                    className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                >
                    <Lock className="h-3 w-3" />
                    {t("confirmPasswordLabel")}
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 cursor-pointer"
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        {t("resetPasswordButton")}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

// This is the page default export - needs to be a separate component since page.tsx
// in (auth) route group is in a client boundary
import { Logo } from "@/components/ui/logo";
import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isArabic = locale === "ar";

    return (
        <>
            <div className="text-center mb-12">
                <div className="inline-block transform hover:rotate-12 transition-transform duration-500 mb-8 p-1 border border-primary/20 glass">
                    <Logo size={64} />
                </div>
                <h1
                    className={`text-3xl font-black text-white mb-2 uppercase ${!isArabic ? "tracking-tighter" : ""}`}
                >
                    {t("resetPasswordTitle")}
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-1 bg-primary animate-pulse" />
                    <p
                        className={`text-[10px] uppercase ${!isArabic ? "tracking-[0.4em]" : ""} text-primary font-bold`}
                    >
                        {t("resetPasswordSubtitle")}
                    </p>
                </div>
            </div>

            <Card className="glass border-primary/20 rounded-none p-8 relative overflow-hidden group glow-border">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <ResetPasswordForm />
            </Card>
        </>
    );
}
