"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { User, BookOpen, Bot, Shield, Save, Check } from "lucide-react";
import type { ProfileData } from "../types";
import { updateProfile, updatePreferences, changePassword } from "../actions/profile-actions";

interface ProfileSettingsClientProps {
    data: ProfileData;
}

export function ProfileSettingsClient({ data }: ProfileSettingsClientProps) {
    const t = useTranslations("Settings");
    const locale = useLocale();
    const isArabic = locale === "ar";

    // Profile form state
    const [firstName, setFirstName] = useState(data.first_name);
    const [lastName, setLastName] = useState(data.last_name);
    const [backgroundType, setBackgroundType] = useState(data.background_type);
    const [primaryGoal, setPrimaryGoal] = useState(data.primary_goal);

    // Preferences form state
    const [weeklyHours, setWeeklyHours] = useState(data.weekly_learning_hours);
    const [learningStyle, setLearningStyle] = useState(data.learning_style_primary);
    const [aiLanguage, setAiLanguage] = useState(data.ai_language_pref);
    const [aiDetail, setAiDetail] = useState(data.ai_detail_level);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI state
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [prefsSaved, setPrefsSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSaveProfile() {
        setSavingProfile(true);
        setError(null);
        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName,
                background_type: backgroundType,
                primary_goal: primaryGoal,
            });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSavingProfile(false);
        }
    }

    async function handleSavePreferences() {
        setSavingPrefs(true);
        setError(null);
        try {
            await updatePreferences({
                weekly_learning_hours: weeklyHours,
                learning_style_primary: learningStyle,
                ai_language_pref: aiLanguage,
                ai_detail_level: aiDetail,
            });
            setPrefsSaved(true);
            setTimeout(() => setPrefsSaved(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSavingPrefs(false);
        }
    }

    async function handleChangePassword() {
        setError(null);
        if (newPassword !== confirmPassword) {
            setError(t("passwordMismatch"));
            return;
        }
        if (newPassword.length < 8) {
            setError(t("passwordTooShort"));
            return;
        }
        setSavingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordSaved(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPasswordSaved(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSavingPassword(false);
        }
    }

    const backgroundOptions = [
        { value: "Student", label: t("bg_Student") },
        { value: "FreshGraduate", label: t("bg_FreshGraduate") },
        { value: "CareerShifter", label: t("bg_CareerShifter") },
        { value: "NoTechBackground", label: t("bg_NoTechBackground") },
    ];

    const goalOptions = [
        { value: "FullTimeJob", label: t("goal_FullTimeJob") },
        { value: "Freelance", label: t("goal_Freelance") },
        { value: "OwnProject", label: t("goal_OwnProject") },
    ];

    const hoursOptions = ["0-3", "4-7", "8-12", "13+"];
    const styleOptions = [
        { value: "Video", label: t("style_Video") },
        { value: "Reading", label: t("style_Reading") },
        { value: "HandsOn", label: t("style_HandsOn") },
    ];
    const langOptions = [
        { value: "AR", label: t("lang_AR") },
        { value: "EN", label: t("lang_EN") },
        { value: "MIX", label: t("lang_MIX") },
    ];
    const detailOptions = [
        { value: "Short", label: t("detail_Short") },
        { value: "Balanced", label: t("detail_Balanced") },
        { value: "Detailed", label: t("detail_Detailed") },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className={`text-3xl lg:text-4xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}>
                    {t("title")}
                </h1>
                <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-[0.2em]" : ""}`}>
                    {t("subtitle")}
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-mono">
                    {error}
                </div>
            )}

            {/* Section 1: Profile Information */}
            <div className="glass border-white/5 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                        {t("profileSection")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("firstName")}
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-primary/40 focus:outline-none transition-colors"
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("lastName")}
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-primary/40 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Email (read-only) */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("email")}
                    </label>
                    <div className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white/40 font-mono text-sm flex items-center">
                        {data.email}
                    </div>
                </div>

                {/* Path (read-only) */}
                {data.path_name && (
                    <div>
                        <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("currentPath")}
                        </label>
                        <div className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white/40 font-mono text-sm flex items-center">
                            {data.path_name}
                        </div>
                    </div>
                )}

                {/* Background Type */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("backgroundType")}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {backgroundOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setBackgroundType(opt.value as any)}
                                className={`h-10 px-4 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all cursor-pointer ${backgroundType === opt.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Goal */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("primaryGoal")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {goalOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setPrimaryGoal(opt.value as any)}
                                className={`h-10 px-3 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all cursor-pointer ${primaryGoal === opt.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <SaveButton
                    onClick={handleSaveProfile}
                    loading={savingProfile}
                    saved={profileSaved}
                    label={t("save")}
                    savedLabel={t("saved")}
                />
            </div>

            {/* Section 2: Learning Preferences */}
            <div className="glass border-white/5 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                        {t("learningPreferences")}
                    </h2>
                </div>

                {/* Weekly Hours */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("weeklyHours")}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {hoursOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setWeeklyHours(opt)}
                                className={`h-10 border text-[10px] font-mono uppercase transition-all cursor-pointer ${weeklyHours === opt
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt} {t("hrsWeek")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Learning Style */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("learningStyle")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {styleOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setLearningStyle(opt.value as any)}
                                className={`h-10 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all cursor-pointer ${learningStyle === opt.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <SaveButton
                    onClick={handleSavePreferences}
                    loading={savingPrefs}
                    saved={prefsSaved}
                    label={t("save")}
                    savedLabel={t("saved")}
                />
            </div>

            {/* Section 3: AI Preferences */}
            <div className="glass border-white/5 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                        {t("aiPreferences")}
                    </h2>
                </div>

                {/* AI Language */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("aiLanguage")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {langOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setAiLanguage(opt.value as any)}
                                className={`h-10 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all cursor-pointer ${aiLanguage === opt.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Detail Level */}
                <div>
                    <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("aiDetailLevel")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {detailOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setAiDetail(opt.value as any)}
                                className={`h-10 border text-[10px] font-mono uppercase ${!isArabic ? "tracking-widest" : ""} transition-all cursor-pointer ${aiDetail === opt.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <SaveButton
                    onClick={handleSavePreferences}
                    loading={savingPrefs}
                    saved={prefsSaved}
                    label={t("save")}
                    savedLabel={t("saved")}
                />
            </div>

            {/* Section 4: Security */}
            <div className="glass border-white/5 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                        {t("securitySection")}
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("newPassword")}
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-primary/40 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className={`block text-[10px] font-mono text-muted-foreground uppercase mb-2 ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("confirmNewPassword")}
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-primary/40 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <SaveButton
                    onClick={handleChangePassword}
                    loading={savingPassword}
                    saved={passwordSaved}
                    label={t("changePassword")}
                    savedLabel={t("passwordChanged")}
                />
            </div>
        </div>
    );
}

function SaveButton({
    onClick,
    loading,
    saved,
    label,
    savedLabel,
}: {
    onClick: () => void;
    loading: boolean;
    saved: boolean;
    label: string;
    savedLabel: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`
                h-12 px-8 rounded-none uppercase tracking-[0.2em] font-mono text-[10px] transition-all flex items-center gap-3 cursor-pointer
                ${saved
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                ${loading ? "opacity-50 cursor-wait" : ""}
            `}
        >
            {saved ? (
                <>
                    <Check className="h-3 w-3" />
                    {savedLabel}
                </>
            ) : (
                <>
                    <Save className="h-3 w-3" />
                    {label}
                </>
            )}
        </button>
    );
}
