'use client'

import { useTranslations } from 'next-intl'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminAuditLogEntry } from '../../types'

export function RecentActivity({ entries }: { entries: AdminAuditLogEntry[] }) {
  const t = useTranslations('Admin.Dashboard')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('RecentActivity')}
          </CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <div key={entry.log_id} className="px-6 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{entry.event_type}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{entry.description}</p>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="px-6 py-8 text-center text-muted-foreground text-sm">
              {t('noRecentActivity')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
