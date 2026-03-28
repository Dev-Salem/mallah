'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { verifySkill, rejectSkill, createSkill } from '../../actions/admin-content-actions'
import type { AdminSkill } from '../../types'

const CATEGORIES = ['fundamentals', 'language', 'framework_library', 'tool', 'platform_service', 'practice', 'other'] as const

export function SkillsTable({ initialSkills }: { initialSkills: AdminSkill[] }) {
  const t = useTranslations('Admin.Skills')
  const tc = useTranslations('Admin.Common')
  
  const [skills] = useState(initialSkills)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [newSkill, setNewSkill] = useState({ skill_id: '', name: '', category: 'fundamentals' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const filtered = skills.filter((s) => {
    if (filter === 'verified' && !s.is_verified) return false
    if (filter === 'pending' && s.is_verified) return false
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    return true
  })

  const handleVerify = async (skillId: string) => {
    await verifySkill(skillId)
  }

  const handleReject = async (skillId: string) => {
    const confirmed = window.confirm(tc('confirm'))
    if (!confirmed) return
    await rejectSkill(skillId)
  }

  const handleCreateSkill = async () => {
    setSaving(true)
    setError('')
    const id = newSkill.skill_id || newSkill.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    const result = await createSkill({ skill_id: id, name: newSkill.name, category: newSkill.category })
    if (!result.success) setError(result.error || 'Failed')
    else {
      setShowCreate(false)
      setNewSkill({ skill_id: '', name: '', category: 'fundamentals' })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'verified' | 'pending')}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-zinc-700 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="verified">{t('verified')}</option>
            <option value="pending">{t('pending')}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-zinc-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-zinc-200 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          + {t('add')}
        </button>
      </div>

      {/* Table Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('name')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('category')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{tc('status')}</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{tc('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((skill) => (
                <tr key={skill.skill_id} className="hover:bg-zinc-800/40 transition-all duration-300 group/row">
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="text-zinc-100 font-black tracking-tight uppercase group-hover/row:text-blue-400 transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono italic lowercase">{skill.skill_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/30 px-2.5 py-1 rounded-md border border-zinc-800/50">
                      {t(`categories.${skill.category as any}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase rounded tracking-widest border ${
                        skill.is_verified 
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.05)]' 
                          : 'bg-amber-500/5 text-amber-500/80 border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                      }`}
                    >
                      {skill.is_verified ? t('verified') : t('pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    {!skill.is_verified ? (
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleVerify(skill.skill_id)}
                          className="text-[10px] font-black uppercase text-emerald-500/70 hover:text-emerald-400 transition-all tracking-widest"
                        >
                          {t('verify')}
                        </button>
                        <button
                          onClick={() => handleReject(skill.skill_id)}
                          className="text-[10px] font-black uppercase text-red-500/60 hover:text-red-400 transition-all tracking-widest"
                        >
                          {t('reject')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">
                      {filter === 'pending' ? 'No pending validations detected' : 'Skills vault empty'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Drawer */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] transition-all duration-500" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out">
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tightest uppercase italic">
                    {t('add')}
                  </h2>
                  <div className="h-1 w-12 bg-blue-600/50 rounded-full" />
                </div>
                <button 
                  onClick={() => setShowCreate(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('name')}</label>
                  <input
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Advanced TypeScript"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('category')}</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:bg-zinc-800/50 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{t(`categories.${c}`)}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <p className="text-[10px] text-zinc-600 italic leading-relaxed uppercase tracking-widest">
                      New skills will be created in <span className="text-emerald-500 font-black">Verified</span> status by default when created via Administrative Console.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <p className="text-xs text-red-500 font-black uppercase tracking-widest italic text-center">
                    ⚠️ {error}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleCreateSkill}
                  disabled={saving || !newSkill.name}
                  className="flex-1 py-4.5 bg-zinc-100 text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-2xl shadow-white/5 active:scale-[0.98] disabled:opacity-30"
                >
                  {saving ? tc('saving') : tc('confirm')}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-4.5 bg-zinc-900 text-zinc-500 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all border border-zinc-800"
                >
                  {tc('cancel')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
