'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { blockLearner, unblockLearner } from '../../actions/admin-content-actions'
import type { AdminLearner } from '../../types'
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

interface LearnersTableProps {
  initialLearners: AdminLearner[]
}

export function LearnersTable({ initialLearners }: LearnersTableProps) {
  const t = useTranslations('Admin.Learners')
  const tc = useTranslations('Admin.Common')

  const [learners, setLearners] = useState(initialLearners)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedLearner, setSelectedLearner] = useState<AdminLearner | null>(null)

  const handleBlock = async (userId: string) => {
    const confirmed = window.confirm(t('confirmBlock'))
    if (!confirmed) return

    setLoadingId(userId)
    const result = await blockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'blocked' } : l))
      if (selectedLearner?.user_id === userId) {
        setSelectedLearner(prev => prev ? { ...prev, status: 'blocked' } : null)
      }
    }
    setLoadingId(null)
  }

  const handleUnblock = async (userId: string) => {
    setLoadingId(userId)
    const result = await unblockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'active' } : l))
      if (selectedLearner?.user_id === userId) {
        setSelectedLearner(prev => prev ? { ...prev, status: 'active' } : null)
      }
    }
    setLoadingId(null)
  }

  const learner = selectedLearner

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
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); handleBlock(l.user_id) }}
                      disabled={loadingId === l.user_id}
                      className="text-destructive hover:text-destructive"
                    >
                      {t('block')}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); handleUnblock(l.user_id) }}
                      disabled={loadingId === l.user_id}
                      className="text-success hover:text-success"
                    >
                      {t('unblock')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {learners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                  {t('noLearners')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!learner} onOpenChange={(open) => { if (!open) setSelectedLearner(null) }}>
        {learner && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle>{learner.first_name} {learner.last_name}</DialogTitle>
                <Badge
                  variant={learner.status === 'active' ? 'default' : 'destructive'}
                  className={learner.status === 'active'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                  }
                >
                  {t(learner.status as any)}
                </Badge>
              </div>
              <DialogDescription>{t('detailTitle')}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-2">
              <InfoField label={t('email')} value={learner.email} mono />
              <InfoField label={t('path')} value={learner.path_name || t('noPath')} />
              <InfoField label={t('onboarding')} value={learner.onboarding_completed ? t('completed') : t('notCompleted')} />
              <InfoField label={t('status')} value={t(learner.status as any)} />
              <InfoField label={t('joined')} value={new Date(learner.created_at).toLocaleDateString()} />
              <InfoField label={t('progress')} value={`${learner.progress_percent}%`} />
              <InfoField label={t('lastActive')} value={learner.last_active ? new Date(learner.last_active).toLocaleDateString() : t('never')} />
              <InfoField label={t('userId')} value={learner.user_id.slice(0, 8) + '…'} mono />
            </div>

            <DialogFooter>
              {learner.status === 'active' ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBlock(learner.user_id)}
                  disabled={loadingId === learner.user_id}
                >
                  {t('block')}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(learner.user_id)}
                  disabled={loadingId === learner.user_id}
                  className="text-success border-success/30 hover:bg-success/10"
                >
                  {t('unblock')}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
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
