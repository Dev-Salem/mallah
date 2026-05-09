'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createResource, updateResource, deleteResource } from '../../../actions/admin-content-actions'
import type { AdminResource } from '../../../types'
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

interface ResourceFormProps {
  topicId: string
  resource?: AdminResource
  nextOrderIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ResourceForm({ topicId, resource, nextOrderIndex = 0, open, onOpenChange, onSuccess }: ResourceFormProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')

  const [formData, setFormData] = useState({
    resource_type: resource?.resource_type || 'VIDEO',
    title: resource?.title || '',
    url: resource?.url || '',
    content: resource?.content || '',
    provider: resource?.provider || '',
    cost_type: resource?.cost_type || 'free',
    cost_note: resource?.cost_note || '',
    order_index: resource?.order_index ?? nextOrderIndex,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!resource

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (isEditing) {
        const result = await updateResource(resource.resource_id, formData)
        if (!result.success) {
          setError(result.error || tc('error'))
          return
        }
      } else {
        const result = await createResource({ ...formData, topic_id: topicId })
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
    if (!resource) return
    if (!confirm(t('deleteResourceConfirm', { title: resource.title || 'this resource' }))) return

    setDeleting(true)
    try {
      const result = await deleteResource(resource.resource_id)
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
          <SheetTitle>{isEditing ? t('editResource') : t('addResource')}</SheetTitle>
          <SheetDescription>
            {isEditing ? t('editResourceDescription') : t('addResourceDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="resource-type">{t('resourceType')}</Label>
            <Select
              value={formData.resource_type}
              onValueChange={(value) => setFormData({ ...formData, resource_type: value as AdminResource['resource_type'] })}
            >
              <SelectTrigger id="resource-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">{t('resourceTypeVideo')}</SelectItem>
                <SelectItem value="ARTICLE">{t('resourceTypeArticle')}</SelectItem>
                <SelectItem value="INTERNAL_TEXT">{t('resourceTypeInternal')}</SelectItem>
                <SelectItem value="CERT">{t('resourceTypeCert')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-title">{t('title')}</Label>
            <Input
              id="resource-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('resourceTitlePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-url">{t('url')}</Label>
            <Input
              id="resource-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              type="url"
            />
          </div>

          {formData.resource_type === 'INTERNAL_TEXT' && (
            <div className="space-y-2">
              <Label htmlFor="resource-content">{t('content')}</Label>
              <Textarea
                id="resource-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                placeholder={t('contentPlaceholder')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="resource-provider">{t('provider')}</Label>
            <Input
              id="resource-provider"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder={t('providerPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-cost">{t('costType')}</Label>
              <Select
                value={formData.cost_type}
                onValueChange={(value) => setFormData({ ...formData, cost_type: value })}
              >
                <SelectTrigger id="resource-cost">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">{t('costFree')}</SelectItem>
                  <SelectItem value="freemium">{t('costFreemium')}</SelectItem>
                  <SelectItem value="paid">{t('costPaid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-order">{t('orderIndex')}</Label>
              <Input
                id="resource-order"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {(formData.cost_type === 'freemium' || formData.cost_type === 'paid') && (
            <div className="space-y-2">
              <Label htmlFor="resource-cost-note">{t('costNote')}</Label>
              <Input
                id="resource-cost-note"
                value={formData.cost_note}
                onChange={(e) => setFormData({ ...formData, cost_note: e.target.value })}
                placeholder={t('costNotePlaceholder')}
              />
            </div>
          )}
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