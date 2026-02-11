import AuthForm from '@/components/auth/auth-form'
import { Badge } from '@/components/ui/badge'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 h-[400px] w-[400px] bg-purple-600/5 blur-[100px]" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <span className="font-bold text-white text-2xl">M</span>
          </div>
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
