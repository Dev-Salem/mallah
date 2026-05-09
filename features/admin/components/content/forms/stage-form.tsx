'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createStage, updateStage, deleteStage } from '../../../actions/admin-content-actions'
import type { AdminStage } from '../../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Loader2, Trash2 } from 'lucide-react'

interface StageFormProps {
  pathId: string
  stage?: AdminStage
  nextOrderIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StageForm({ pathId, stage, nextOrderIndex = 0, open, onOpenChange, onSuccess }: StageFormProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')

  const [formData, setFormData] = useState({
    title: stage?.title || '',
    description: stage?.description || '',
    difficulty_level: stage?.difficulty_level || 'beginner',
    order_index: stage?.order_index ?? nextOrderIndex,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!stage

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        const result = await updateStage(stage.stage_id, formData)
        if (!result.success) {
          setError(result.error || tc('error'))
          return
        }
      } else {
        const result = await createStage({ ...formData, path_id: pathId })
        if (!result.success) {
          setError(result.error || tc('error'))
          return
        }
      }
      onOpenChange(false)
      onSuccess?.()
    } catch {
      setError(tc('error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!stage) return
    if (!confirm(t('deleteStageConfirm', { title: stage.title }))) return

    setDeleting(true)
    try {
      const result = await deleteStage(stage.stage_id)
      if (!result.success) {
        setError(result.error || tc('error'))
        return
      }
      onOpenChange(false)
      onSuccess?.()
    } catch {
      setError(tc('error'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? t('editStage') : t('addStage')}</SheetTitle>
          <SheetDescription>
            {isEditing ? t('editStageDescription') : t('addStageDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="stage-title">{t('title')}</Label>
            <Input
              id="stage-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('stageTitlePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description">{t('description_label')}</Label>
            <Textarea
              id="stage-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder={t('stageDescriptionPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-difficulty">{t('difficulty')}</Label>
            <Select
              value={formData.difficulty_level}
              onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
            >
              <SelectTrigger id="stage-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t('difficultyBeginner')}</SelectItem>
                <SelectItem value="intermediate">{t('difficultyIntermediate')}</SelectItem>
                <SelectItem value="advanced">{t('difficultyAdvanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-order">{t('orderIndex')}</Label>
            <Input
              id="stage-order"
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
            <p className="text-xs font-medium text-destructive text-center">{error}</p>
          </div>
        )}

        <SheetFooter className="flex-col sm:flex-row gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="sm:mr-auto"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              <Trash2 className="h-4 w-4" />
              {tc('delete')}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tc('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving || !formData.title}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? tc('saving') : tc('confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}