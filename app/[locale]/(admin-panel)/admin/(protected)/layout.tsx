import { getCurrentAdmin } from '@/features/admin/actions/admin-auth-actions'
import { AdminSidebar } from '@/features/admin/components/layout/admin-sidebar'
import { redirect } from 'next/navigation'

export default async function AdminProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const admin = await getCurrentAdmin()

  if (!admin) {
    // Redirect to admin login within the correct localized path
    redirect(`/${locale}/admin/login`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        displayName={admin.displayName}
        adminLevel={admin.adminLevel}
      />
      <main className="ml-60 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
