import { getTranslations } from 'next-intl/server'
import {
  getDashboardStats,
  getPathOverviews,
  getContentWarnings,
  getRecentAuditEntries,
} from '../../../../../../features/admin/actions/admin-content-actions'
import { getCurrentAdmin } from '../../../../../../features/admin/actions/admin-auth-actions'
import { DashboardStatsCards } from '../../../../../../features/admin/components/dashboard/dashboard-stats-cards'
import { PathOverviewTable } from '../../../../../../features/admin/components/dashboard/path-overview-table'
import { ContentWarnings } from '../../../../../../features/admin/components/dashboard/content-warnings'
import { RecentActivity } from '../../../../../../features/admin/components/dashboard/recent-activity'
import { QuickActions } from '../../../../../../features/admin/components/dashboard/quick-actions'

export default async function AdminDashboardPage() {
  const t = await getTranslations('Admin.Dashboard')
  
  const [stats, pathOverviews, warnings, recentActivity, admin] = await Promise.all([
    getDashboardStats(),
    getPathOverviews(),
    getContentWarnings(),
    getRecentAuditEntries(10),
    getCurrentAdmin(),
  ])

  const adminBasePath = process.env.ADMIN_PANEL_PATH || ''

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-4xl font-black text-white tracking-tightest uppercase italic">
          {t('title')}
        </h1>
        <p className="text-sm text-zinc-500 font-medium max-w-2xl">
          {t('subtitle')}
        </p>
        <div className="h-1 w-16 bg-blue-600/50 rounded-full mt-2" />
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards stats={stats} adminBasePath={adminBasePath} />

      {/* Quick Actions */}
      <QuickActions
        adminBasePath={adminBasePath}
        isSuperAdmin={admin?.adminLevel === 'super'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Content Warnings */}
          {warnings.length > 0 && <ContentWarnings warnings={warnings} />}
          
          {/* Path Overview */}
          <PathOverviewTable paths={pathOverviews} />
        </div>

        <div className="space-y-8">
          {/* Recent Activity */}
          <RecentActivity entries={recentActivity} />
        </div>
      </div>
    </div>
  )
}
