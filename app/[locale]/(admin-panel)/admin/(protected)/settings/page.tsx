import { getTranslations } from 'next-intl/server'
import { getAdminAccounts } from '../../../../../../features/admin/actions/admin-content-actions'
import { AdminAccountsTable } from '../../../../../../features/admin/components/settings/admin-accounts-table'

export default async function AdminSettingsPage() {
  const t = await getTranslations('Admin.Settings')
  const admins = await getAdminAccounts()

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

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">{t('admins')}</h2>
        <AdminAccountsTable initialAdmins={admins} />
      </div>
    </div>
  )
}
