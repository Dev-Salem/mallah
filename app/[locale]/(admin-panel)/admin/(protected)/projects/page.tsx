import { getTranslations } from 'next-intl/server'
import { getAdminProjects } from '../../../../../../features/admin/actions/admin-content-actions'
import { ProjectsTable } from '../../../../../../features/admin/components/projects/projects-table'

export default async function AdminProjectsPage() {
  const t = await getTranslations('Admin.Projects')
  const projects = await getAdminProjects()

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

      <ProjectsTable initialProjects={projects} />
    </div>
  )
}
