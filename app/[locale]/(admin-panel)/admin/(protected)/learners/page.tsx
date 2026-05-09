import { getTranslations } from 'next-intl/server'
import { getAdminLearners } from '../../../../../../features/admin/actions/admin-content-actions'
import { LearnersTable } from '../../../../../../features/admin/components/learners/learners-table'

export default async function AdminLearnersPage() {
  const t = await getTranslations('Admin.Learners')
  const learners = await getAdminLearners()

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

      <LearnersTable initialLearners={learners} />
    </div>
  )
}
