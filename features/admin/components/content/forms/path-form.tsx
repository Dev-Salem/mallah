'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updatePath, createPath } from '../../../actions/admin-content-actions'
import type { AdminPath } from '../../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Loader2 } from 'lucide-react'

interface PathFormProps {
  path?: AdminPath
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PathForm({ path, open, onOpenChange, onSuccess }: PathFormProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')

  const isEditing = !!path

  const [formData, setFormData] = useState({
    name: path?.name || '',
    short_description: path?.short_description || '',
    path_id: path?.path_id || '',
    is_active: path?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        const result = await updatePath(path.path_id, {
          name: formData.name,
          short_description: formData.short_description,
          is_active: formData.is_active,
        })
        if (!result.success) { setError(result.error || tc('error')); return }
      } else {
        const slug = formData.path_id || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const result = await createPath({ ...formData, path_id: slug })
        if (!result.success) { setError(result.error || tc('error')); return }
      }
      onOpenChange(false)
      onSuccess?.()
    } catch {
      setError(tc('error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? t('edit') : t('add')}</SheetTitle>
          <SheetDescription>
            {isEditing ? t('editDescription') : t('addDescription')}
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
              {t('slug')} {isEditing && <span className="text-muted-foreground">(Read-Only)</span>}
            </Label>
            <Input
              id="path-slug"
              value={formData.path_id}
              onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
              disabled={isEditing}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>{tc('cancel')}</Button>
          <Button onClick={handleSave} disabled={saving || !formData.name}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? tc('saving') : tc('confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
