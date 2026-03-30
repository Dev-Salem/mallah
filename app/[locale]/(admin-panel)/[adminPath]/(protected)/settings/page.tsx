import { getTranslations } from 'next-intl/server'
import { getAdminAccounts } from '../../../../../../features/admin/actions/admin-content-actions'
import { AdminAccountsTable } from '../../../../../../features/admin/components/settings/admin-accounts-table'

export default async function AdminSettingsPage() {
  const t = await getTranslations('Admin.Settings')
  const admins = await getAdminAccounts()

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

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('admins')}</h2>
        </div>
        <AdminAccountsTable initialAdmins={admins} />
      </div>
    </div>
  )
}
