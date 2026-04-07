import { getCurrentAdmin } from '@/features/admin/actions/admin-auth-actions'
import { AdminSidebar } from '@/features/admin/components/layout/admin-sidebar'
import { redirect } from 'next/navigation'

const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || ''

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
    // Redirect to admin login within the correct localized obfuscated path
    redirect(`/${locale}/${ADMIN_PANEL_PATH}/login`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        displayName={admin.displayName}
        adminLevel={admin.adminLevel}
        adminBasePath={ADMIN_PANEL_PATH}
      />
      <main className="ml-60 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
