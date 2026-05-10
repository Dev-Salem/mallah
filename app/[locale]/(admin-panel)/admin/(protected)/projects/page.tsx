import { getTranslations } from 'next-intl/server'
import { getAdminProjects, getAdminUserProjects } from '../../../../../../features/admin/actions/admin-content-actions'
import { ProjectsTable } from '../../../../../../features/admin/components/projects/projects-table'
import { UserProjectsTable } from '../../../../../../features/admin/components/projects/user-projects-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AdminProjectsPage() {
  const t = await getTranslations('Admin.Projects')
  const [projects, userProjects] = await Promise.all([
    getAdminProjects(),
    getAdminUserProjects(),
  ])

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

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">{t('tabCatalog')}</TabsTrigger>
          <TabsTrigger value="submissions">{t('tabSubmissions')} ({userProjects.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog" className="mt-4">
          <ProjectsTable initialProjects={projects} />
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <UserProjectsTable submissions={userProjects} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
