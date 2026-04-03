'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updateProject, createProject } from '../../actions/admin-content-actions'
import type { AdminProject } from '../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

interface ProjectsTableProps {
  initialProjects: AdminProject[]
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const t = useTranslations('Admin.Projects')
  const tc = useTranslations('Admin.Common')
  
  const [projects] = useState(initialProjects)
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    is_active: true,
    is_public_default: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingProject(null)
    setFormData({ title: '', description: '', difficulty_level: 'beginner', is_active: true, is_public_default: true })
    setShowDrawer(true)
  }

  const openEdit = (project: AdminProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      difficulty_level: project.difficulty_level || 'beginner',
      is_active: project.is_active,
      is_public_default: project.is_public_default,
    })
    setShowDrawer(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (editingProject) {
        const result = await updateProject(editingProject.project_id, formData)
        if (!result.success) setError(result.error || 'Failed to update')
        else setShowDrawer(false)
      } else {
        const result = await createProject(formData)
        if (!result.success) setError(result.error || 'Failed to create')
        else setShowDrawer(false)
      }
    } catch {
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          + {t('add')}
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('difficulty')}</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>{tc('status')}</TableHead>
              <TableHead className="text-right">{tc('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.project_id}>
                <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {t(project.difficulty_level as any || 'beginner')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {project.source_type === 'roadmap' ? t('roadmapLinked') : t('standalone')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={project.is_active ? 'default' : 'secondary'}
                    className={project.is_active
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {project.is_active ? t('active') : t('hidden')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="xs" onClick={() => openEdit(project)}>
                    {tc('edit')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Side Drawer */}
      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingProject ? t('edit') : t('add')}
            </SheetTitle>
            <SheetDescription>
              {editingProject ? t('editDescription') : t('addDescription')}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">{t('name')}</Label>
              <Input
                id="project-name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-desc">{t('description')}</Label>
              <textarea
                id="project-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-difficulty">{t('difficulty')}</Label>
              <select
                id="project-difficulty"
                value={formData.difficulty_level}
                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
              >
                <option value="beginner">{t('beginner')}</option>
                <option value="intermediate">{t('intermediate')}</option>
                <option value="advanced">{t('advanced')}</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-input p-3">
                <div className="space-y-0.5">
                  <Label>{t('active')}</Label>
                  <p className="text-xs text-muted-foreground">Visible to all users</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-input p-3">
                <div className="space-y-0.5">
                  <Label>{t('public')}</Label>
                  <p className="text-xs text-muted-foreground">Shared with learners by default</p>
                </div>
                <Switch
                  checked={formData.is_public_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public_default: checked })}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
              <p className="text-xs font-medium text-destructive text-center">{error}</p>
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={() => setShowDrawer(false)}>
              {tc('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving || !formData.title}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? tc('saving') : t('save')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
