import { ForgotPasswordForm } from "@/features/auth";
import { Logo } from "@/components/ui/logo";
import { Card } from "@/components/ui/card";
import { getTranslations, getLocale } from "next-intl/server";

export default async function ForgotPasswordPage() {
    const t = await getTranslations("Auth");
    const locale = await getLocale();
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
                    {t("forgotPasswordTitle")}
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-1 bg-primary animate-pulse" />
                    <p
                        className={`text-[10px] uppercase ${!isArabic ? "tracking-[0.4em]" : ""} text-primary font-bold`}
                    >
                        {t("forgotPasswordSubtitle")}
                    </p>
                </div>
            </div>

            <Card className="glass border-primary/20 rounded-none p-8 relative overflow-hidden group glow-border">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <ForgotPasswordForm />
            </Card>
        </>
    );
}
