'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updatePath, createPath } from '../../actions/admin-content-actions'
import type { AdminPath } from '../../types'
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

interface PathsTableProps {
  initialPaths: AdminPath[]
}

export function PathsTable({ initialPaths }: PathsTableProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')
  
  const [paths] = useState(initialPaths)
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingPath, setEditingPath] = useState<AdminPath | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    path_id: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingPath(null)
    setFormData({ name: '', short_description: '', path_id: '', is_active: true })
    setShowDrawer(true)
  }

  const openEdit = (path: AdminPath) => {
    setEditingPath(path)
    setFormData({
      name: path.name,
      short_description: path.short_description,
      path_id: path.path_id,
      is_active: path.is_active,
    })
    setShowDrawer(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (editingPath) {
        const result = await updatePath(editingPath.path_id, {
          name: formData.name,
          short_description: formData.short_description,
          is_active: formData.is_active,
        })
        if (!result.success) setError(result.error || 'Failed to update')
        else setShowDrawer(false)
      } else {
        const slug = formData.path_id || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const result = await createPath({
          ...formData,
          path_id: slug,
        })
        if (!result.success) setError(result.error || 'Failed to create')
        else setShowDrawer(false)
      }
    } catch {
      setError(tc('error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (path: AdminPath) => {
    const confirmed = window.confirm(t('deactivateConfirm', { count: path.learner_count }))
    if (!confirmed) return

    await updatePath(path.path_id, { is_active: false })
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          + {t('add')}
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{tc('status')}</TableHead>
              <TableHead className="text-right">{t('stages')}</TableHead>
              <TableHead className="text-right">{t('learners')}</TableHead>
              <TableHead className="text-right">{tc('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paths.map((path) => (
              <TableRow key={path.path_id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {path.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{path.path_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={path.is_active ? 'default' : 'secondary'}
                    className={path.is_active ? 'bg-success/10 text-success border-success/20' : ''}
                  >
                    {path.is_active ? tc('active') : tc('inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                  {path.stage_count}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                  {path.learner_count}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="xs" onClick={() => openEdit(path)}>
                      {tc('edit')}
                    </Button>
                    {path.is_active && (
                      <Button variant="ghost" size="xs" onClick={() => handleDeactivate(path)}
                        className="text-warning hover:text-warning"
                      >
                        {tc('deactivate')}
                      </Button>
                    )}
                  </div>
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
              {editingPath ? t('edit') : t('add')}
            </SheetTitle>
            <SheetDescription>
              {editingPath ? t('editDescription') : t('addDescription')}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="path-name">{t('name')}</Label>
              <Input
                id="path-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="path-desc">{t('description_label')}</Label>
              <textarea
                id="path-desc"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="path-slug">
                {t('slug')} {editingPath && <span className="text-muted-foreground">(Read-Only)</span>}
              </Label>
              <Input
                id="path-slug"
                value={formData.path_id}
                onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
                disabled={!!editingPath}
                placeholder={t('slugPlaceholder')}
                className="font-mono"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-input p-3">
              <div className="space-y-0.5">
                <Label>{tc('active')}</Label>
                <p className="text-xs text-muted-foreground">{t('visibleToAll')}</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
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
            <Button onClick={handleSave} disabled={saving || !formData.name}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? tc('saving') : tc('confirm')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
