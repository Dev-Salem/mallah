"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { register } from "../actions/auth-actions";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";
import type { AuthFormState } from "../types";

const initialState: AuthFormState = { error: null, success: null };

export function RegisterForm() {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [state, formAction, isPending] = useActionState(register, initialState);

    if (state.success === "CHECK_EMAIL") {
        return (
            <div className="space-y-6 text-center">
                <div className="inline-block p-4 border border-primary/20 bg-primary/5">
                    <Mail className="h-10 w-10 text-primary" />
                </div>
                <h3 className={`text-lg font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""}`}>
                    {t("checkEmailTitle")}
                </h3>
                <p className={`text-xs font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                    {t("checkEmailDesc")}
                </p>
                <Link
                    href="/login"
                    className={`inline-flex items-center gap-2 text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary/80 transition-colors`}
                >
                    {t("backToLogin")}
                </Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-5">
            {state.error && (
                <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono uppercase tracking-wider">
                    <span className="text-destructive/60 me-2">ERR:</span>
                    {state.error}
                </div>
            )}

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor="firstName"
                        className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                    >
                        <User className="h-3 w-3" />
                        {t("firstNameLabel")}
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder={t("firstNamePlaceholder")}
                        className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="lastName"
                        className={`block text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} flex items-center gap-2`}
                    >
                        <User className="h-3 w-3" />
                        {t("lastNameLabel")}
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder={t("lastNamePlaceholder")}
                        className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

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
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 bg-transparent border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <p className={`text-[9px] font-mono text-white/20 uppercase ${!isArabic ? "tracking-widest" : ""}`}>
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
                        {t("registerButton")}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-white/5">
                <span className={`text-[10px] font-mono text-white/30 uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                    {t("hasAccount")}{" "}
                </span>
                <Link
                    href="/login"
                    className={`text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""} hover:text-primary/80 transition-colors`}
                >
                    {t("loginLink")}
                </Link>
            </div>
        </form>
    );
}
