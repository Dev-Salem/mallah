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

interface LearnersTableProps {
  initialLearners: AdminLearner[]
}

export function LearnersTable({ initialLearners }: LearnersTableProps) {
  const t = useTranslations('Admin.Learners')
  const tc = useTranslations('Admin.Common')
  
  const [learners, setLearners] = useState(initialLearners)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleBlock = async (userId: string) => {
    const confirmed = window.confirm(t('confirmBlock'))
    if (!confirmed) return

    setLoadingId(userId)
    const result = await blockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'blocked' } : l))
    }
    setLoadingId(null)
  }

  const handleUnblock = async (userId: string) => {
    setLoadingId(userId)
    const result = await unblockLearner(userId)
    if (result.success) {
      setLearners(prev => prev.map(l => l.user_id === userId ? { ...l, status: 'active' } : l))
    }
    setLoadingId(null)
  }

  return (
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
          {learners.map((learner) => (
            <TableRow key={learner.user_id}>
              <TableCell className="font-medium text-foreground">
                {learner.first_name} {learner.last_name}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">{learner.email}</TableCell>
              <TableCell>
                <span className="text-muted-foreground text-xs">{learner.path_name || '—'}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={learner.status === 'active' ? 'default' : 'destructive'}
                  className={learner.status === 'active'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                  }
                >
                  {t(learner.status as any)}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground font-mono text-xs">
                {new Date(learner.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {learner.status === 'active' ? (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleBlock(learner.user_id)}
                    disabled={loadingId === learner.user_id}
                    className="text-destructive hover:text-destructive"
                  >
                    {t('block')}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleUnblock(learner.user_id)}
                    disabled={loadingId === learner.user_id}
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
  )
}
