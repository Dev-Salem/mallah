'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  getStagesForPath,
  getTopicsForStage,
} from '../../actions/admin-content-actions'
import type { AdminPath, AdminStage, AdminTopic } from '../../types'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TopicsBrowserProps {
  paths: AdminPath[]
}

export function TopicsBrowser({ paths }: TopicsBrowserProps) {
  const t = useTranslations('Admin.Content.Topics')
  
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [stages, setStages] = useState<AdminStage[]>([])
  const [topics, setTopics] = useState<AdminTopic[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedPath) { setStages([]); setSelectedStage(''); setTopics([]); return }
    setLoading(true)
    getStagesForPath(selectedPath).then(data => {
      setStages(data)
      setSelectedStage('')
      setTopics([])
      setLoading(false)
    })
  }, [selectedPath])

  useEffect(() => {
    if (!selectedStage) { setTopics([]); return }
    setLoading(true)
    getTopicsForStage(selectedStage).then(data => {
      setTopics(data)
      setLoading(false)
    })
  }, [selectedStage])

  const selectedPathName = paths.find(p => p.path_id === selectedPath)?.name || ''
  const selectedStageName = stages.find((s) => s.stage_id === selectedStage)?.title || ''

  return (
    <div className="space-y-4">
      {/* Path/Stage Selectors */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
        >
          <option value="">{t('selectPath')}</option>
          {paths.map((p) => (
            <option key={p.path_id} value={p.path_id}>{p.name}</option>
          ))}
        </select>

        {stages.length > 0 && (
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
          >
            <option value="">{t('selectStage')}</option>
            {stages.map((s) => (
              <option key={s.stage_id} value={s.stage_id}>
                {s.order_index}. {s.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Breadcrumb */}
      {selectedPath && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{selectedPathName}</span>
          {selectedStageName && (
            <>
              <span>/</span>
              <span className="font-medium">{selectedStageName}</span>
            </>
          )}
          {selectedStage && (
            <>
              <span>/</span>
              <span className="font-medium text-primary">{t('title')}</span>
            </>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Topics Table */}
      {!loading && topics.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead className="text-right">{t('estimated_time')}</TableHead>
                <TableHead>{t('difficulty')}</TableHead>
                <TableHead className="text-center">{t('mandatory')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.topic_id}>
                  <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                    {topic.order_index}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {topic.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {topic.topic_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {topic.estimated_time_min ? `${topic.estimated_time_min}m` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {topic.difficulty_level || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={topic.is_mandatory ? 'default' : 'secondary'}
                      className={topic.is_mandatory ? 'bg-success/10 text-success border-success/20' : ''}
                    >
                      {topic.is_mandatory ? t('yes') : t('no')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && selectedStage && topics.length === 0 && (
        <div className="border border-border rounded-lg py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t('noTopics')}
          </p>
        </div>
      )}
    </div>
  )
}
