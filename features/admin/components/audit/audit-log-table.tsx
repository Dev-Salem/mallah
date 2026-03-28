'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { AdminAuditLogEntry } from '../../types'

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
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('timestamp')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('event')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('details')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('target')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('admin')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {initialEntries.map((log) => (
                <tr key={log.log_id} className="hover:bg-zinc-800/40 transition-all duration-300 group/row">
                  <td className="px-6 py-4.5 text-zinc-500 whitespace-nowrap font-mono text-xs italic tabular-nums">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="px-2.5 py-1 bg-zinc-950/50 border border-zinc-800/80 rounded-md text-[10px] text-blue-400 font-black tracking-widest uppercase italic shadow-sm">
                      {log.event_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-zinc-300 min-w-[300px] leading-relaxed group-hover/row:text-zinc-100 transition-colors text-xs">
                    {log.description}
                  </td>
                  <td className="px-6 py-4.5">
                    {log.entity_type && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest italic">{log.entity_type}</span>
                        <span className="text-[10px] text-zinc-400 font-mono tracking-tighter truncate w-28 uppercase opacity-60">{log.entity_id}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-200 font-black text-[11px] uppercase tracking-tight group-hover/row:text-blue-400 transition-colors italic">
                        {log.admin_display_name || log.admin_id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono italic opacity-70 lowercase">{log.admin_email || '—'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {initialEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">
                      {tc('noActivity')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-8 border-t border-zinc-800/50 bg-zinc-950/20 rounded-2xl ring-1 ring-zinc-800/50">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
            {tc('showing')} <span className="text-zinc-400">{initialEntries.length}</span> {tc('of')} <span className="text-zinc-400">{totalCount}</span> {tc('ledger_entries')}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              ← {tc('previous')}
            </button>
            <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800/50">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-black shadow-[0_0_15px_rgba(59,130,246,0.5)] italic">
                {currentPage}
              </span>
              <span className="text-zinc-800 font-black">/</span>
              <span className="text-zinc-600 text-[11px] font-black uppercase italic tracking-widest">{totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              {tc('next')} →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
