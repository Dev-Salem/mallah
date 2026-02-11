import AuthForm from '@/components/auth/auth-form'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Navigational Decor */}
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_center,var(--primary),transparent_70%)] opacity-10 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 h-[500px] w-[500px] bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size={48} className="mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your career journey.</p>
        </div>

        <div className="glass border-white/10 p-8 rounded-2xl shadow-2xl">
          <AuthForm />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to Mallah's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
