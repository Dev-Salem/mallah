import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/routing";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthErrorPage() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 scanline z-[101] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block mb-8 p-4 border border-destructive/20 glass animate-pulse">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
            Access Denied
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 bg-destructive animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-destructive font-bold">
              AUTH_CODE_EXCHANGE_FAILURE
            </p>
          </div>
        </div>

        <div className="glass border-destructive/20 rounded-none p-8 relative overflow-hidden group glow-border-destructive">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-destructive scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          
          <div className="space-y-6 text-center">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed uppercase">
              The authentication code is invalid, expired, or has already been used. Please try requesting a new magic link.
            </p>
            
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 border-destructive/20 hover:bg-destructive/10 text-destructive rounded-none uppercase tracking-[0.2em] font-mono text-[10px] transition-all group">
                  <ArrowLeft className="mr-3 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                  Retry Authorization
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
            <span>ERR_CODE: 0xAUTH_02</span>
            <span>SYSTEM_FAILURE_LOGGED</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-3">
            Back to Surface
          </Link>
        </div>
      </div>
    </div>
  )
}
