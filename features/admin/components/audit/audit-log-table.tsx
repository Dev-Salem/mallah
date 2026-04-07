'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AdminAuditLogEntry } from '../../types'
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

interface AuditLogTableProps {
  initialEntries: AdminAuditLogEntry[]
  totalCount: number
  currentPage: number
}

export function AuditLogTable({ initialEntries, totalCount, currentPage }: AuditLogTableProps) {
  const router = useRouter()
  const t = useTranslations('Admin.Audit')
  const tc = useTranslations('Admin.Common')
  
  const totalPages = Math.ceil(totalCount / 25)

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', page.toString())
    router.push(`?${searchParams.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('timestamp')}</TableHead>
              <TableHead>{t('event')}</TableHead>
              <TableHead>{t('details')}</TableHead>
              <TableHead>{t('target')}</TableHead>
              <TableHead>{t('admin')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialEntries.map((log) => (
              <TableRow key={log.log_id}>
                <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {log.event_type.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-xs min-w-[300px]">
                  {log.description}
                </TableCell>
                <TableCell>
                  {log.entity_type && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground capitalize">{log.entity_type}</span>
                      <span className="text-xs text-muted-foreground font-mono truncate w-28">{log.entity_id}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {log.admin_display_name || log.admin_id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{log.admin_email || '—'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {initialEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  {tc('noActivity')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {tc('showing')} <span className="font-medium">{initialEntries.length}</span> {tc('of')} <span className="font-medium">{totalCount}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              {tc('previous')}
            </Button>
            <div className="flex items-center gap-1 px-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{currentPage}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              {tc('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
