import { useTranslations } from 'next-intl'
import { getAdminPaths } from '../../../../../../../features/admin/actions/admin-content-actions'
import { TopicsBrowser } from '../../../../../../../features/admin/components/content/topics-browser'

export default async function AdminTopicsPage() {
  const t = useTranslations('Admin.Content.Topics')
  const paths = await getAdminPaths()

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

      <TopicsBrowser paths={paths} />
    </div>
  )
}
