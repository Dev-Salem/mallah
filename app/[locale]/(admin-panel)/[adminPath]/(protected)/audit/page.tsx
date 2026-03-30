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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
          {t('title')}
        </h1>
        <p className="text-sm text-zinc-500 font-medium max-w-2xl">
          {t('subtitle')}
        </p>
        <div className="h-1 w-12 bg-blue-600/50 rounded-full mt-2" />
      </div>

      <AuditLogTable initialEntries={entries} totalCount={total} currentPage={page} />
    </div>
  )
}
