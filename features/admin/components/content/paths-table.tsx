'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updatePath } from '../../actions/admin-content-actions'
import type { AdminPath } from '../../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PathForm } from './forms/path-form'

interface PathsTableProps {
  initialPaths: AdminPath[]
}

export function PathsTable({ initialPaths }: PathsTableProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')

  const [paths] = useState(initialPaths)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPath, setEditingPath] = useState<AdminPath | null>(null)

  const openCreate = () => {
    setEditingPath(null)
    setFormOpen(true)
  }

  const openEdit = (path: AdminPath) => {
    setEditingPath(path)
    setFormOpen(true)
  }

  const handleDeactivate = async (path: AdminPath) => {
    const confirmed = window.confirm(t('deactivateConfirm', { count: path.learner_count }))
    if (!confirmed) return
    await updatePath(path.path_id, { is_active: false })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>+ {t('add')}</Button>
      </div>

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
                    <span className="font-medium text-foreground">{path.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{path.path_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={path.is_active ? 'default' : 'secondary'}
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
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDeactivate(path)}
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

      <PathForm
        path={editingPath ?? undefined}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  )
}
