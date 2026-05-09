'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { AdminPathWithFullContent, AdminStageWithTopics, AdminTopicWithResources, AdminResource } from '../../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Plus, Pencil, BookOpen, FileText, Video, Award, Beaker, Eye } from 'lucide-react'
import { StageForm } from './forms/stage-form'
import { TopicForm } from './forms/topic-form'
import { ResourceForm } from './forms/resource-form'
import { ContentViewDialog } from './content-view-dialog'

interface TopicsBrowserProps {
  paths: AdminPathWithFullContent[]
}

// Resource type icon map
const RESOURCE_ICONS: Record<string, React.ElementType> = {
  VIDEO: Video,
  ARTICLE: FileText,
  INTERNAL_TEXT: BookOpen,
  CERT: Award,
}

// ─── Resource Row ───
function ResourceRow({
  resource,
  onEdit,
  onView,
}: {
  resource: AdminResource
  onEdit: (r: AdminResource) => void
  onView: (r: AdminResource) => void
}) {
  const Icon = RESOURCE_ICONS[resource.resource_type] ?? FileText
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-0 hover:bg-muted/30 group">
      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-foreground truncate">{resource.title || '—'}</span>
        {resource.provider && (
          <span className="text-xs text-muted-foreground ml-2">{resource.provider}</span>
        )}
      </div>
      <Badge variant="outline" className="text-xs shrink-0">
        {resource.resource_type.replace('_', ' ')}
      </Badge>
      {resource.cost_type && resource.cost_type !== 'free' && (
        <Badge variant="secondary" className="text-xs shrink-0 capitalize">{resource.cost_type}</Badge>
      )}
      <Button
        variant="ghost"
        size="xs"
        className="opacity-0 group-hover:opacity-100 shrink-0"
        onClick={(e) => { e.stopPropagation(); onView(resource); }}
      >
        <Eye className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        className="opacity-0 group-hover:opacity-100 shrink-0"
        onClick={(e) => { e.stopPropagation(); onEdit(resource); }}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  )
}

// ─── Topic Row ───
function TopicRow({
  topic,
  onEditTopic,
  onAddResource,
  onEditResource,
  onViewTopic,
  onViewResource,
}: {
  topic: AdminTopicWithResources
  onEditTopic: (t: AdminTopicWithResources) => void
  onAddResource: (topicId: string) => void
  onEditResource: (r: AdminResource) => void
  onViewTopic: (t: AdminTopicWithResources) => void
  onViewResource: (r: AdminResource) => void
}) {
  const t = useTranslations('Admin.Content.Paths')
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-0">
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 cursor-pointer group"
        onClick={() => setOpen((o) => !o)}
      >
        <button className="text-muted-foreground shrink-0" aria-label="expand">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <span className="w-6 text-xs text-muted-foreground font-mono tabular-nums shrink-0">
          {topic.order_index}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">{topic.title}</span>
        <Badge variant="outline" className="text-xs shrink-0">{topic.topic_type.replace('_', ' ')}</Badge>
        {topic.estimated_time_min && (
          <span className="text-xs text-muted-foreground shrink-0">{topic.estimated_time_min}m</span>
        )}
        <Badge
          variant={topic.is_mandatory ? 'default' : 'secondary'}
          className={`text-xs shrink-0 ${topic.is_mandatory ? 'bg-success/10 text-success border-success/20' : ''}`}
        >
          {topic.is_mandatory ? t('mandatory') : 'Optional'}
        </Badge>
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onAddResource(topic.topic_id); }}>
            <Plus className="h-3 w-3" />
            {t('addResource')}
          </Button>
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onViewTopic(topic); }}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onEditTopic(topic); }}>
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="ml-10 border-l border-border">
          {topic.resources.length === 0 ? (
            <p className="text-xs text-muted-foreground px-4 py-2 italic">{t('noResources')}</p>
          ) : (
            topic.resources.map((res) => (
              <ResourceRow key={res.resource_id} resource={res} onEdit={onEditResource} onView={onViewResource} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Stage Row ───
function StageRow({
  stage,
  pathId,
  onEditStage,
  onAddTopic,
  onEditTopic,
  onAddResource,
  onEditResource,
  onViewStage,
  onViewTopic,
  onViewResource,
}: {
  stage: AdminStageWithTopics
  pathId: string
  onEditStage: (s: AdminStageWithTopics) => void
  onAddTopic: (stageId: string) => void
  onEditTopic: (t: AdminTopicWithResources) => void
  onAddResource: (topicId: string) => void
  onEditResource: (r: AdminResource) => void
  onViewStage: (s: AdminStageWithTopics) => void
  onViewTopic: (t: AdminTopicWithResources) => void
  onViewResource: (r: AdminResource) => void
}) {
  const t = useTranslations('Admin.Content.Paths')
  const [open, setOpen] = useState(false)

  const difficultyColor: Record<string, string> = {
    beginner: 'text-success',
    intermediate: 'text-warning',
    advanced: 'text-destructive',
  }

  return (
    <div className="border-b border-border last:border-0">
      {/* Stage header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50 cursor-pointer group"
        onClick={() => setOpen((o) => !o)}
      >
        <button className="text-muted-foreground shrink-0" aria-label="expand">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="w-6 text-xs text-muted-foreground font-mono tabular-nums shrink-0">
          {stage.order_index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{stage.title}</p>
          {stage.description && (
            <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
          )}
        </div>
        <span
          className={`text-xs font-medium capitalize shrink-0 ${difficultyColor[stage.difficulty_level ?? ''] ?? 'text-muted-foreground'}`}
        >
          {stage.difficulty_level ?? '—'}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {stage.topics.length} {t('addTopic').replace('Add ', '')}s
        </span>
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onAddTopic(stage.stage_id); }}>
            <Plus className="h-3 w-3" />
            {t('addTopic')}
          </Button>
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onViewStage(stage); }}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onEditStage(stage); }}>
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Topics */}
      {open && (
        <div className="ml-6 border-l border-border">
          {stage.topics.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">{t('noTopics')}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onAddTopic(stage.stage_id)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {t('addTopic')}
              </Button>
            </div>
          ) : (
            stage.topics.map((topic) => (
              <TopicRow
                key={topic.topic_id}
                topic={topic}
                onEditTopic={onEditTopic}
                onAddResource={onAddResource}
                onEditResource={onEditResource}
                onViewTopic={onViewTopic}
                onViewResource={onViewResource}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───
export function TopicsBrowser({ paths }: TopicsBrowserProps) {
  const t = useTranslations('Admin.Content.Paths')

  const [selectedPathId, setSelectedPathId] = useState<string>('')

  // Form state
  const [stageFormOpen, setStageFormOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<AdminStageWithTopics | null>(null)
  const [stageFormPathId, setStageFormPathId] = useState('')

  const [topicFormOpen, setTopicFormOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<AdminTopicWithResources | null>(null)
  const [topicFormStageId, setTopicFormStageId] = useState('')

  const [resourceFormOpen, setResourceFormOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<AdminResource | null>(null)
  const [resourceFormTopicId, setResourceFormTopicId] = useState('')

  const [viewEntity, setViewEntity] = useState<{
    type: 'stage' | 'topic' | 'resource'
    data: AdminStageWithTopics | AdminTopicWithResources | AdminResource
  } | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const selectedPath = paths.find((p) => p.path_id === selectedPathId)

  const openAddStage = (pathId: string) => {
    setStageFormPathId(pathId)
    setEditingStage(null)
    setStageFormOpen(true)
  }

  const openEditStage = (stage: AdminStageWithTopics) => {
    setEditingStage(stage)
    setStageFormPathId(stage.path_id)
    setStageFormOpen(true)
  }

  const openAddTopic = (stageId: string) => {
    setTopicFormStageId(stageId)
    setEditingTopic(null)
    setTopicFormOpen(true)
  }

  const openEditTopic = (topic: AdminTopicWithResources) => {
    setEditingTopic(topic)
    setTopicFormStageId(topic.stage_id)
    setTopicFormOpen(true)
  }

  const openAddResource = (topicId: string) => {
    setResourceFormTopicId(topicId)
    setEditingResource(null)
    setResourceFormOpen(true)
  }

  const openEditResource = (resource: AdminResource) => {
    setEditingResource(resource)
    setResourceFormTopicId(resource.topic_id)
    setResourceFormOpen(true)
  }

  const openViewStage = (stage: AdminStageWithTopics) => {
    setViewEntity({ type: 'stage', data: stage })
    setViewDialogOpen(true)
  }

  const openViewTopic = (topic: AdminTopicWithResources) => {
    setViewEntity({ type: 'topic', data: topic })
    setViewDialogOpen(true)
  }

  const openViewResource = (resource: AdminResource) => {
    setViewEntity({ type: 'resource', data: resource })
    setViewDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Path selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedPathId}
          onChange={(e) => setSelectedPathId(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
        >
          <option value="">Select a path...</option>
          {paths.map((p) => (
            <option key={p.path_id} value={p.path_id}>{p.name}</option>
          ))}
        </select>

        {selectedPath && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openAddStage(selectedPath.path_id)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t('addStage')}
          </Button>
        )}
      </div>

      {/* Hierarchy table */}
      {selectedPath ? (
        selectedPath.stages.length === 0 ? (
          <div className="border border-border rounded-lg py-16 text-center">
            <Beaker className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('noStages')}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => openAddStage(selectedPath.path_id)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t('addStage')}
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            {selectedPath.stages.map((stage) => (
              <StageRow
                key={stage.stage_id}
                stage={stage}
                pathId={selectedPath.path_id}
                onEditStage={openEditStage}
                onAddTopic={openAddTopic}
                onEditTopic={openEditTopic}
                onAddResource={openAddResource}
                onEditResource={openEditResource}
                onViewStage={openViewStage}
                onViewTopic={openViewTopic}
                onViewResource={openViewResource}
              />
            ))}
          </div>
        )
      ) : (
        <div className="border border-border rounded-lg py-12 text-center">
          <p className="text-sm text-muted-foreground">Select a path above to manage its stages and topics.</p>
        </div>
      )}

      {/* Stage form */}
      <StageForm
        pathId={stageFormPathId}
        stage={editingStage
          ? {
              ...editingStage,
              topic_count: editingStage.topics.length,
              learner_count: 0,
            }
          : undefined
        }
        nextOrderIndex={selectedPath ? selectedPath.stages.length : 0}
        open={stageFormOpen}
        onOpenChange={setStageFormOpen}
      />

      {/* Topic form */}
      <TopicForm
        stageId={topicFormStageId}
        topic={editingTopic
          ? {
              topic_id: editingTopic.topic_id,
              stage_id: editingTopic.stage_id,
              title: editingTopic.title,
              summary: editingTopic.summary,
              topic_type: editingTopic.topic_type,
              estimated_time_min: editingTopic.estimated_time_min,
              difficulty_level: editingTopic.difficulty_level,
              is_mandatory: editingTopic.is_mandatory,
              order_index: editingTopic.order_index,
            }
          : undefined
        }
        nextOrderIndex={0}
        open={topicFormOpen}
        onOpenChange={setTopicFormOpen}
      />

      {/* Resource form */}
      <ResourceForm
        topicId={resourceFormTopicId}
        resource={editingResource ?? undefined}
        nextOrderIndex={0}
        open={resourceFormOpen}
        onOpenChange={setResourceFormOpen}
      />

      {/* Content View Dialog */}
      <ContentViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        entity={viewEntity}
      />
    </div>
  )
}
