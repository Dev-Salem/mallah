'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createTopic, updateTopic, deleteTopic } from '../../../actions/admin-content-actions'
import type { AdminTopic } from '../../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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

interface TopicFormProps {
  stageId: string
  topic?: AdminTopic
  nextOrderIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TopicForm({ stageId, topic, nextOrderIndex = 0, open, onOpenChange, onSuccess }: TopicFormProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')

  const [formData, setFormData] = useState({
    title: topic?.title || '',
    summary: topic?.summary || '',
    topic_type: topic?.topic_type || 'lesson',
    estimated_time_min: topic?.estimated_time_min || 30,
    difficulty_level: topic?.difficulty_level || 'beginner',
    is_mandatory: topic?.is_mandatory ?? true,
    order_index: topic?.order_index ?? nextOrderIndex,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!topic

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        const result = await updateTopic(topic.topic_id, formData)
        if (!result.success) {
          setError(result.error || tc('error'))
          return
        }
      } else {
        const result = await createTopic({ ...formData, stage_id: stageId })
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
    if (!topic) return
    if (!confirm(t('deleteTopicConfirm', { title: topic.title }))) return

    setDeleting(true)
    try {
      const result = await deleteTopic(topic.topic_id)
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
          <SheetTitle>{isEditing ? t('editTopic') : t('addTopic')}</SheetTitle>
          <SheetDescription>
            {isEditing ? t('editTopicDescription') : t('addTopicDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic-title">{t('title')}</Label>
            <Input
              id="topic-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('topicTitlePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-summary">{t('summary')}</Label>
            <Textarea
              id="topic-summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              placeholder={t('topicSummaryPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-type">{t('topicType')}</Label>
            <Select
              value={formData.topic_type}
              onValueChange={(value) => setFormData({ ...formData, topic_type: value })}
            >
              <SelectTrigger id="topic-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lesson">{t('topicTypeLesson')}</SelectItem>
                <SelectItem value="lesson_lab">{t('topicTypeLessonLab')}</SelectItem>
                <SelectItem value="project_coding">{t('topicTypeProjectCoding')}</SelectItem>
                <SelectItem value="project_design">{t('topicTypeProjectDesign')}</SelectItem>
                <SelectItem value="project_other">{t('topicTypeProjectOther')}</SelectItem>
                <SelectItem value="quiz">{t('topicTypeQuiz')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic-time">{t('estimatedTime')}</Label>
              <Input
                id="topic-time"
                type="number"
                min="1"
                value={formData.estimated_time_min}
                onChange={(e) => setFormData({ ...formData, estimated_time_min: parseInt(e.target.value) || 30 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic-difficulty">{t('difficulty')}</Label>
              <Select
                value={formData.difficulty_level || 'beginner'}
                onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
              >
                <SelectTrigger id="topic-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t('difficultyBeginner')}</SelectItem>
                  <SelectItem value="intermediate">{t('difficultyIntermediate')}</SelectItem>
                  <SelectItem value="advanced">{t('difficultyAdvanced')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-order">{t('orderIndex')}</Label>
            <Input
              id="topic-order"
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-input p-3">
            <div className="space-y-0.5">
              <Label htmlFor="topic-mandatory">{t('mandatory')}</Label>
              <p className="text-xs text-muted-foreground">{t('mandatoryDescription')}</p>
            </div>
            <Switch
              id="topic-mandatory"
              checked={formData.is_mandatory}
              onCheckedChange={(checked) => setFormData({ ...formData, is_mandatory: checked })}
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