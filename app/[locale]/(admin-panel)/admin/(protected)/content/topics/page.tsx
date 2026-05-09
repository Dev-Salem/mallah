import { getTranslations } from 'next-intl/server'
import { getAdminPaths } from '../../../../../../../features/admin/actions/admin-content-actions'
import { TopicsBrowser } from '../../../../../../../features/admin/components/content/topics-browser'

export default async function AdminTopicsPage() {
  const t = await getTranslations('Admin.Content.Topics')
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

      <TopicsBrowser paths={paths} />
    </div>
  )
}
