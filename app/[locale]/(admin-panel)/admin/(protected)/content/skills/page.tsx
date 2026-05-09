import { getTranslations } from 'next-intl/server'
import { getAdminSkills } from '../../../../../../../features/admin/actions/admin-content-actions'
import { SkillsTable } from '../../../../../../../features/admin/components/content/skills-table'

export default async function AdminSkillsPage() {
  const t = await getTranslations('Admin.Skills')
  const skills = await getAdminSkills()

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

      <SkillsTable initialSkills={skills} />
    </div>
  )
}
