"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { forgotPassword } from "../actions/auth-actions";
import { Link } from "@/lib/i18n/routing";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import type { AuthFormState } from "../types";

const initialState: AuthFormState = { error: null, success: null };

export function ForgotPasswordForm() {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [state, formAction, isPending] = useActionState(forgotPassword, initialState);

    if (state.success === "RESET_LINK_SENT") {
        return (
            <div className="space-y-6 text-center">
                <div className="inline-block p-4 border border-primary/20 bg-primary/5">
                    <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className={`text-lg font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""}`}>
                    {t("resetLinkSentTitle")}
                </h3>
                <p className={`text-xs font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                    {t("resetLinkSentDesc")}
                </p>
                <Link
                    href="/login"
                    className={`inline-flex items-center gap-2 text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary/80 transition-colors`}
                >
                    <ArrowLeft className="h-3 w-3" />
                    {t("backToLogin")}
                </Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6">
            {state.error && (
                <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono uppercase tracking-wider">
                    <span className="text-destructive/60 me-2">ERR:</span>
                    {state.error}
                </div>
            )}

            <p className={`text-xs font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                {t("forgotPasswordDesc")}
            </p>

            {/* Email */}
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                >
                    <Mail className="h-3 w-3" />
                    {t("emailLabel")}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
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
                        {t("sendResetLink")}
                    </>
                )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-white/5">
                <Link
                    href="/login"
                    className={`inline-flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary transition-colors group`}
                >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    {t("backToLogin")}
                </Link>
            </div>
        </form>
    );
}
