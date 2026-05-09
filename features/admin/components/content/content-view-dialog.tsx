'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { AdminStageWithTopics, AdminTopicWithResources, AdminResource } from '../../types'
import { FileText, Video, BookOpen, Award, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface ContentViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: {
    type: 'stage' | 'topic' | 'resource'
    data: AdminStageWithTopics | AdminTopicWithResources | AdminResource
  } | null
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  VIDEO: Video,
  ARTICLE: FileText,
  INTERNAL_TEXT: BookOpen,
  CERT: Award,
}

export function ContentViewDialog({ open, onOpenChange, entity }: ContentViewDialogProps) {
  const t = useTranslations('Admin.Content.Paths')

  if (!entity) return null

  const renderStage = (stage: AdminStageWithTopics) => (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-foreground mb-1">Description</h4>
        <p className="text-muted-foreground">{stage.description || 'No description provided.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-foreground mb-1">Difficulty</h4>
          <span className="capitalize text-muted-foreground">{stage.difficulty_level || '—'}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Order Index</h4>
          <span className="text-muted-foreground">{stage.order_index}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Topics Count</h4>
          <span className="text-muted-foreground">{stage.topics?.length || 0}</span>
        </div>
      </div>
    </div>
  )

  const renderTopic = (topic: AdminTopicWithResources) => (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-foreground mb-1">Summary</h4>
        <p className="text-muted-foreground">{topic.summary || 'No summary provided.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-foreground mb-1">Type</h4>
          <Badge variant="outline" className="capitalize">{topic.topic_type.replace('_', ' ')}</Badge>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Difficulty</h4>
          <span className="capitalize text-muted-foreground">{topic.difficulty_level || '—'}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Estimated Time</h4>
          <span className="text-muted-foreground">{topic.estimated_time_min ? `${topic.estimated_time_min} min` : '—'}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Status</h4>
          <Badge variant={topic.is_mandatory ? 'default' : 'secondary'}>
            {topic.is_mandatory ? 'Mandatory' : 'Optional'}
          </Badge>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Order Index</h4>
          <span className="text-muted-foreground">{topic.order_index}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Resources Count</h4>
          <span className="text-muted-foreground">{topic.resources?.length || 0}</span>
        </div>
      </div>
    </div>
  )

  const renderResource = (resource: AdminResource) => {
    const Icon = RESOURCE_ICONS[resource.resource_type] ?? FileText
    return (
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Badge variant="outline" className="capitalize">{resource.resource_type.replace('_', ' ')}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {resource.provider && (
            <div>
              <h4 className="font-semibold text-foreground mb-1">Provider</h4>
              <span className="text-muted-foreground">{resource.provider}</span>
            </div>
          )}
          {resource.cost_type && (
            <div>
              <h4 className="font-semibold text-foreground mb-1">Cost</h4>
              <span className="capitalize text-muted-foreground">
                {resource.cost_type} {resource.cost_note ? `(${resource.cost_note})` : ''}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-foreground mb-1">Order Index</h4>
            <span className="text-muted-foreground">{resource.order_index}</span>
          </div>
        </div>

        {resource.url && (
          <div>
            <h4 className="font-semibold text-foreground mb-1">URL</h4>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {resource.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {resource.content && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Content</h4>
            <div className="bg-muted/30 p-4 rounded-md prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{resource.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    )
  }

  const getTitle = () => {
    if (entity.type === 'stage') return (entity.data as AdminStageWithTopics).title
    if (entity.type === 'topic') return (entity.data as AdminTopicWithResources).title
    if (entity.type === 'resource') return (entity.data as AdminResource).title || 'Resource Details'
    return ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
              {entity.type}
            </span>
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-4">
            {entity.type === 'stage' && renderStage(entity.data as AdminStageWithTopics)}
            {entity.type === 'topic' && renderTopic(entity.data as AdminTopicWithResources)}
            {entity.type === 'resource' && renderResource(entity.data as AdminResource)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
