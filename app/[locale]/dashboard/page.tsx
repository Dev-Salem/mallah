import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { signOutAction as signOut } from "@/features/auth";
import { Logo } from "@/components/ui/logo";
import { User, ShieldCheck, LogOut, Terminal as TerminalIcon } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = await getTranslations("Dashboard");

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Get user details
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Navigator";
  const careerPath = user.user_metadata?.career_path || "UNDETERMINED";
  const userRole = user.user_metadata?.role || "STANDARD_NAVIGATOR";

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-3 px-3 py-1 border border-primary/20 bg-primary/5 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className={`text-[9px] uppercase ${locale !== 'ar' ? 'tracking-[0.4em]' : ''} text-primary font-mono font-bold`}>
              {t('sessionActive')}
            </span>
          </div>
          <h1 className={`text-4xl lg:text-6xl font-black text-white uppercase ${locale !== 'ar' ? 'tracking-tighter' : ''} mb-2`}>
            {t('title')}
          </h1>
          <p className={`text-muted-foreground font-mono text-xs uppercase ${locale !== 'ar' ? 'tracking-[0.2em]' : ''} flex items-center gap-2`}>
            <TerminalIcon className="h-3 w-3 text-primary/40" />
            IDENT_CONFIRMED: {userName}
          </p>
        </div>

        <form action={signOut}>
          <Button
            variant="outline"
            className={`h-12 px-8 border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-white rounded-none uppercase ${locale !== 'ar' ? 'tracking-[0.2em]' : ''} font-mono text-[10px] transition-all group`}
          >
            <LogOut className="mr-3 h-3 w-3 group-hover:rotate-12 transition-transform" />
            {t('signOut')}
          </Button>
        </form>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="lg:col-span-2 glass border-white/5 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Logo size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 border border-primary/20">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-white font-bold uppercase ${locale !== 'ar' ? 'tracking-widest' : ''} text-sm`}>
                  {t('authorized')}
                </h3>
                <span className={`text-[10px] font-mono text-primary/60 uppercase ${locale !== 'ar' ? 'tracking-tighter' : ''}`}>
                  USR_TYPE: {userRole}
                </span>
              </div>
            </div>

            <div className={`grid md:grid-cols-2 gap-8 text-[11px] font-mono text-muted-foreground uppercase ${locale !== 'ar' ? 'tracking-widest' : ''}`}>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Account UUID:</span>
                  <span className="text-white">{user.id.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Locale:</span>
                  <span className="text-white">{locale}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Career Path:</span>
                  <span className="text-white">{careerPath}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Security Clearance:</span>
                  <span className="text-primary">LEVEL_01</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Status:</span>
                  <span className="text-green-500 flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-12 border border-white/5 bg-white/5 text-center italic text-muted-foreground/40 font-mono text-xs">
              {t('welcome')}... System population in progress.
            </div>
          </div>
        </div>

        {/* Tactical HUD Static Card */}
        <div className="glass border-primary/20 p-8 flex flex-col items-center justify-center text-center group transition-colors hover:bg-primary/5">
          <div className="relative mb-8">
            <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20 scale-x-150 rotate-45" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20 scale-x-150 -rotate-45" />
            <Logo size={100} className="filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
          </div>
          <div className={`text-[10px] font-mono text-primary/40 uppercase ${locale !== 'ar' ? 'tracking-[0.4em]' : ''} mb-4`}>
            Tactical Telemetry
          </div>
          <div className="space-y-1 font-mono text-[9px] text-muted-foreground/60 uppercase">
            <p>LAT: 25.1972° N</p>
            <p>LNG: 55.2744° E</p>
            <p className="text-primary/20">MALLAH_STATION_ALPHA</p>
          </div>
        </div>
      </div>
    </>
  );
}
