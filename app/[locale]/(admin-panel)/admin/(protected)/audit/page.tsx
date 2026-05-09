import { getTranslations } from 'next-intl/server'
import { getAuditLog } from '../../../../../../features/admin/actions/admin-content-actions'
import { AuditLogTable } from '../../../../../../features/admin/components/audit/audit-log-table'

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const t = await getTranslations('Admin.Audit')
  const page = parseInt(searchParams.page || '1')
  const { entries, total } = await getAuditLog(page)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <AuditLogTable initialEntries={entries} totalCount={total} currentPage={page} />
    </div>
  )
}
