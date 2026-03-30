'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { deactivateAdmin } from '../../actions/admin-content-actions'
import type { AdminUser } from '../../types'

interface AdminAccountsTableProps {
  initialAdmins: AdminUser[]
}

export function AdminAccountsTable({ initialAdmins }: AdminAccountsTableProps) {
  const t = useTranslations('Admin.Settings')
  const tc = useTranslations('Admin.Common')
  
  const [admins, setAdmins] = useState(initialAdmins)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDeactivate = async (adminId: string) => {
    const confirmed = window.confirm(t('confirmDeactivate'))
    if (!confirmed) return

    setLoadingId(adminId)
    const result = await deactivateAdmin(adminId)
    if (result.success) {
      setAdmins(prev => prev.filter(a => a.user_id !== adminId))
    } else {
      alert(result.error)
    }
    setLoadingId(null)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('displayName')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('level')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('created')}</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{tc('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {admins.map((admin) => (
              <tr key={admin.user_id} className="hover:bg-zinc-800/30 transition-all duration-200 group">
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                      {admin.display_name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono italic">{admin.email}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-black tracking-[0.1em] border ${
                    admin.admin_level === 'super' 
                      ? 'bg-violet-500/5 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                      : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50'
                  }`}>
                    {t(admin.admin_level as any)}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-500 font-mono text-xs italic">
                  {new Date(admin.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  {admin.admin_level !== 'super' && (
                    <button
                      onClick={() => handleDeactivate(admin.user_id)}
                      disabled={loadingId === admin.user_id}
                      className="text-[10px] font-black uppercase text-red-500/60 hover:text-red-400 transition-all tracking-widest disabled:opacity-30"
                    >
                      {t('deactivate')}
                    </button>
                  )}
                  {admin.admin_level === 'super' && (
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic cursor-not-allowed">
                      Immutable
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-zinc-600 italic font-mono uppercase tracking-widest text-xs">
                  {t('noAdmins')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
