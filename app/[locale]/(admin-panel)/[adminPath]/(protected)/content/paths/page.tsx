import { getTranslations } from 'next-intl/server'
import { getAdminPaths } from '../../../../../../../features/admin/actions/admin-content-actions'
import { PathsTable } from '../../../../../../../features/admin/components/content/paths-table'

export default async function AdminPathsPage() {
  const t = await getTranslations('Admin.Content.Paths')
  const paths = await getAdminPaths()

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

      <PathsTable initialPaths={paths} />
    </div>
  )
}
