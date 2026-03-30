'use client'

import { useTranslations } from 'next-intl'
import { Clock } from 'lucide-react'
import type { AdminAuditLogEntry } from '../../types'

export function RecentActivity({ entries }: { entries: AdminAuditLogEntry[] }) {
  const t = useTranslations('Admin.Dashboard')

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">{t('RecentActivity')}</h2>
        <Clock className="w-4 h-4 text-zinc-600" />
      </div>
      <div className="divide-y divide-zinc-800/50">
        {entries.map((entry) => (
          <div key={entry.log_id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-zinc-400">{entry.event_type}</span>
              <span className="text-[10px] text-zinc-600">
                {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-1">{entry.description}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="px-5 py-8 text-center text-zinc-600 font-mono uppercase tracking-widest text-[10px] italic">
            {t('noRecentActivity')}
          </div>
        )}
      </div>
    </div>
  )
}
