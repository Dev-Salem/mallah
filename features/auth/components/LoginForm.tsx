"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { login } from "../actions/auth-actions";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import type { AuthFormState } from "../types";

const initialState: AuthFormState = { error: null, success: null };

export function LoginForm() {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <form action={formAction} className="space-y-6">
            {state.error && (
                <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono uppercase tracking-wider">
                    <span className="text-destructive/60 me-2">ERR:</span>
                    {state.error}
                </div>
            )}

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

            {/* Password */}
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                >
                    <Lock className="h-3 w-3" />
                    {t("passwordLabel")}
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className={`text-[10px] font-mono text-primary/60 uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary transition-colors`}
                >
                    {t("forgotPassword")}
                </Link>
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
                        {t("loginButton")}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-white/5">
                <span className={`text-[10px] font-mono text-white/30 uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                    {t("noAccount")}{" "}
                </span>
                <Link
                    href="/register"
                    className={`text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary/80 transition-colors`}
                >
                    {t("registerLink")}
                </Link>
            </div>
        </form>
    );
}
