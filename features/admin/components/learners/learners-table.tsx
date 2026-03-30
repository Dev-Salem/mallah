'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { blockLearner, unblockLearner } from '../../actions/admin-content-actions'
import type { AdminLearner } from '../../types'

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
    setLoadingId(userId === null ? null : null) // Force re-render if needed, but actually just set null
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('name')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('email')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('path')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('status')}</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('joined')}</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{tc('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {learners.map((learner) => (
              <tr key={learner.user_id} className="hover:bg-zinc-800/30 transition-all duration-200 group">
                <td className="px-5 py-4 font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                  {learner.first_name} {learner.last_name}
                </td>
                <td className="px-5 py-4 text-zinc-400 font-mono text-xs">{learner.email}</td>
                <td className="px-5 py-4">
                  <span className="text-zinc-500 italic text-xs">{learner.path_name || '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase font-bold rounded tracking-tight border ${
                      learner.status === 'active' 
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/5 text-red-400 border-red-500/20'
                    }`}
                  >
                    {t(learner.status as any)}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-500 text-right font-mono text-xs">
                  {new Date(learner.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  {learner.status === 'active' ? (
                    <button
                      onClick={() => handleBlock(learner.user_id)}
                      disabled={loadingId === learner.user_id}
                      className="text-[10px] uppercase font-bold text-red-500/70 hover:text-red-400 transition-colors disabled:opacity-50 tracking-tighter"
                    >
                      {t('block')}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(learner.user_id)}
                      disabled={loadingId === learner.user_id}
                      className="text-[10px] uppercase font-bold text-emerald-500/70 hover:text-emerald-400 transition-colors disabled:opacity-50 tracking-tighter"
                    >
                      {t('unblock')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {learners.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 italic">{t('noLearners')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
