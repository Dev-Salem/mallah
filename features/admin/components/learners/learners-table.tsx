'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { blockLearner, unblockLearner, getAdminLearnerDetail } from '../../actions/admin-content-actions'
import type { AdminLearner, AdminLearnerDetail } from '../../types'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react'

interface LearnersTableProps {
  initialLearners: AdminLearner[]
}

export function LearnersTable({ initialLearners }: LearnersTableProps) {
  const t = useTranslations('Admin.Learners')
  const tc = useTranslations('Admin.Common')

  const [learners, setLearners] = useState(initialLearners)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedLearner, setSelectedLearner] = useState<AdminLearner | null>(null)
  const [detail, setDetail] = useState<AdminLearnerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    if (!selectedLearner) { setDetail(null); return }
    setDetailLoading(true)
    getAdminLearnerDetail(selectedLearner.user_id).then(d => { setDetail(d); setDetailLoading(false) })
  }, [selectedLearner?.user_id])

  const handleBlock = async (userId: string) => {
    const confirmed = window.confirm(t('confirmBlock'))
    if (!confirmed) return
    setLoadingId(userId)
    const result = await blockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'blocked' } : l))
      if (selectedLearner?.user_id === userId) setSelectedLearner(prev => prev ? { ...prev, status: 'blocked' } : null)
      if (detail?.user_id === userId) setDetail(prev => prev ? { ...prev, status: 'blocked' } : null)
    }
    setLoadingId(null)
  }

  const handleUnblock = async (userId: string) => {
    setLoadingId(userId)
    const result = await unblockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'active' } : l))
      if (selectedLearner?.user_id === userId) setSelectedLearner(prev => prev ? { ...prev, status: 'active' } : null)
      if (detail?.user_id === userId) setDetail(prev => prev ? { ...prev, status: 'active' } : null)
    }
    setLoadingId(null)
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('path')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('joined')}</TableHead>
              <TableHead className="text-right">{tc('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((l) => (
              <TableRow
                key={l.user_id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedLearner(l)}
              >
                <TableCell className="font-medium text-foreground">
                  {l.first_name} {l.last_name}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{l.email}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-xs">{l.path_name || '—'}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={l.status === 'active' ? 'default' : 'destructive'}
                    className={l.status === 'active'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {t(l.status as any)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground font-mono text-xs">
                  {new Date(l.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {l.status === 'active' ? (
                    <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); handleBlock(l.user_id) }} disabled={loadingId === l.user_id} className="text-destructive hover:text-destructive">
                      {t('block')}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); handleUnblock(l.user_id) }} disabled={loadingId === l.user_id} className="text-success hover:text-success">
                      {t('unblock')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {learners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">{t('noLearners')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLearner} onOpenChange={(open) => { if (!open) { setSelectedLearner(null); setDetail(null) } }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
          {selectedLearner && (
            <>
              <div className="px-6 pt-6 pb-2">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <DialogTitle>{selectedLearner.first_name} {selectedLearner.last_name}</DialogTitle>
                    <Badge variant={selectedLearner.status === 'active' ? 'default' : 'destructive'} className={selectedLearner.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                      {t(selectedLearner.status as any)}
                    </Badge>
                  </div>
                  <DialogDescription>{selectedLearner.email}</DialogDescription>
                </DialogHeader>
              </div>

              <div className="overflow-y-auto px-6 py-2">
                {detailLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : detail ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <StatCard label={t('progress')} value={`${detail.progress_percent}%`} />
                      <StatCard label={t('topicsCompleted')} value={`${detail.topics_completed}/${detail.topics_total}`} />
                      <StatCard label={t('projectsCompleted')} value={`${detail.projects_completed}/${detail.projects_total}`} />
                      <StatCard label={t('lastActive')} value={detail.last_active ? new Date(detail.last_active).toLocaleDateString() : t('never')} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <InfoField label={t('path')} value={detail.path_name || t('noPath')} />
                      <InfoField label={t('onboarding')} value={detail.onboarding_completed ? t('completed') : t('notCompleted')} />
                      <InfoField label={t('joined')} value={new Date(detail.created_at).toLocaleDateString()} />
                      {detail.primary_goal && <InfoField label={t('primaryGoal')} value={detail.primary_goal} />}
                    </div>

                    {detail.topic_progress.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">{t('topicProgress')}</h4>
                        <div className="space-y-1">
                          {detail.topic_progress.map(tp => (
                            <div key={tp.topic_id} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-md bg-muted/40">
                              {tp.status === 'completed' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                              ) : tp.status === 'in_progress' ? (
                                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                              <span className="truncate text-foreground">{tp.title}</span>
                              <span className="text-muted-foreground ml-auto shrink-0">{tp.stage_title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {detail.project_progress.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">{t('projectProgress')}</h4>
                        <div className="space-y-1">
                          {detail.project_progress.map(pp => (
                            <div key={pp.project_id} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-md bg-muted/40">
                              {pp.status === 'completed' || pp.status === 'waiting' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                              ) : pp.status === 'in_progress' ? (
                                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                              <span className="truncate text-foreground">{pp.title}</span>
                              <span className="text-muted-foreground ml-auto shrink-0">{pp.stage_title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {detail.topic_progress.length === 0 && detail.project_progress.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('noProgress')}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('noProgress')}</p>
                )}
              </div>

              <div className="px-6 py-4 border-t">
                <DialogFooter>
                  {selectedLearner.status === 'active' ? (
                    <Button variant="destructive" size="sm" onClick={() => handleBlock(selectedLearner.user_id)} disabled={loadingId === selectedLearner.user_id}>
                      {t('block')}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleUnblock(selectedLearner.user_id)} disabled={loadingId === selectedLearner.user_id} className="text-success border-success/30 hover:bg-success/10">
                      {t('unblock')}
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-center">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function InfoField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm text-foreground ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  )
}
