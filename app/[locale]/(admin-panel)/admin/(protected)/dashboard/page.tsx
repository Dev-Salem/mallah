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


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions
        isSuperAdmin={admin?.adminLevel === 'super'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Content Warnings */}
          {warnings.length > 0 && <ContentWarnings warnings={warnings} />}
          
          {/* Path Overview */}
          <PathOverviewTable paths={pathOverviews} />
        </div>

        <div className="space-y-6">
          {/* Recent Activity */}
          <RecentActivity entries={recentActivity} />
        </div>
      </div>
    </div>
  )
}
